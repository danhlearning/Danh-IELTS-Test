const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

let GoogleGenAI = null;
let SchemaType = null;
try {
  const genaiPkg = require('@google/genai');
  GoogleGenAI = genaiPkg.GoogleGenAI;
  SchemaType = genaiPkg.Type;
} catch (e) {}

let mammoth = null;
try {
  mammoth = require('mammoth');
} catch (e) {}

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

function getLocalIPAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

function buildMaskedAndMissing(wordStr) {
  const clean = String(wordStr || 'VOCAB').replace(/[^a-zA-Z]/g, '').toUpperCase() || 'VOCAB';
  const chars = clean.split('');
  if (chars.length <= 3) {
    return {
      masked: chars.map((c, i) => (i === 1 ? '_' : c)).join(' '),
      missing: [chars[1] || 'A']
    };
  }
  const missingIndices = new Set();
  const targetBlanks = Math.min(3, Math.max(2, Math.floor(chars.length / 3)));
  const candidatePositions = [];
  for (let i = 1; i < chars.length - 1; i++) {
    candidatePositions.push(i);
  }
  const step = Math.max(1, Math.floor(candidatePositions.length / targetBlanks));
  for (let idx = 0; idx < candidatePositions.length && missingIndices.size < targetBlanks; idx += step) {
    missingIndices.add(candidatePositions[idx]);
  }
  if (missingIndices.size === 0 && chars.length > 1) {
    missingIndices.add(1);
  }
  const maskedArr = [];
  const missingArr = [];
  chars.forEach((ch, idx) => {
    if (missingIndices.has(idx)) {
      maskedArr.push('_');
      missingArr.push(ch);
    } else {
      maskedArr.push(ch);
    }
  });
  return {
    masked: maskedArr.join(' '),
    missing: missingArr
  };
}

