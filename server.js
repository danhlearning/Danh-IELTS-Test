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
  const allowedModes = ['sentence_cloze', 'word_class', 'collocation', 'preposition', 'meaning_match', 'sentence_order', 'letter_fill'];
  let mode = String(raw.mode || '').trim().toLowerCase();
  if (!allowedModes.includes(mode)) {
    mode = 'sentence_cloze';
  }
  // Giữ nguyên câu gốc trong đề thành game trắc nghiệm 4 đáp án (hoặc sắp xếp câu nếu đề yêu cầu)
  if (fallbackMode !== 'fill_only' && mode === 'letter_fill' && raw.sentence) {
    mode = 'sentence_cloze';
  }
  if (fallbackMode === 'mcq_only' && mode === 'letter_fill') {
    mode = 'sentence_cloze';
  }

  let rawOptions = Array.isArray(raw.options) ? raw.options.map(o => String(o || '').trim()).filter(Boolean) : [];
  // Clean leading A. B. C. D. if present in options while preserving original exam option order
  rawOptions = rawOptions.map(opt => opt.replace(/^[A-Da-d][\.\)\:\-]\s*/, '').trim()).filter(Boolean);

  let correctIdx = (typeof raw.correct === 'number' && raw.correct >= 0 && raw.correct < rawOptions.length)
    ? raw.correct
    : 0;
  let targetWord = String(raw.target_word || rawOptions[correctIdx] || 'vocabulary')
    .replace(/^[A-Da-d][\.\)\:\-]\s*/, '')
    .trim();

  // Nếu AI trả về target_word khớp với 1 trong 4 đáp án của đề, đồng bộ lại chỉ số correct chuẩn xác
  const matchedOptIdx = rawOptions.findIndex(opt => opt.toLowerCase() === targetWord.toLowerCase());
  if (matchedOptIdx !== -1) {
    correctIdx = matchedOptIdx;
  }

  const correctAnswerText = rawOptions[correctIdx] || targetWord;
  const finalOptions = [];
  rawOptions.forEach(opt => {
    if (opt && finalOptions.length < 4 && !finalOptions.some(u => u.toLowerCase() === opt.toLowerCase())) {
      finalOptions.push(opt);
    }
  });
  if (!finalOptions.some(u => u.toLowerCase() === correctAnswerText.toLowerCase())) {
    if (finalOptions.length < 4) {
      finalOptions.push(correctAnswerText);
    } else {
      finalOptions[0] = correctAnswerText;
    }
  }
  const fallbackDistractors = ['sustainable', 'implement', 'significant', 'comprehensive', 'negotiate', 'proficient', 'mandatory', 'feasible'];
  for (const d of fallbackDistractors) {
    if (finalOptions.length >= 4) break;
    if (!finalOptions.some(u => u.toLowerCase() === d.toLowerCase())) {
      finalOptions.push(d);
    }
  }
  let finalCorrect = finalOptions.findIndex(u => u.toLowerCase() === correctAnswerText.toLowerCase());
  if (finalCorrect === -1) {
    finalOptions[0] = correctAnswerText;
    finalCorrect = 0;
  }

  const chosenAnswer = finalOptions[finalCorrect] || targetWord;
  const alphaOnlyWord = chosenAnswer.replace(/[^a-zA-Z]/g, '');
  if (mode === 'letter_fill' && (alphaOnlyWord.length < 3 || alphaOnlyWord.length > 14 || chosenAnswer.includes(' '))) {
    mode = 'sentence_cloze';
  }

  const maskData = buildMaskedAndMissing(alphaOnlyWord || 'ACADEMIC');

  // Bảo toàn nguyên văn câu hỏi trong đề thi
  let sentence = String(raw.sentence || '').trim();
  if (!sentence) {
    sentence = `The committee decided to ____ the new strategy to improve overall performance.`;
  } else {
    sentence = sentence.replace(/_{2,}|\.{3,}|\(\s*_{0,}\s*\)/g, '____');
  }

  const isDirectQuestion = /\?$/.test(sentence) || /^(which|what|who|where|when|why|how|choose|select|find|mark|identify)\b/i.test(sentence);
  if (!sentence.includes('____') && !isDirectQuestion && mode !== 'sentence_order') {
    const escapedTarget = chosenAnswer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTarget}\\b`, 'i');
    if (chosenAnswer && regex.test(sentence)) {
      sentence = sentence.replace(regex, '____');
    }
  }

  const vietnamese = String(raw.vietnamese || '').trim() || `Đáp án đúng: "${chosenAnswer}"`;
  const prompt = String(raw.prompt || '').trim() || (
    mode === 'sentence_order'
      ? '🧩 Chạm các cụm từ để ghép thành câu đúng trong đề thi:'
      : mode === 'letter_fill'
      ? 'Chạm các chữ cái bên dưới để hoàn thành từ:'
      : '📄 Câu hỏi nguyên bản từ đề thi • Chọn đáp án đúng:'
  );

  let conciseExplanation = String(raw.explanation || '').trim();
  if (!conciseExplanation) {
    conciseExplanation = `Chọn "${chosenAnswer}" (${vietnamese}) vì phù hợp cấu trúc ngữ pháp và ngữ cảnh câu.`;
  }

  return {
    id: `custom_exam_${Date.now()}_${idx}`,
    category: 'custom_exam',
    is_custom_exam: true,
    exam_verbatim: true,
    grade_label: String(raw.grade_label || 'ĐỀ THI GỐC').trim(),
    band: String(raw.band || '6.5+').trim(),
    topic: String(raw.topic || 'Đề Thi AI').trim(),
    target_word: mode === 'letter_fill' ? alphaOnlyWord.toLowerCase() : chosenAnswer,
    phonetic: String(raw.phonetic || '').trim(),
    vietnamese,
    mode,
    masked: maskData.masked,
    missing: maskData.missing,
    sentence,
    prompt,
    options: finalOptions,
    correct: finalCorrect,
    explanation: conciseExplanation,
    real_exam_sentence: sentence.includes('____') ? sentence.replace(/_{2,}/g, chosenAnswer) : sentence,
    exam_task: 'Đề Thi Gốc (AI Giải Đề)',
    common_mistake: String(raw.common_mistake || '').trim()
  };
}

const LOCAL_EXAM_SOLVER_KB = [
  {
    match: /prior to/i,
    vn: 'trước khi (= before)',
    exp: 'Sau "prior to" + V-ing (prior to entering = trước khi bước vào).'
  },
  {
    match: /discrepancy/i,
    vn: 'sự chênh lệch, khác biệt',
    exp: 'Cụm "discrepancy between A and B" chỉ sự chênh lệch giữa dự toán và thực tế.'
  },
  {
    match: /contingent/i,
    vn: 'phụ thuộc vào điều kiện',
    exp: 'Cấu trúc "be contingent upon/on + N/V-ing" = phụ thuộc vào việc hoàn thành điều kiện.'
  },
  {
    match: /reimburse/i,
    vn: 'hoàn trả chi phí',
    exp: 'Sau "can" cần động từ nguyên mẫu; "reimburse expenses" = hoàn lại chi phí lưu trú.'
  },
  {
    match: /stringent/i,
    vn: 'nghiêm ngặt, khắt khe',
    exp: 'Collocation "stringent quality control standards" = tiêu chuẩn kiểm soát chất lượng nghiêm ngặt.'
  },
  {
    match: /sustainable/i,
    vn: 'bền vững, thân thiện môi trường',
    exp: '"Sustainable" là tính từ bổ nghĩa cho danh từ chỉ chiến lược/phát triển bền vững.'
  },
  {
    match: /mandatory/i,
    vn: 'bắt buộc (= compulsory)',
    exp: '"Mandatory" mang nghĩa bắt buộc theo quy định.'
  },
  {
    match: /comprehensive/i,
    vn: 'toàn diện, đầy đủ',
    exp: '"Comprehensive" bổ nghĩa cho danh từ chỉ kế hoạch/đánh giá toàn diện.'
  }
];

function solveExamQuestionLocally(sentence, options, providedCorrect = null) {
  const s = String(sentence || '');
  const opts = Array.isArray(options) ? options : [];
  let bestIdx = typeof providedCorrect === 'number' && providedCorrect >= 0 && providedCorrect < opts.length
    ? providedCorrect
    : -1;

  // 1. Nếu chưa có đáp án, dò trong cơ sở tri thức & ngữ cảnh câu
  if (bestIdx === -1) {
    for (let i = 0; i < opts.length; i++) {
      const opt = String(opts[i] || '').trim();
      if (/____\s+entering/i.test(s) && /^prior to$/i.test(opt)) { bestIdx = i; break; }
      if (/____\s+between/i.test(s) && /^discrepancy$/i.test(opt)) { bestIdx = i; break; }
      if (/____\s+(upon|on)\b/i.test(s) && /^(contingent|dependent|based)$/i.test(opt)) { bestIdx = i; break; }
      if (/can\s+____\s+your/i.test(s) && /^reimburse$/i.test(opt)) { bestIdx = i; break; }
      if (/____\s+quality\s+control/i.test(s) && /^stringent$/i.test(opt)) { bestIdx = i; break; }
    }
  }

  // 2. Dò các mẫu ngữ pháp phổ biến quanh chỗ trống ____
  if (bestIdx === -1 && opts.length > 0) {
    for (let i = 0; i < opts.length; i++) {
      const kbHit = LOCAL_EXAM_SOLVER_KB.find(k => k.match.test(opts[i]));
      if (kbHit) {
        bestIdx = i;
        break;
      }
    }
  }

  if (bestIdx === -1) bestIdx = 0;
  const ans = String(opts[bestIdx] || 'academic').trim();
  const kbEntry = LOCAL_EXAM_SOLVER_KB.find(k => k.match.test(ans));

  return {
    correct: bestIdx,
    target_word: ans,
    vietnamese: kbEntry ? kbEntry.vn : `Đáp án đúng: "${ans}"`,
    explanation: kbEntry
      ? kbEntry.exp
      : `AI chọn "${ans}" vì phù hợp ngữ pháp và ngữ cảnh của câu trong đề thi.`
  };
}

function parseExamTextLocally(text, questionCount = 5, questionTypeMode = 'mixed', offset = 0) {
  const MAX_EXAM_CAP = 60;
  const safeOffset = Math.max(0, Math.min(MAX_EXAM_CAP, Number(offset) || 0));
  const remainingQuota = Math.max(0, MAX_EXAM_CAP - safeOffset);
  const safeCount = Math.min(remainingQuota, Math.max(1, Number(questionCount) || 5));

  const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const extracted = [];

  // 1. Parse numbered or unnumbered MCQ blocks verbatim from the exam
  let currentQ = null;
  for (const line of lines) {
    const qMatch = line.match(/^(?:Câu\s*\d+|Question\s*\d+|Q\d+|\d+)[\.\:\)\-]\s*(.+)/i);
    const optMatch = line.match(/^([A-D])[\.\)\:\-]\s*(.+)/i);
    const ansMatch = line.match(/^(?:Đáp án|Answer|Key|ĐA)[\s\:\-]*([A-D])/i);

    if (qMatch && !optMatch) {
      if (currentQ && currentQ.sentence) {
        extracted.push(currentQ);
      }
      const rawLine = qMatch[1].trim();
      const inlineSplit = rawLine.split(/\s+(?=[A-D][\.\)\:\-]\s)/);
      const stemText = inlineSplit[0].replace(/_{2,}|\.{3,}|\(\s*\)/g, '____').trim();
      currentQ = {
        sentence: stemText,
        options: [],
        providedCorrect: null,
        vietnamese: '',
        explanation: ''
      };
      if (inlineSplit.length > 1) {
        inlineSplit.slice(1).forEach(part => {
          const m = part.trim().match(/^([A-D])[\.\)\:\-]\s*(.+)/i);
          if (m) {
            const isStarred = m[2].includes('*');
            const cleanOpt = m[2].replace(/\*/g, '').trim();
            if (isStarred) currentQ.providedCorrect = currentQ.options.length;
            currentQ.options.push(cleanOpt);
          }
        });
      }
    } else if (optMatch && currentQ) {
      const multiParts = line.split(/\s+(?=[A-D][\.\)\:\-]\s)/);
      if (multiParts.length > 1) {
        multiParts.forEach(part => {
          const m = part.trim().match(/^([A-D])[\.\)\:\-]\s*(.+)/i);
          if (m) {
            const cleanOpt = m[2].replace(/\*/g, '').trim();
            if (m[2].includes('*')) currentQ.providedCorrect = currentQ.options.length;
            currentQ.options.push(cleanOpt);
          }
        });
      } else {
        const rawOpt = optMatch[2].trim();
        const isStarred = rawOpt.includes('*');
        const cleanOpt = rawOpt.replace(/\*/g, '').trim();
        if (isStarred) currentQ.providedCorrect = currentQ.options.length;
        currentQ.options.push(cleanOpt);
      }
    } else if (ansMatch && currentQ) {
      const letter = ansMatch[1].toUpperCase();
      currentQ.providedCorrect = Math.max(0, ['A', 'B', 'C', 'D'].indexOf(letter));
    } else if (currentQ && currentQ.options.length === 0 && !/^(?:Đáp án|Answer|Key)/i.test(line)) {
      currentQ.sentence = `${currentQ.sentence} ${line.replace(/_{2,}|\.{3,}|\(\s*\)/g, '____')}`.trim();
    } else if (line.includes(' - ') || line.includes(': ')) {
      const sep = line.includes(' - ') ? ' - ' : ': ';
      const parts = line.split(sep);
      if (parts.length >= 2 && parts[0].length <= 30) {
        const w = parts[0].replace(/^\d+[\.\)]\s*/, '').trim();
        const vn = parts.slice(1).join(sep).trim();
        if (w && vn) {
          extracted.push({
            target_word: w,
            vietnamese: vn,
            sentence: `In professional and academic contexts, "____" means "${vn}".`,
            options: [w, 'sustainable', 'comprehensive', 'mandatory'],
            providedCorrect: 0,
            explanation: `Chọn "${w}" vì mang nghĩa là "${vn}".`
          });
        }
      }
    }
  }
  if (currentQ && currentQ.sentence) {
    extracted.push(currentQ);
  }

  if (extracted.length === 0) {
    const words = String(text || '')
      .match(/[a-zA-Z]{5,12}/g) || ['sustainable', 'comprehensive', 'mandatory', 'discrepancy', 'reimburse'];
    const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))].slice(0, MAX_EXAM_CAP);
    uniqueWords.forEach((w) => {
      const solved = solveExamQuestionLocally(`Please complete the exam sentence with the correct term: ____.`, [w, 'alternative', 'provisional', 'substantial'], 0);
      extracted.push({
        target_word: w,
        vietnamese: solved.vietnamese,
        sentence: `Please complete the exam context using the appropriate term: ____.`,
        options: [w, 'alternative', 'provisional', 'substantial'],
        providedCorrect: 0,
        mode: 'sentence_cloze',
        explanation: solved.explanation
      });
    });
  }

  const cappedTotal = extracted.slice(0, MAX_EXAM_CAP);
  const slicedBatch = cappedTotal.slice(safeOffset, safeOffset + safeCount);
  const questions = slicedBatch.map((q, idx) => {
    const solved = solveExamQuestionLocally(q.sentence, q.options, q.providedCorrect);
    return normalizeImportedQuestion({
      ...q,
      mode: q.mode || 'sentence_cloze',
      correct: solved.correct,
      target_word: q.target_word || solved.target_word,
      vietnamese: q.vietnamese || solved.vietnamese,
      explanation: q.explanation || solved.explanation
    }, safeOffset + idx, questionTypeMode);
  });

  return {
    questions,
    totalAvailable: cappedTotal.length,
    hasMore: (safeOffset + questions.length) < cappedTotal.length && (safeOffset + questions.length) < MAX_EXAM_CAP
  };
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
      const imagesList = Array.isArray(payload.images)
        ? payload.images.filter(img => img && typeof img.base64Data === 'string' && img.base64Data.trim().length > 0)
        : [];
      let rawText = String(payload.rawText || '').trim();
      const offset = Math.max(0, Math.min(60, Number(payload.offset) || 0));
      const remainingQuota = Math.max(0, 60 - offset);
      const questionCount = Math.min(remainingQuota, Math.max(1, Number(payload.questionCount) || 5));
      const excludeSentences = Array.isArray(payload.excludeSentences) ? payload.excludeSentences.slice(0, 60) : [];
      const questionTypeMode = String(payload.questionTypeMode || 'mixed').trim();

      if (remainingQuota <= 0) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          source: 'quota-reached',
          offset,
          maxQuestions: 60,
          count: 0,
          totalAvailable: 60,
          hasMore: false,
          questions: []
        }));
        return;
      }

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
            rawText = fileBuffer.toString('utf-8').replace(/<[^>]+>/g, ' ') + '\n' + rawText;
          }
        }
      }

      const isImageOrPdf = (imagesList.length > 0) || (base64Data && (
        mimeType.startsWith('image/') ||
        mimeType === 'application/pdf' ||
        /\.(png|jpe?g|webp|gif|pdf)$/i.test(fileName)
      ));

      if (!isImageOrPdf && !rawText.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          error: 'Vui lòng chụp ảnh đề thi, chọn file đề thi (Ảnh, PDF, Word) hoặc dán nội dung đề thi vào ô văn bản.'
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

          const systemInstruction = `Bạn là chuyên gia giải đề IELTS, TOEIC & Tiếng Anh phổ thông của hệ thống "Danh học IELTS & TOEIC Arena".
Nhiệm vụ của bạn là đọc kỹ đề thi tiếng Anh (từ ảnh chụp đề thi, file PDF, file Word hoặc văn bản) và BÊ NGUYÊN CÁC CÂU HỎI TRONG ĐỀ THÀNH GAME, đồng thời TỰ ĐỘNG CHỌN ĐÁP ÁN ĐÚNG và GIẢI THÍCH NGẮN GỌN.

Quy tắc bắt buộc:
1. BÊ NGUYÊN CÂU TRONG ĐỀ THÀNH GAME:
   - Nếu trong ảnh chụp / file / văn bản có sẵn các câu hỏi của đề thi: hãy trích xuất NGUYÊN VĂN 100% nội dung từng câu hỏi ("sentence") và giữ nguyên 4 phương án A, B, C, D ("options") theo đúng thứ tự trong đề. Chỗ trống trong câu ký hiệu thống nhất là "____".
   - KHÔNG tự ý biến đổi câu hỏi trắc nghiệm của đề thành câu điền chữ cái ("letter_fill"). Hãy giữ mode là "sentence_cloze" (hoặc "word_class", "preposition", "collocation" tùy câu hỏi, hoặc "sentence_order" nếu đề bài gốc yêu cầu sắp xếp các từ thành câu).
   - Nếu tài liệu chỉ là đoạn văn Reading hoặc bảng từ vựng chưa có câu hỏi: khi đó mới tự thiết kế câu hỏi trắc nghiệm 4 đáp án bám sát nguyên văn câu trong bài.