function normalizeImportedQuestion(raw, idx, fallbackMode = 'mixed') {
  const allowedModes = ['letter_fill', 'meaning_match', 'collocation', 'word_class', 'preposition', 'sentence_cloze'];
  let mode = String(raw.mode || '').trim().toLowerCase();
  if (!allowedModes.includes(mode)) {
    if (fallbackMode === 'fill_only') {
      mode = idx % 2 === 0 ? 'letter_fill' : 'sentence_cloze';
    } else if (fallbackMode === 'mcq_only') {
      mode = 'sentence_cloze';
    } else {
      mode = idx % 3 === 0 ? 'letter_fill' : 'sentence_cloze';
    }
  }
  if (fallbackMode === 'mcq_only' && mode === 'letter_fill') {
    mode = 'sentence_cloze';
  }
  if (fallbackMode === 'fill_only' && !['letter_fill', 'sentence_cloze'].includes(mode)) {
    mode = idx % 2 === 0 ? 'letter_fill' : 'sentence_cloze';
  }

  let rawOptions = Array.isArray(raw.options) ? raw.options.map(o => String(o || '').trim()).filter(Boolean) : [];
  let correctIdx = typeof raw.correct === 'number' && raw.correct >= 0 && raw.correct < rawOptions.length ? raw.correct : 0;
  let targetWord = String(raw.target_word || rawOptions[correctIdx] || 'vocabulary').trim();
  // Clean leading A. B. C. D. if present in options
  rawOptions = rawOptions.map(opt => opt.replace(/^[A-Da-d][\.\)\:\-]\s*/, '').trim());
  targetWord = targetWord.replace(/^[A-Da-d][\.\)\:\-]\s*/, '').trim();

  const correctAnswerText = rawOptions[correctIdx] || targetWord;
  const uniqueOpts = [];
  rawOptions.forEach(opt => {
    if (opt && !uniqueOpts.some(u => u.toLowerCase() === opt.toLowerCase())) {
      uniqueOpts.push(opt);
    }
  });
  if (!uniqueOpts.some(u => u.toLowerCase() === correctAnswerText.toLowerCase())) {
    uniqueOpts.unshift(correctAnswerText);
  }
  const fallbackDistractors = ['sustainable', 'implement', 'significant', 'comprehensive', 'negotiate', 'proficient', 'mandatory', 'feasible'];
  for (const d of fallbackDistractors) {
    if (uniqueOpts.length >= 4) break;
    if (!uniqueOpts.some(u => u.toLowerCase() === d.toLowerCase())) {
      uniqueOpts.push(d);
    }
  }
  const finalOptions = uniqueOpts.slice(0, 4);
  let finalCorrect = finalOptions.findIndex(u => u.toLowerCase() === correctAnswerText.toLowerCase());
  if (finalCorrect === -1) {
    finalOptions[0] = correctAnswerText;
    finalCorrect = 0;
  }

  // Ensure single word for letter_fill
  const alphaOnlyWord = targetWord.replace(/[^a-zA-Z]/g, '');
  if (mode === 'letter_fill' && (alphaOnlyWord.length < 3 || alphaOnlyWord.length > 14 || targetWord.includes(' '))) {
    mode = 'sentence_cloze';
  }

  const maskData = buildMaskedAndMissing(alphaOnlyWord || 'ACADEMIC');

  let sentence = String(raw.sentence || '').trim();
  if (!sentence) {
    sentence = `The committee decided to ____ the new strategy to improve overall performance.`;
  }
  if (!sentence.includes('____')) {
    const escapedTarget = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTarget}\\b`, 'i');
    if (regex.test(sentence)) {
      sentence = sentence.replace(regex, '____');
    } else {
      sentence = `${sentence} (____)`;
    }
  }

  const vietnamese = String(raw.vietnamese || '').trim() || `Nghĩa của "${targetWord}" trong ngữ cảnh đề thi`;
  const prompt = String(raw.prompt || '').trim() || (
    mode === 'letter_fill'
      ? 'Chạm các chữ cái bên dưới để hoàn thành từ:'
      : mode === 'meaning_match'
      ? 'Chọn từ tiếng Anh chính xác mang nghĩa:'
      : 'Chọn đáp án chính xác để hoàn thành câu trong đề thi:'
  );

  return {
    id: `custom_exam_${Date.now()}_${idx}`,
    category: 'custom_exam',
    grade_label: String(raw.grade_label || 'ĐỀ TỰ NHẬP').trim(),
    band: String(raw.band || '6.5+').trim(),
    topic: String(raw.topic || 'Đề Thi AI').trim(),
    target_word: mode === 'letter_fill' ? alphaOnlyWord.toLowerCase() : targetWord,
    phonetic: String(raw.phonetic || '').trim(),
    vietnamese,
    mode,
    masked: maskData.masked,
    missing: maskData.missing,
    sentence,
    prompt,
    options: finalOptions,
    correct: finalCorrect,
    explanation: String(raw.explanation || `Đáp án đúng là "${finalOptions[finalCorrect]}" (${vietnamese}).`).trim(),
    real_exam_sentence: sentence.replace(/_{2,}/g, finalOptions[finalCorrect]),
    exam_task: 'Đề Thi Tự Nhập (AI Importer)',
    common_mistake: String(raw.common_mistake || '').trim()
  };
}

function parseExamTextLocally(text, questionCount = 10, questionTypeMode = 'mixed') {
  const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const extracted = [];

  // 1. Try parsing numbered MCQ blocks: "1. Question text ... A. ... B. ... C. ... D. ..."
  let currentQ = null;
  for (const line of lines) {
    const qMatch = line.match(/^(?:Câu\s*\d+|Question\s*\d+|\d+)[\.\:\)\-]\s*(.+)/i);
    const optMatch = line.match(/^([A-D])[\.\)\:\-]\s*(.+)/i);
    const ansMatch = line.match(/^(?:Đáp án|Answer|Key)[\s\:\-]*([A-D])/i);

    if (qMatch && !optMatch) {
      if (currentQ && currentQ.sentence) {
        extracted.push(currentQ);
      }
      currentQ = {
        sentence: qMatch[1].replace(/_{2,}|\.{3,}|\(\s*\)/g, '____'),
        options: [],
        correct: 0,
        vietnamese: '',
        explanation: ''
      };
    } else if (optMatch && currentQ) {
      // Check if line has multiple options on the same line: "A. foo   B. bar   C. baz   D. qux"
      const multiParts = line.split(/\s+(?=[A-D][\.\)\:\-]\s)/);
      if (multiParts.length > 1) {
        multiParts.forEach(part => {
          const m = part.trim().match(/^([A-D])[\.\)\:\-]\s*(.+)/i);
          if (m) {
            const cleanOpt = m[2].replace(/\*/g, '').trim();
            if (m[2].includes('*')) currentQ.correct = currentQ.options.length;
            currentQ.options.push(cleanOpt);
          }
        });
      } else {
        const rawOpt = optMatch[2].trim();
        const isStarred = rawOpt.includes('*');
        const cleanOpt = rawOpt.replace(/\*/g, '').trim();
        if (isStarred) currentQ.correct = currentQ.options.length;
        currentQ.options.push(cleanOpt);
      }
    } else if (ansMatch && currentQ) {
      const letter = ansMatch[1].toUpperCase();
      currentQ.correct = Math.max(0, ['A', 'B', 'C', 'D'].indexOf(letter));
    } else if (line.includes(' - ') || line.includes(': ')) {
      // Vocabulary line format: "word: meaning" or "word - meaning"
      const sep = line.includes(' - ') ? ' - ' : ': ';
      const parts = line.split(sep);
      if (parts.length >= 2 && parts[0].length <= 30) {
        const w = parts[0].replace(/^\d+[\.\)]\s*/, '').trim();
        const vn = parts.slice(1).join(sep).trim();
        if (w && vn) {
          extracted.push({
            target_word: w,
            vietnamese: vn,
            sentence: `In professional and academic contexts, "${w}" (____) plays an important role.`,
            options: [w, 'sustainable', 'comprehensive', 'mandatory'],
            correct: 0,
            explanation: `"${w}" mang nghĩa là: ${vn}.`
          });
        }
      }
    }
  }
  if (currentQ && currentQ.sentence) {
    extracted.push(currentQ);
  }

  if (extracted.length === 0) {
    // Fallback sample questions from text keywords
    const words = String(text || '')
      .match(/[a-zA-Z]{5,12}/g) || ['sustainable', 'comprehensive', 'mandatory', 'discrepancy', 'reimburse'];
    const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))].slice(0, questionCount);
    uniqueWords.forEach((w, idx) => {
      extracted.push({
        target_word: w,
        vietnamese: `Từ vựng trích xuất từ đề: "${w}"`,
        sentence: `Please complete the exam context using the appropriate term: ____.`,
        options: [w, 'alternative', 'provisional', 'substantial'],
        correct: 0,
        mode: idx % 2 === 0 ? 'sentence_cloze' : 'letter_fill',
        explanation: `Từ mục tiêu "${w}" được trích xuất trực tiếp từ tài liệu đề thi của bạn.`
      });
    });
  }

  return extracted.slice(0, questionCount).map((q, idx) => {
    const chosenAnswer = (q.options && q.options[q.correct]) || q.target_word || 'academic';
    return normalizeImportedQuestion({
      ...q,
      target_word: q.target_word || chosenAnswer
    }, idx, questionTypeMode);
  });
}

async function handleExamImportRequest(req, res) {
  let bodyChunks = [];
  let totalBytes = 0;
  const MAX_BYTES = 25 * 1024 * 1024; // 25MB max upload

  req.on('data', chunk => {
    totalBytes += chunk.length;
    if (totalBytes > MAX_BYTES) {
      res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'File tải lên vượt quá dung lượng tối đa 25MB.' }));
      req.destroy();
      return;
    }
    bodyChunks.push(chunk);
  });

  req.on('end', async () => {
    try {
      const rawBody = Buffer.concat(bodyChunks).toString('utf-8');
      const payload = JSON.parse(rawBody || '{}');
      const fileName = String(payload.fileName || '').trim();
      const mimeType = String(payload.mimeType || '').trim().toLowerCase();
      const base64Data = String(payload.base64Data || '').trim();
      let rawText = String(payload.rawText || '').trim();
      const questionCount = Math.min(25, Math.max(5, Number(payload.questionCount) || 10));
      const questionTypeMode = String(payload.questionTypeMode || 'mixed').trim();

      // 1. If a Word (.docx / .doc) or .txt file was uploaded as base64, extract text first
      const isDocx = mimeType.includes('word') || mimeType.includes('officedocument') || /\.docx?$/i.test(fileName);
      const isTxt = mimeType.startsWith('text/') || /\.txt$/i.test(fileName);

      if (base64Data && (isDocx || isTxt)) {
        const fileBuffer = Buffer.from(base64Data, 'base64');
        if (isTxt) {
          rawText = fileBuffer.toString('utf-8') + '\n' + rawText;
        } else if (isDocx && mammoth) {
          try {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            if (result && result.value) {
              rawText = result.value.trim() + '\n' + rawText;
            }
          } catch (docErr) {
            // Fallback: extract printable ASCII/UTF-8 strings from buffer
            rawText = fileBuffer.toString('utf-8').replace(/<[^>]+>/g, ' ') + '\n' + rawText;
          }
        }
      }

      const isImageOrPdf = base64Data && (
        mimeType.startsWith('image/') ||
        mimeType === 'application/pdf' ||
        /\.(png|jpe?g|webp|gif|pdf)$/i.test(fileName)
      );

      if (!isImageOrPdf && !rawText.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          error: 'Vui lòng chọn file đề thi (Ảnh, PDF, Word) hoặc dán nội dung đề thi vào ô văn bản.'
        }));
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (GoogleGenAI && apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
          });

          const modeInstruction = questionTypeMode === 'mcq_only'
            ? 'TẤT CẢ câu hỏi phải ở dạng trắc nghiệm 4 đáp án A, B, C, D ("sentence_cloze", "word_class", "collocation", "preposition", hoặc "meaning_match"). KHÔNG tạo mode "letter_fill".'
            : questionTypeMode === 'fill_only'
            ? 'Tập trung tạo câu hỏi điền từ vào chỗ trống trong câu ("sentence_cloze" có dấu ____ trong câu) VÀ điền chữ cái khuyết hoàn thành từ vựng ("letter_fill").'
            : 'Kết hợp đa dạng cả câu hỏi Trắc nghiệm điền vào chỗ trống ("sentence_cloze", "word_class", "collocation", "preposition") VÀ câu hỏi Điền chữ cái hoàn thành từ ("letter_fill", chiếm khoảng 30% số câu).';

          const systemInstruction = `Bạn là chuyên gia khảo thí IELTS & TOEIC của hệ thống "Danh học IELTS & TOEIC Arena".