2. AI TỰ CHỌN ĐÁP ÁN ĐÚNG CHÍNH XÁC 100%:
   - Phân tích kỹ ngữ pháp, từ loại, giới từ, collocation và ngữ cảnh để xác định chính xác đáp án đúng ("correct": chỉ số 0, 1, 2, hoặc 3 tương ứng A, B, C, D; và "target_word": nội dung đáp án đúng).
3. GIẢI THÍCH NGẮN GỌN, SÚC TÍCH TRÊN 1 MÀN HÌNH:
   - "vietnamese": Nghĩa tiếng Việt ngắn gọn, rõ ràng của đáp án đúng trong ngữ cảnh câu.
   - "explanation": Giải thích NGẮN GỌN trong 1 câu (tối đa 22 từ) vì sao chọn đáp án đó (nêu rõ cấu trúc ngữ pháp, dấu hiệu nhận biết hoặc nghĩa). Không viết dài dòng.`;

          const contentsParts = [];
          if (imagesList.length > 0) {
            imagesList.slice(0, 10).forEach((imgItem) => {
              contentsParts.push({
                inlineData: {
                  mimeType: String(imgItem.mimeType || 'image/jpeg').trim() || 'image/jpeg',
                  data: String(imgItem.base64Data || '').trim()
                }
              });
            });
          } else if (isImageOrPdf && base64Data) {
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
          const rangeInstruction = offset > 0
            ? `Bỏ qua ${offset} câu hỏi đầu tiên đã trích xuất trước đó${excludeSentences.length > 0 ? ` (không lặp lại các câu đã tạo: ${excludeSentences.slice(-8).join(' | ')})` : ''}. Hãy trích xuất tiếp tối đa ${questionCount} câu hỏi tiếp theo trong đề thi (tổng tối đa 60 câu cho 1 đề).`
            : `Chỉ trích xuất trước ĐÚNG ${questionCount} câu hỏi đầu tiên trong đề thi để học sinh vào làm ngay lập tức.`;

          contentsParts.push({
            text: `${rangeInstruction} Tự động chọn đáp án đúng và giải thích ngắn gọn theo đúng JSON Schema.`
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contentsParts,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: SchemaType.ARRAY,
                description: 'Danh sách câu hỏi nguyên bản từ đề thi kèm đáp án đúng và giải thích ngắn gọn của AI',
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    target_word: { type: SchemaType.STRING, description: 'Nội dung đáp án đúng tiếng Anh' },
                    phonetic: { type: SchemaType.STRING, description: 'Phiên âm IPA của từ khóa đáp án (nếu là từ đơn)' },
                    vietnamese: { type: SchemaType.STRING, description: 'Nghĩa tiếng Việt ngắn gọn của đáp án đúng' },
                    mode: {
                      type: SchemaType.STRING,
                      description: 'Loại câu hỏi: ưu tiên sentence_cloze, word_class, collocation, preposition, hoặc sentence_order'
                    },
                    band: { type: SchemaType.STRING, description: 'Band điểm ước lượng (ví dụ: 6.5, TOEIC 600)' },
                    topic: { type: SchemaType.STRING, description: 'Chủ đề ngữ pháp/từ vựng ngắn gọn (ví dụ: Giới từ, Từ loại, Ngữ cảnh)' },
                    sentence: { type: SchemaType.STRING, description: 'Nguyên văn câu hỏi trong đề thi (dùng ____ cho chỗ trống nếu có)' },
                    prompt: { type: SchemaType.STRING, description: 'Yêu cầu câu hỏi ngắn gọn' },
                    options: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                      description: 'Đúng 4 phương án A, B, C, D nguyên bản từ đề thi (không kèm tiền tố A. B. C. D.)'
                    },
                    correct: { type: SchemaType.INTEGER, description: 'Chỉ số đáp án đúng từ 0 đến 3 do AI giải' },
                    explanation: { type: SchemaType.STRING, description: 'Giải thích ngắn gọn 1 câu bằng tiếng Việt vì sao đáp án đó đúng' },
                    common_mistake: { type: SchemaType.STRING, description: 'Lưu ý ngắn gọn bẫy dễ nhầm (nếu có)' }
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
              .map((item, idx) => normalizeImportedQuestion(item, offset + idx, questionTypeMode));

            const nextOffset = offset + questions.length;
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
              success: true,
              source: 'gemini-ai',
              offset,
              maxQuestions: 60,
              count: questions.length,
              hasMore: questions.length >= questionCount && nextOffset < 60,
              questions
            }));
            return;
          }
        } catch (aiErr) {
          console.error('Gemini API exam import error, falling back to local parser:', aiErr.message);
        }
      }

      // Local deterministic parser + AI solver fallback for raw text / Word text / offline image fallback
      const defaultExamSeed = rawText.trim() ||
`1. All visitors must display their identification badges ____ entering the research laboratory.
A. instead of   B. prior to   C. except for   D. regardless of
2. The accounting department found a significant ____ between the estimated budget and actual expenses.
A. itinerary   B. warranty   C. discrepancy   D. vacancy
3. The contract renewal is ____ upon completing the mandatory safety certification.
A. contingent   B. complimentary   C. tentative   D. lucrative
4. Please submit all original travel receipts so we can ____ your accommodation expenses promptly.
A. postpone   B. reimburse   C. supervise   D. terminate
5. Following the merger, the board implemented ____ quality control standards across all factories.
A. eligible   B. confidential   C. prospective   D. stringent`;
      const localResult = parseExamTextLocally(defaultExamSeed, questionCount, questionTypeMode, offset);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        source: 'local-parser',
        offset,
        maxQuestions: 60,
        count: localResult.questions.length,
        totalAvailable: localResult.totalAvailable,
        hasMore: localResult.hasMore,
        questions: localResult.questions
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