Nhiệm vụ của bạn là đọc kỹ đề thi tiếng Anh (từ ảnh chụp đề thi, file PDF, file Word hoặc văn bản) và chuyển đổi/trích xuất thành đúng ${questionCount} câu hỏi tương tác chất lượng cao.
Quy tắc bắt buộc:
1. Nếu tài liệu đã có sẵn các câu hỏi trắc nghiệm hoặc điền từ: hãy trích xuất chính xác nội dung câu hỏi (thay chỗ trống bằng "____"), giữ nguyên 4 phương án lựa chọn, xác định đúng đáp án (chỉ số correct từ 0 đến 3), dịch nghĩa tiếng Việt của từ khóa chính (vietnamese), và viết giải thích ngắn gọn dễ hiểu bằng tiếng Việt (explanation).
2. Nếu tài liệu là bài đọc (Reading passage), bảng từ vựng, hoặc ghi chú: hãy tự động thiết kế ${questionCount} câu hỏi trắc nghiệm điền từ ("sentence_cloze") và điền chữ cái ("letter_fill") bám sát các từ vựng/cấu trúc quan trọng nhất trong tài liệu đó.
3. ${modeInstruction}
4. Với mỗi câu hỏi:
   - "target_word": từ vựng tiếng Anh cốt lõi là đáp án đúng (1 từ đơn nếu mode là "letter_fill").
   - "phonetic": phiên âm quốc tế IPA của target_word (ví dụ "/səˈsteɪ.nə.bəl/").
   - "vietnamese": nghĩa tiếng Việt ngắn gọn, chuẩn xác của target_word.
   - "sentence": câu tiếng Anh có chứa "____" tại vị trí từ cần điền.
   - "options": mảng gồm đúng 4 chuỗi phương án tiếng Anh khác nhau, trong đó options[correct] là đáp án đúng.
   - "correct": số nguyên 0, 1, 2, hoặc 3 tương ứng vị trí đáp án đúng trong mảng options.
   - "explanation": giải thích ngắn gọn bằng tiếng Việt vì sao chọn đáp án đó (ngữ pháp, collocation, hoặc nghĩa ngữ cảnh).`;

          const contentsParts = [];
          if (isImageOrPdf) {
            const effectiveMime = mimeType || (fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png');
            contentsParts.push({
              inlineData: {
                mimeType: effectiveMime,
                data: base64Data
              }
            });
          }
          if (rawText.trim()) {
            contentsParts.push({
              text: `Nội dung đề thi / tài liệu:\n${rawText.slice(0, 30000)}`
            });
          }
          contentsParts.push({
            text: `Hãy trích xuất và tạo ${questionCount} câu hỏi theo đúng cấu trúc JSON Schema yêu cầu.`
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contentsParts,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: SchemaType.ARRAY,
                description: 'Danh sách câu hỏi trắc nghiệm và điền từ trích xuất từ đề thi',
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    target_word: { type: SchemaType.STRING, description: 'Từ vựng hoặc đáp án đúng tiếng Anh' },
                    phonetic: { type: SchemaType.STRING, description: 'Phiên âm IPA của từ' },
                    vietnamese: { type: SchemaType.STRING, description: 'Nghĩa tiếng Việt ngắn gọn' },
                    mode: {
                      type: SchemaType.STRING,
                      description: 'Loại câu hỏi: sentence_cloze, letter_fill, word_class, collocation, preposition, hoặc meaning_match'
                    },
                    band: { type: SchemaType.STRING, description: 'Band điểm ước lượng (ví dụ: 6.5, TOEIC 600)' },
                    topic: { type: SchemaType.STRING, description: 'Chủ đề ngắn gọn của câu hỏi' },
                    sentence: { type: SchemaType.STRING, description: 'Câu tiếng Anh có dấu ____ ở chỗ trống cần điền' },
                    prompt: { type: SchemaType.STRING, description: 'Yêu cầu câu hỏi tiếng Việt' },
                    options: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                      description: 'Đúng 4 phương án lựa chọn (không kèm tiền tố A. B. C. D.)'
                    },
                    correct: { type: SchemaType.INTEGER, description: 'Chỉ số đáp án đúng từ 0 đến 3' },
                    explanation: { type: SchemaType.STRING, description: 'Giải thích chi tiết bằng tiếng Việt' },
                    common_mistake: { type: SchemaType.STRING, description: 'Lưu ý bẫy phòng thi hoặc từ dễ nhầm (nếu có)' }
                  },
                  required: ['target_word', 'vietnamese', 'mode', 'sentence', 'options', 'correct', 'explanation']
                }
              }
            }
          });

          const parsedJson = JSON.parse(response.text || '[]');
          if (Array.isArray(parsedJson) && parsedJson.length > 0) {
            const questions = parsedJson
              .slice(0, questionCount)
              .map((item, idx) => normalizeImportedQuestion(item, idx, questionTypeMode));

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
              success: true,
              source: 'gemini-ai',
              count: questions.length,
              questions
            }));
            return;
          }
        } catch (aiErr) {
          console.error('Gemini API exam import error, falling back to local parser:', aiErr.message);
          if (!rawText.trim()) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
              error: 'Không thể phân tích file ảnh/PDF lúc này: ' + (aiErr.message || 'Lỗi kết nối AI')
            }));
            return;
          }
        }
      }

      // Local deterministic parser fallback for raw text / Word text
      const fallbackQuestions = parseExamTextLocally(rawText, questionCount, questionTypeMode);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        source: 'local-parser',
        count: fallbackQuestions.length,
        questions: fallbackQuestions
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        error: 'Lỗi xử lý đề thi: ' + (err.message || 'Không xác định')
      }));
    }
  });
}

const server = http.createServer((req, res) => {
  // CORS & PWA headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);

  if (req.method === 'POST' && reqPath === '/api/exam-import') {
    handleExamImportRequest(req, res);
    return;
  }

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  const ips = getLocalIPAddresses();
  console.log('======================================================================');
  console.log('🚀 DANH HỌC IELTS & TOEIC - LOCALHOST SERVER ĐÃ KHỞI CHẠY!');
  console.log('======================================================================');
  console.log(`\n💻 Máy tính (Localhost):`);
  console.log(`   👉 http://localhost:${PORT}`);
  console.log(`   👉 http://127.0.0.1:${PORT}`);
  
  console.log(`\n📱 Điện thoại iPhone 17 Pro Max (Cùng mạng Wi-Fi):`);
  ips.forEach(ip => {
    console.log(`   👉 http://${ip}:${PORT}`);
  });

  console.log('\n📲 Hướng dẫn cài đặt App lên iPhone:');
  console.log('   1. Mở trình duyệt Safari trên iPhone.');
  console.log(`   2. Nhập địa chỉ: http://${ips[0] || '192.168.100.163'}:${PORT}`);
  console.log('   3. Bấm icon Chia sẻ (hình vuông có mũi tên lên ⎋ ở cạnh dưới).');
  console.log('   4. Chọn "Thêm vào MH chính" (Add to Home Screen).');
  console.log('   5. App sẽ xuất hiện trên màn hình chính và chạy toàn màn hình mượt mà!\n');
  console.log('======================================================================');
});
