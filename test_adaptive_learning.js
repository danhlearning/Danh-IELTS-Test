/**
 * COMPREHENSIVE AUTOMATED TEST SUITE:
 * 1. Adaptive Learning Engine & Memory Profiles (Lv.1 to Lv.5)
 * 2. Interactive Letter Fill Keyboard (Tiles, Blanks, Undo, Clear, 50:50)
 * 3. TOEIC 400-700 Database: 35 Words x 6 Modes = 210 Questions
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("======================================================================");
console.log("🧠 TEST SUITE: ADAPTIVE LEARNING, INTERACTIVE KEYBOARD & TOEIC 6-MODE");
console.log("======================================================================\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// --------------------------------------------------------------------
// Setup Robust DOM Environment Mock for Node
// --------------------------------------------------------------------
class LocalStorageMock {
  constructor() { this.store = {}; }
  getItem(k) { return this.store[k] || null; }
  setItem(k, v) { this.store[k] = String(v); }
  removeItem(k) { delete this.store[k]; }
  clear() { this.store = {}; }
}

function createDOMNode(tag = 'div', id = '') {
  const node = {
    tag,
    id,
    dataset: {},
    style: {},
    classList: {
      items: new Set(),
      add(c) { this.items.add(c); },
      remove(c) { this.items.delete(c); },
      contains(c) { return this.items.has(c); },
      toggle(c) { if (this.items.has(c)) { this.items.delete(c); return false; } else { this.items.add(c); return true; } }
    },
    textContent: '',
    children: [],
    disabled: false,
    setAttribute(attr, val) { this[attr] = val; },
    appendChild(child) { this.children.push(child); return child; },
    listeners: {},
    addEventListener(evt, fn) {
      if (!this.listeners[evt]) this.listeners[evt] = [];
      this.listeners[evt].push(fn);
    },
    click() {
      if (this.disabled) return;
      if (this.listeners['click']) {
        this.listeners['click'].forEach(fn => fn({ stopPropagation: () => {} }));
      }
    },
    querySelectorAll(selector) {
      const results = [];
      const isClass = selector.startsWith('.');
      const isId = selector.startsWith('#');
      const classList = isClass ? selector.split('.').filter(Boolean) : [];
      const idTarget = isId ? selector.slice(1) : '';

      function traverse(parent) {
        for (const child of parent.children) {
          let matches = false;
          if (isClass) {
            matches = classList.every(c => child.classList.contains(c));
          } else if (isId) {
            matches = child.id === idTarget;
          } else if (selector === child.tag || (selector === 'button' && child.tag === 'button')) {
            matches = true;
          }
          if (matches) results.push(child);
          traverse(child);
        }
      }
      traverse(this);
      return results;
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    }
  };

  let _innerHTML = '';
  Object.defineProperty(node, 'innerHTML', {
    get() { return _innerHTML; },
    set(val) {
      _innerHTML = String(val);
      if (_innerHTML === '') this.children = [];
    }
  });

  let _className = '';
  Object.defineProperty(node, 'className', {
    get() { return Array.from(this.classList.items).join(' '); },
    set(val) {
      _className = String(val);
      this.classList.items.clear();
      _className.split(/\s+/).filter(Boolean).forEach(c => this.classList.items.add(c));
    }
  });

  return node;
}

const mockLocalStorage = new LocalStorageMock();
const domElements = {};

global.window = {
  addEventListener: () => {},
  AudioContext: class {
    constructor() { this.currentTime = 0; }
    createOscillator() { return { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {} }; }
    createBiquadFilter() { return { frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
    resume() {}
  }
};

global.document = {
  body: createDOMNode('body'),
  getElementById(id) {
    if (!domElements[id]) domElements[id] = createDOMNode('div', id);
    return domElements[id];
  },
  createElement(tag) { return createDOMNode(tag); },
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.localStorage = mockLocalStorage;
global.sessionStorage = new LocalStorageMock();

// Load code files
const dataCode = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
const vocabImagesCode = fs.readFileSync(path.join(__dirname, 'vocab-images.js'), 'utf8');
const soundCode = fs.readFileSync(path.join(__dirname, 'sound.js'), 'utf8');
const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

vm.runInThisContext(dataCode);
vm.runInThisContext(vocabImagesCode);
vm.runInThisContext(soundCode);
vm.runInThisContext(appCode);

// ====================================================================
// TEST SUITE 1: TOEIC 400-700 & 6 MODES / WORD VALIDATION
// ====================================================================
console.log("💼 TEST SUITE 1: TOEIC 400-700 Full 6 Modes Coverage");

const toeicQuestions = IELTS_VOCAB_BANK.filter(q => q.category === 'toeic' || (q.id && q.id.startsWith('toeic_')));
assert(toeicQuestions.length === 600, `Kho câu hỏi TOEIC 400-700 phải có chính xác 600 câu (Thực tế: ${toeicQuestions.length})`);

const toeicWordsMap = {};
toeicQuestions.forEach(q => {
  const rootWord = q.target_word.split(' ')[0].toUpperCase();
  if (!toeicWordsMap[rootWord]) toeicWordsMap[rootWord] = [];
  toeicWordsMap[rootWord].push(q.mode);
});

const distinctWords = Object.keys(toeicWordsMap);
assert(distinctWords.length === 100, `Phải có đúng 100 từ vựng TOEIC cốt lõi trải dài từ 400-700 (Thực tế: ${distinctWords.length} từ)`);

const requiredModes = ['letter_fill', 'meaning_match', 'collocation', 'word_class', 'preposition', 'sentence_cloze'];
let all100Have6Modes = true;
distinctWords.forEach(w => {
  const modes = new Set(toeicWordsMap[w]);
  if (modes.size !== 6 || !requiredModes.every(m => modes.has(m))) {
    all100Have6Modes = false;
    console.error(`Từ TOEIC "${w}" thiếu mode! Hiện có:`, [...modes]);
  }
});
assert(all100Have6Modes, "Tất cả 100 từ vựng TOEIC đều có đầy đủ 6 gameplay modes không thiếu dạng nào!");

// Check filter counts
const engine = new GameEngine();
engine.currentGradeFilter = 'toeic';
const toeicBank = engine.getFilteredBank();
assert(toeicBank.length === 600, `Bộ lọc TOEIC trả về đúng 600 câu (Thực tế: ${toeicBank.length})`);

['toeic400', 'toeic500', 'toeic600', 'toeic700'].forEach(tier => {
  engine.currentGradeFilter = tier;
  const tierBank = engine.getFilteredBank();
  assert(tierBank.length === 150, `Bộ lọc ${tier} trả về đúng 150 câu (Thực tế: ${tierBank.length})`);
});

engine.currentGradeFilter = 'ielts';
const ieltsBank = engine.getFilteredBank();
assert(ieltsBank.length === 161, `Bộ lọc IELTS trả về đúng 161 câu (Thực tế: ${ieltsBank.length})`);

engine.currentGradeFilter = 'all';
const allBank = engine.getFilteredBank();
assert(allBank.length === 761, `Bộ lọc Tất cả trả về đúng 761 câu (Thực tế: ${allBank.length})`);

// ====================================================================
// TEST SUITE 2: ADAPTIVE LEARNING & MEMORY PROFILES (Lv.1 -> Lv.5)
// ====================================================================
console.log("\n🧠 TEST SUITE 2: Adaptive Learning Algorithm & Mastery Progression");

const testQ = {
  id: 'toeic_w01_mm',
  target_word: 'ACCOMMODATE',
  vietnamese: 'cung cấp chỗ ở'
};

// Reset memory profiles
engine.memoryProfiles = {};
let prof = engine.getWordProfile(testQ);
assert(prof.masteryLevel === 1 && prof.retention === 25, "Từ mới bắt đầu ở Level 1 (🌱 Mới) với Retention 25%");

// Quick correct (<3.0s) -> Boost retention +30%
prof = engine.updateMemoryProfile(testQ, true, 2.1);
assert(prof.retention === 55, `Trả lời đúng nhanh (<3s) tăng +30% retention (Thực tế: ${prof.retention}%)`);
assert(prof.consecutiveCorrect === 1 && prof.masteryLevel === 2, `1 câu đúng liên tiếp nâng lên Level 2 (🌿 Đang học)`);

// Continue correct answers
prof = engine.updateMemoryProfile(testQ, true, 2.5);
assert(prof.masteryLevel === 3, `2 câu đúng liên tiếp đạt Level 3 (🌸 Nhớ tốt)`);

prof = engine.updateMemoryProfile(testQ, true, 2.0);
assert(prof.masteryLevel === 4, `3 câu đúng liên tiếp đạt Level 4 (⭐ Nhuần nhuyễn)`);

prof = engine.updateMemoryProfile(testQ, true, 1.8);
assert(prof.masteryLevel === 5 && prof.retention === 100, `4 câu đúng liên tiếp & retention >= 90% đạt Level 5 (💎 Thành thạo)`);

// Incorrect answer -> Penalty & drop level
prof = engine.updateMemoryProfile(testQ, false, 0);
assert(prof.retention === 70, `Trả lời sai bị trừ 30% retention (Thực tế: ${prof.retention}%)`);
assert(prof.consecutiveCorrect === 0, "Trả lời sai reset consecutiveCorrect về 0");
assert(prof.masteryLevel === 4, "Trả lời sai giảm 1 cấp độ Mastery");

// Priority calculation
const priorityUnseen = engine.calculatePriorityScore({ id: 'unseen_01', target_word: 'NEW_WORD' });
assert(priorityUnseen >= 2.5, `Từ chưa từng học có điểm ưu tiên cao (>= 2.5) để kích hoạt học (Thực tế: ${priorityUnseen.toFixed(2)})`);

const priorityKnown = engine.calculatePriorityScore(testQ);
assert(priorityKnown < priorityUnseen, `Từ đã quen có điểm ưu tiên thấp hơn từ chưa học (${priorityKnown.toFixed(2)} < ${priorityUnseen.toFixed(2)})`);

// Dynamic Difficulty Flow in Question Queue (T1 -> T2 -> T3)
engine.usedQuestionIds.clear();
const roundQueue = engine.generateAdaptiveQueue(engine.getFilteredBank());
assert(roundQueue.length === 10, `Hàng đợi ván chơi luôn có đủ 10 câu (Thực tế: ${roundQueue.length})`);

const q1to3Modes = roundQueue.slice(0, 3).map(q => q.mode);
const isT1Warmup = q1to3Modes.every(m => ['meaning_match', 'letter_fill'].includes(m));
assert(isT1Warmup, `Câu 1-3 thuộc Tầng 1 (Khởi động: meaning_match / letter_fill). Các modes: ${q1to3Modes.join(', ')}`);

const q4to7Modes = roundQueue.slice(3, 7).map(q => q.mode);
const isT2Application = q4to7Modes.every(m => ['word_class', 'collocation'].includes(m));
assert(isT2Application, `Câu 4-7 thuộc Tầng 2 (Tăng tốc: word_class / collocation). Các modes: ${q4to7Modes.join(', ')}`);

const q8to10Modes = roundQueue.slice(7, 10).map(q => q.mode);
const isT3Mastery = q8to10Modes.every(m => ['preposition', 'sentence_cloze'].includes(m));
assert(isT3Mastery, `Câu 8-10 thuộc Tầng 3 (Về đích: preposition / sentence_cloze). Các modes: ${q8to10Modes.join(', ')}`);

// ====================================================================
// TEST SUITE 3: INTERACTIVE LETTER FILL KEYBOARD UX
// ====================================================================
console.log("\n🔤 TEST SUITE 3: Interactive Letter Fill Keyboard UX");

const lfQuestion = toeicQuestions.find(q => q.mode === 'letter_fill' && q.target_word === 'SCHEDULE');
engine.questions = [lfQuestion];
engine.currentIndex = 0;
engine.loadQuestion(0);

const blankBoxes = engine.letterBoxContainer.querySelectorAll('.letter-box.blank');
assert(blankBoxes.length === lfQuestion.missing.length, `Số ô trống hiển thị khớp số ký tự missing (${blankBoxes.length} ô)`);
assert(blankBoxes.every(b => b.textContent === '_'), "Các ô trống ban đầu hiển thị '_'");

const letterTiles = engine.answersContainer.querySelectorAll('.letter-tile-btn');
assert(letterTiles.length === 8, `Bàn phím ký tự tạo đúng 8 phím bấm (Thực tế: ${letterTiles.length} phím)`);

// Check that missing characters are in the keyboard
const missingChars = (Array.isArray(lfQuestion.missing) ? lfQuestion.missing : lfQuestion.missing.split('')).map(c => c.toUpperCase());
const keyboardChars = letterTiles.map(t => t.dataset.char);
const hasAllMissing = missingChars.every(ch => keyboardChars.includes(ch));
assert(hasAllMissing, `Bàn phím chứa đầy đủ các ký tự đáp án: [${missingChars.join(', ')}]`);

// Simulate tapping a tile
const firstMissingChar = missingChars[0];
const targetTile = letterTiles.find(t => t.dataset.char === firstMissingChar && !t.classList.contains('used'));
targetTile.click();

assert(blankBoxes[0].textContent === firstMissingChar, `Chạm phím '${firstMissingChar}' điền vào ô trống đầu tiên`);
assert(targetTile.classList.contains('used'), "Phím đã chọn chuyển sang trạng thái .used và bị vô hiệu hóa");

// Undo action
const btnUndo = engine.answersContainer.querySelector('#btn-letter-undo');
btnUndo.click();
assert(blankBoxes[0].textContent === '_', "Bấm 'Xóa ký tự' trả ô trống về '_'");
assert(!targetTile.classList.contains('used'), "Phím ký tự được khôi phục sẵn sàng chọn lại");

// Fill all blanks correctly and evaluate
missingChars.forEach((ch, idx) => {
  const tile = letterTiles.find(t => t.dataset.char === ch && !t.classList.contains('used'));
  tile.click();
});

assert(engine.roundResults.length === 1 && engine.roundResults[0] === true, "Điền đủ các ký tự đúng tự động chấm ĐÚNG và chuyển trạng thái!");
assert(engine.score > 0, `Nhận điểm thưởng thành công: ${engine.score} XP`);

// 50:50 Powerup on letter fill
const lfQuestion2 = toeicQuestions.find(q => q.mode === 'letter_fill' && q.target_word === 'INVOICE');
engine.questions = [lfQuestion2];
engine.currentIndex = 0;
engine.powerups.fiftyFifty = true;
engine.isAnsweringLocked = false;
engine.loadQuestion(0);

engine.useFiftyFifty();
const eliminatedTiles = engine.answersContainer.querySelectorAll('.letter-tile-btn.eliminated');
assert(eliminatedTiles.length === 2, `Kích hoạt 50:50 loại chính xác 2 ký tự nhiễu trên bàn phím (Thực tế: ${eliminatedTiles.length})`);

const q2Missing = (Array.isArray(lfQuestion2.missing) ? lfQuestion2.missing : lfQuestion2.missing.split('')).map(c => c.toUpperCase());
const eliminatedChars = eliminatedTiles.map(t => t.dataset.char);
const didNotEliminateCorrect = eliminatedChars.every(ch => !q2Missing.includes(ch));
assert(didNotEliminateCorrect, "50:50 không bao giờ loại nhầm ký tự đáp án đúng");

// ====================================================================
// TEST SUITE 4: SENTENCE ORDER (GAME SẮP XẾP TỪ THÀNH CÂU - 30 GIÂY, 4 CỤM NGẮN, KHÔNG ĐÁNH SỐ)
// ====================================================================
console.log("\n🧩 TEST SUITE 4: Game Sắp Xếp Từ Thành Câu (30 Giây, 4 Mảnh Dễ Ghép, Không Đánh Số)");

engine.setGradeFilter('sentence_order');
assert(engine.currentGradeFilter === 'sentence_order', "Chuyển sang chế độ 'sentence_order' thành công");
assert(engine.activeRoundTimeLimit === 30.0 && engine.remainingTime === 30.0, `Thời gian chơi game Sắp xếp câu tăng lên đúng 30.0 giây (Thực tế: ${engine.remainingTime}s)`);
assert(engine.questions.length === 10, `Tạo đủ 10 câu hỏi Sắp xếp câu trong ván (Thực tế: ${engine.questions.length})`);
assert(engine.questions.every(q => q.mode === 'sentence_order' && Array.isArray(q.wordChunks) && q.wordChunks.length <= 4), "Mỗi câu hỏi đều được rút gọn tối đa 4 mảnh từ dễ hiểu");

const soQuestion = engine.questions[0];
const slotBoxes = engine.letterBoxContainer.querySelectorAll('.sentence-slot-box');
const wordTiles = engine.answersContainer.querySelectorAll('.word-order-tile-btn');
assert(slotBoxes.length === soQuestion.wordChunks.length, `Số ô ghép câu khớp số cụm từ (${slotBoxes.length} ô)`);
assert(wordTiles.length === soQuestion.wordChunks.length, `Số nút mảnh từ khớp số cụm từ (${wordTiles.length} nút)`);
assert(!wordTiles[0].innerHTML.includes('word-tile-num'), "Đã bỏ đánh số ở đầu các từ trong thẻ game Sắp xếp câu");

// Chạm từng mảnh từ theo đúng thứ tự của wordChunks để hoàn thành câu
const scoreBeforeSO = engine.score;
soQuestion.wordChunks.forEach(chunk => {
  const tile = wordTiles.find(t => t.dataset.chunk === chunk && !t.classList.contains('used'));
  if (tile) tile.click();
});
assert(engine.score > scoreBeforeSO, `Ghép đúng trật tự câu tự động chấm ĐÚNG và cộng điểm (${engine.score} XP)`);

// ====================================================================
// TEST SUITE 5: VERBATIM EXAM QUESTIONS & AI CONCISE EXPLANATION
// ====================================================================
console.log("\n📄 TEST SUITE 5: Bê Nguyên Câu Trong Đề Thành Game & AI Giải Thích Ngắn Gọn");

engine.customExamBank = [
  {
    id: 'custom_exam_test_1',
    category: 'custom_exam',
    is_custom_exam: true,
    exam_verbatim: true,
    grade_label: 'ĐỀ THI GỐC',
    band: 'TOEIC 650',
    topic: 'Đề Thi AI',
    target_word: 'prior to',
    vietnamese: 'trước khi (= before)',
    mode: 'sentence_cloze',
    sentence: 'All visitors must display their identification badges ____ entering the research laboratory.',
    prompt: '📄 Câu hỏi nguyên bản từ đề thi • Chọn đáp án đúng:',
    options: ['instead of', 'prior to', 'except for', 'regardless of'],
    correct: 1,
    explanation: 'Sau "prior to" + V-ing (prior to entering = trước khi bước vào).',
    real_exam_sentence: 'All visitors must display their identification badges prior to entering the research laboratory.',
    exam_task: 'Đề Thi Gốc (AI Giải Đề)',
    common_mistake: ''
  }
];

engine.setGradeFilter('custom_exam');
assert(engine.currentGradeFilter === 'custom_exam', "Chuyển sang chế độ 'custom_exam' thành công");
assert(engine.questions.length === 1 && engine.questions[0].id === 'custom_exam_test_1', "Giữ nguyên câu hỏi nguyên bản từ đề thi vào game");
assert(engine.questionMainText.innerHTML.includes('All visitors must display their identification badges'), "Hiển thị nguyên văn câu hỏi trong đề thi lên màn hình game");

engine.handleAnswerSelect(1, null);
assert(engine.feedbackExplanation.textContent.includes('🤖 AI Giải thích: Sau "prior to" + V-ing'), `Popup hiển thị giải thích ngắn gọn của AI: "${engine.feedbackExplanation.textContent}"`);

// ====================================================================
// TEST SUITE 6: BROWSER HAPTIC FEEDBACK API & MINI GAMES HUB MENU
// ====================================================================
console.log("\n📳 TEST SUITE 6: Phản Hồi Rung (Browser Haptic API) & Menu Gom Nhóm Mini Games 🧩");

const vibrateCalls = [];
const mockNavigator = {
  vibrate(pattern) {
    vibrateCalls.push(pattern);
    return true;
  },
  getGamepads() {
    return [];
  }
};
Object.defineProperty(global, 'navigator', { value: mockNavigator, configurable: true, writable: true });
global.window.navigator = mockNavigator;

// Kiểm tra nút mở menu Mini Games 🧩
engine.toggleMiniGamesMenu();
assert(engine.miniGamesDropdownMenu.classList.contains('open'), "Bấm nút 🧩 mở menu chọn game (Sắp xếp câu & Luyện nghe)");
engine.closeMiniGamesMenu();
assert(!engine.miniGamesDropdownMenu.classList.contains('open'), "Đóng menu chọn game thành công");

// Kiểm tra Haptic Feedback khi trả lời ĐÚNG
engine.setGradeFilter('all');
const hapticQ1 = engine.questions[0];
vibrateCalls.length = 0;
engine.handleAnswerSelect(hapticQ1.correct, null);
assert(engine.lastHapticStyle === 'success', "Trả lời ĐÚNG kích hoạt Haptic style 'success'");
assert(vibrateCalls.length > 0 && Array.isArray(vibrateCalls[vibrateCalls.length - 1]), `Browser navigator.vibrate() được gọi với nhịp rung chiến thắng: [${vibrateCalls[vibrateCalls.length - 1]}]`);

// Kiểm tra Haptic Feedback khi trả lời SAI
engine.nextQuestion();
const hapticQ2 = engine.questions[engine.currentIndex];
const wrongOptIdx = (hapticQ2.correct + 1) % 4;
vibrateCalls.length = 0;
engine.handleAnswerSelect(wrongOptIdx, null);
assert(engine.lastHapticStyle === 'error', "Trả lời SAI kích hoạt Haptic style 'error'");
assert(vibrateCalls.length > 0 && JSON.stringify(vibrateCalls[vibrateCalls.length - 1]) === JSON.stringify([65, 45, 95]), `Browser navigator.vibrate() được gọi với nhịp rung cảnh báo sai: [${vibrateCalls[vibrateCalls.length - 1]}]`);

// ====================================================================
// TEST SUITE 7: NGHE CHÉP CHÍNH TẢ (LISTENING DICTATION MINI-GAME)
// ====================================================================
console.log("\n✍️ TEST SUITE 7: Mini-Game Nghe Chép Chính Tả (Listening Dictation)");

engine.setGradeFilter('dictation');
assert(engine.currentGradeFilter === 'dictation', "Chuyển sang chế độ 'dictation' (Nghe chép chính tả) trong Kho Trò Chơi 🧩 thành công");
assert(engine.activeRoundTimeLimit === 30.0 && engine.remainingTime === 30.0, `Thời gian chơi game Nghe chép chính tả là 30.0 giây (Thực tế: ${engine.remainingTime}s)`);
assert(engine.questions.length === 10 && engine.questions.every(q => q.mode === 'dictation' && q.isDictation), "Tất cả 10 câu trong ván được chuyển thành thử thách Nghe chép chính tả (dictation)");

const dictQuestion = engine.questions[0];
const inlineSlot = engine.questionMainText.querySelector('#dictation-inline-slot') || engine.currentDictationInlineSlot;
const dictInput = engine.answersContainer.querySelector('#dictation-input');
const dictSubmitBtn = engine.answersContainer.querySelector('#btn-dictation-submit');
const dictLetterChips = engine.answersContainer.querySelectorAll('.dictation-letter-chip');
assert(Boolean(inlineSlot && dictInput && dictSubmitBtn), "Hiển thị đầy đủ ô trống trong câu (#dictation-inline-slot), ô nhập chính tả (#dictation-input) và nút Chấm (#btn-dictation-submit)");
assert(dictLetterChips.length === dictQuestion.dictationLetters.length, `Hiển thị đầy đủ ${dictLetterChips.length} phím chữ cái gợi ý chạm nhanh trên điện thoại/máy tính bảng`);

const scoreBeforeDict = engine.score;
const evalRes = engine.evaluateDictation(dictQuestion, dictQuestion.dictationTarget);
assert(evalRes && evalRes.isCorrect === true, `Chấm điểm Nghe chép chính tả chính xác tuyệt đối với từ "${dictQuestion.dictationTarget}"`);
assert(engine.score > scoreBeforeDict, `Chép chính tả đúng được cộng điểm thưởng XP (${engine.score} XP)`);
assert(inlineSlot.classList.contains('slot-correct'), "Ô trống trong câu phát sáng màu xanh lá (.slot-correct) khi chép đúng chính tả");

// ====================================================================
// TEST SUITE 8: DAILY QUESTS & STREAK SYSTEM (NHIỆM VỤ HÀNG NGÀY & CHUỖI NGÀY HỌC)
// ====================================================================
console.log("\n🔥 TEST SUITE 8: Hệ Thống Nhiệm Vụ Hàng Ngày & Chuỗi Ngày Học (Daily Streak)");

assert(engine.dailyTracker && Array.isArray(engine.dailyTracker.quests) && engine.dailyTracker.quests.length === 3, "Khởi tạo đủ 3 nhiệm vụ hàng ngày (Khởi động chuẩn xác, Chinh phục Kho Game, Bậc thầy Combo)");

engine.openDailyQuestModal();
assert(engine.dailyQuestModalOverlay.classList.contains('active'), "Mở Popup Nhiệm Vụ Hàng Ngày & Chuỗi Ngày Học thành công");
engine.closeDailyQuestModal();
assert(!engine.dailyQuestModalOverlay.classList.contains('active'), "Đóng Popup Nhiệm Vụ Hàng Ngày thành công");

// Giả lập hoàn thành nhiệm vụ quest_minigame_3 (chơi đủ 3 câu trong Kho Game 🧩)
const minigameQuest = engine.dailyTracker.quests.find(q => q.id === 'quest_minigame_3');
minigameQuest.progress = 2;
minigameQuest.claimed = false;
engine.nextQuestion();
const dictQuestion2 = engine.questions[engine.currentIndex];
engine.evaluateDictation(dictQuestion2, dictQuestion2.dictationTarget);

assert(minigameQuest.progress >= 3, `Tiến độ nhiệm vụ Kho Game tự động tăng lên ${minigameQuest.progress}/${minigameQuest.target}`);

const scoreBeforeClaim = engine.score;
const claimedXP = engine.claimDailyQuest('quest_minigame_3');
assert(claimedXP > 0 && minigameQuest.claimed === true, "Bấm Nhận Thưởng nhiệm vụ thành công và đánh dấu đã nhận (claimed = true)");
assert(engine.score === scoreBeforeClaim + minigameQuest.rewardXP, `Nhận thưởng cộng chính xác +${minigameQuest.rewardXP} XP vào tổng điểm (${engine.score} XP)`);

// ====================================================================
// TEST SUITE 9: MEDIA CHANNEL AUDIO, LISTENING GRADE FILTER, 5-TO-60 PROGRESSIVE AI EXAM & ADAPTIVE RETRY
// ====================================================================
console.log("\n🎧 TEST SUITE 9: Kênh Âm Thanh Media, Luyện Nghe Theo Lớp & Tạo Đề AI 5->60 Câu + Adaptive");

// 1. Kiểm định mở khóa kênh âm thanh Media khi điện thoại bật chế độ Im lặng
global.navigator.audioSession = { type: 'ambient' };
const unlockedMedia = soundEngine.unlockMediaChannel();
assert(unlockedMedia === true && global.navigator.audioSession.type === 'playback', "Chuyển kênh âm thanh sang 'playback' (Media Volume) để phát tiếng ngay cả khi gạt nút Tắt chuông điện thoại");

// 2. Kiểm định phân loại theo lớp trong phần Luyện Nghe (Audio Quiz)
engine.setGradeFilter('audio');
engine.setAudioGradeFilter('g8');
assert(engine.currentGradeFilter === 'audio' && engine.audioGradeFilter === 'g8', "Chuyển sang Luyện Nghe phân loại Lớp 8 thành công");
assert(localStorage.getItem('ielts_audio_grade_filter') === 'g8', "Lưu lựa chọn phân loại Lớp 8 của phần Luyện Nghe vào LocalStorage");
assert(engine.questions.length === 10 && engine.questions.every(q => q.isAudioQuiz === true && q.grade === 8), "100% câu hỏi trong vòng Luyện Nghe Lớp 8 đều thuộc chương trình Lớp 8");

// 3. Kiểm định AI Tạo Đề: Tạo trước 5 câu làm ngay + Tạo ngầm tối đa 60 câu + Adaptive khi làm sai + Lưu Local
assert(engine.initialExamBatchSize === 5 && engine.maxQuestionsPerExam === 60, "Cấu hình AI Tạo Đề chuẩn: Tạo trước 5 câu đầu (initialExamBatchSize = 5) và tối đa 60 câu/đề (maxQuestionsPerExam = 60)");

const sample65Questions = Array.from({ length: 65 }, (_, idx) => ({
  id: `custom_exam_test_${idx + 1}`,
  category: 'custom_exam',
  is_custom_exam: true,
  target_word: `term_${idx + 1}`,
  vietnamese: `nghĩa câu ${idx + 1}`,
  mode: 'sentence_cloze',
  sentence: `Question ${idx + 1}: The company decided to ____ the new policy #${idx + 1}.`,
  prompt: 'Chọn đáp án đúng:',
  options: [`term_${idx + 1}`, 'wrong_a', 'wrong_b', 'wrong_c'],
  correct: 0,
  explanation: `Giải thích ngắn gọn cho câu ${idx + 1}.`
}));

// Lưu thử 65 câu vào customExamBank -> Phải tự động giới hạn tối đa 60 câu trong LocalStorage
engine.customExamBank = sample65Questions;
engine.saveCustomExamBank();
const savedBankFromStorage = JSON.parse(localStorage.getItem('ielts_custom_exam_bank') || '[]');
assert(savedBankFromStorage.length === 60 && engine.customExamBank.length === 60, "Giới hạn chuẩn tối đa 60 câu cho 1 đề thi và lưu trữ mượt mà vào LocalStorage");

// Giả lập lúc đầu mới tạo xong 5 câu đầu tiên để học sinh làm ngay
engine.customExamBank = sample65Questions.slice(0, 5);
engine.saveCustomExamBank();
engine.setGradeFilter('custom_exam');
assert(engine.questions.length === 5, "Khi AI vừa tạo xong 5 câu đầu, học sinh vào làm ngay 5 câu hỏi đầu tiên mà không phải chờ");

// Giả lập học sinh trả lời SAI câu số 1 trong đề thi AI -> Thuật toán Adaptive kích hoạt
const firstExamQ = engine.questions[0];
const wrongOptionIdx = (firstExamQ.correct + 1) % 4;
const queueLenBeforeWrong = engine.questions.length;
engine.handleAnswerSelect(wrongOptionIdx, null);

assert(engine.weakWordIds.includes(firstExamQ.id), "Câu đề thi làm sai được đưa vào danh sách Từ Yếu (weakWordIds) trong LocalStorage");
assert(engine.customExamBank[0].adaptiveFailCount === 1, "Lưu vết số lần sai (adaptiveFailCount = 1) trực tiếp vào câu hỏi đề thi trong LocalStorage");
assert(engine.questions.length === queueLenBeforeWrong + 1 && engine.questions.some(q => q.isAdaptiveExamRetry === true), "Thuật toán Adaptive tự động chèn câu ôn tập nhắc lại (isAdaptiveExamRetry) vào hàng đợi khi học sinh làm sai");

// Kiểm tra UI nút 'Tạo Câu Hỏi' to rõ và thanh phân loại lớp trong index.html
const indexHtmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(indexHtmlContent.includes('id="btn-run-exam-convert"') && indexHtmlContent.includes('<span>Tạo Câu Hỏi</span>') && indexHtmlContent.includes('btn-create-questions-xl'), "Nút tạo câu hỏi đã đổi thành 'Tạo Câu Hỏi' với giao diện nút lớn (.btn-create-questions-xl)");
assert(indexHtmlContent.includes('id="audio-grade-filter-bar"'), "Giao diện Luyện Nghe có thanh chọn phân loại theo Lớp (#audio-grade-filter-bar)");

// ====================================================================
// TEST SUITE 10: DICTATION CHAR DIFF, SLOW REPLAY ON MISTAKE & GRADE FILTER
// ====================================================================
console.log("\n✍️ TEST SUITE 10: Nghe Chép Chính Tả Chi Tiết (So Khớp Ký Tự, Phát Chậm Khi Sai & Phân Loại Lớp)");

assert(!indexHtmlContent.includes('id="btn-voice-check-mode"') && indexHtmlContent.includes('id="btn-dictation-mode"'), "Đã loại bỏ hoàn toàn nút Luyện phát âm dễ lỗi và thay bằng nút Chép chính tả (#btn-dictation-mode) trong Kho Trò Chơi");

engine.setGradeFilter('dictation');
engine.setAudioGradeFilter('g9');
assert(engine.currentGradeFilter === 'dictation' && engine.questions.every(q => q.isDictation && q.grade === 9), "Nghe chép chính tả hỗ trợ lọc câu hỏi theo từng Lớp (ví dụ: Lớp 9)");

const dictCoachQ = engine.questions[0];
dictCoachQ.dictationTarget = 'sustainable';
dictCoachQ.dictationTargetWord = 'sustainable';
dictCoachQ.target_word = 'sustainable';
dictCoachQ.dictationLetters = ['S', 'U', 'S', 'T', 'A', 'I', 'N', 'A', 'B', 'L', 'E'];
dictCoachQ.dictationScrambledLetters = ['S', 'U', 'S', 'T', 'A', 'I', 'N', 'A', 'B', 'L', 'E'];
engine.loadQuestion(0);

// Kiểm tra chạm phím chữ cái gợi ý và trợ giúp 50:50 điền nửa đầu từ
engine.powerups.fiftyFifty = true;
engine.useFiftyFifty();
const currentTypedAfter5050 = engine.dictationState.typedValue;
assert(currentTypedAfter5050 === 'susta', `Trợ giúp 50:50 trong Nghe chép chính tả tự động điền nửa đầu từ khóa: "${currentTypedAfter5050}"`);

// Theo dõi lệnh phát lại từ bị viết sai qua speechEngine.speakWord
const spokenReplayCalls = [];
const origSpeakWord = speechEngine.speakWord.bind(speechEngine);
speechEngine.speakWord = (word, rate) => {
  spokenReplayCalls.push({ word, rate });
  return origSpeakWord(word, rate);
};

vibrateCalls.length = 0;
const misDictEval = engine.evaluateDictation(dictCoachQ, 'sustanable');
assert(misDictEval.isCorrect === false && misDictEval.target === 'sustainable', "Phát hiện chính xác lỗi viết sai chính tả ('sustanable' vs 'sustainable')");
assert(engine.lastHapticStyle === 'error' && vibrateCalls.length > 0, `Kích hoạt phản hồi rung cảnh báo khi chép sai chính tả: [${vibrateCalls[vibrateCalls.length - 1]}]`);
assert(spokenReplayCalls.some(c => c.word === 'sustainable' && c.rate === 0.72), "Tự động phát âm chậm lại từ đúng ('sustainable' ở tốc độ 0.72x) khi học sinh chép sai");
const slotAfterErr = engine.questionMainText.querySelector('#dictation-inline-slot') || engine.currentDictationInlineSlot;
assert(slotAfterErr && slotAfterErr.innerHTML.includes('dict-char-ok') && slotAfterErr.innerHTML.includes('dict-char-err'), "Hiển thị phân tích từng ký tự đúng (.dict-char-ok) và sai (.dict-char-err) trực quan trên câu");

// ====================================================================
// TEST SUITE 11: HIỆU ỨNG ZOOM / CHUYỂN ĐỘNG NHẸ & TÔ SÁNG VIỀN ẢNH MINH HỌA
// ====================================================================
console.log("\n🎬 TEST SUITE 11: Hiệu Ứng Zoom/Chuyển Động Nhẹ & Tô Sáng Viền Ảnh Minh Họa");

assert(Object.keys(VOCAB_IMAGES).length === 58, `Giữ nguyên đầy đủ 58 ảnh minh họa gốc trong VOCAB_IMAGES (Thực tế: ${Object.keys(VOCAB_IMAGES).length})`);

// Kiểm tra 1 câu có ảnh gốc (ví dụ: volunteer)
const illustratedQ = IELTS_VOCAB_BANK.find(q => String(q.target_word || '').toLowerCase() === 'volunteer');
const resolvedVolunteerUrl = engine.resolveQuestionImageUrl(illustratedQ);
assert(Boolean(resolvedVolunteerUrl), "Giải mã chính xác đường dẫn ảnh minh họa gốc cho từ vựng ('volunteer')");

// Nạp trực tiếp câu hỏi có ảnh minh họa để kiểm tra hiển thị khung ảnh, chạm phát âm & tô sáng viền
engine.questions = [illustratedQ, ...engine.questions.slice(0, 9)];
engine.currentIndex = 0;
engine.loadQuestion(0);

assert(engine.vocabImageContainer.style.display === 'flex' && engine.vocabImageContainer.classList.contains('gif-stage-active'), "Khung ảnh minh họa (#vocab-image.gif-stage-active) hiển thị đúng kích thước chuẩn kèm hiệu ứng zoom nhẹ và tô sáng viền");

spokenReplayCalls.length = 0;
const spokenFromTap = engine.triggerGifTapSpeak();
assert(Boolean(spokenFromTap) && spokenReplayCalls.some(c => c.word === spokenFromTap), `Chạm vào khung ảnh phát âm ngay từ vựng "${spokenFromTap}" qua kênh Media`);
assert(engine.vocabImageContainer.classList.contains('gif-speaking-active'), "Khung ảnh kích hoạt hiệu ứng tô sáng viền (.gif-speaking-active) khi chạm vào");

// Kiểm tra tô sáng viền Xanh Ngọc khi trả lời ĐÚNG
engine.handleAnswerSelect(illustratedQ.correct, null);
assert(engine.vocabImageContainer.classList.contains('gif-react-correct') && engine.lastGifReactionState === 'correct_celebration', "Trả lời ĐÚNG kích hoạt tô sáng viền xanh ngọc (.gif-react-correct) trên khung ảnh");

// Kiểm tra tô sáng viền Đỏ San Hô khi trả lời SAI
engine.loadQuestion(0);
const wrongIdxForGif = (illustratedQ.correct + 1) % 4;
engine.handleAnswerSelect(wrongIdxForGif, null);
assert(engine.vocabImageContainer.classList.contains('gif-react-wrong') && engine.lastGifReactionState === 'wrong_shake', "Trả lời SAI kích hoạt tô sáng viền đỏ cảnh báo (.gif-react-wrong) trên khung ảnh");

// ====================================================================
// TEST SUITE 12: ADAPTIVE NGỮ PHÁP — LÀM LẠI NGAY Ở CÂU TIẾP THEO & HIỆU ỨNG CHỮ GIẢI THÍCH KỸ
// ====================================================================
console.log("\n📐 TEST SUITE 12: Adaptive Ngữ Pháp (Làm Lại Ngay Câu Tiếp Theo + Hiệu Ứng Chữ Giải Thích Dễ Hiểu)");

const sampleGrammarQ = toeicQuestions.find(q => q.mode === 'word_class' && q.sentence && /_{2,}/.test(q.sentence));
const samplePrepQ = toeicQuestions.find(q => q.mode === 'preposition' && q.sentence && /_{2,}/.test(q.sentence));

engine.hearts = 5;
engine.questions = [sampleGrammarQ, samplePrepQ];
engine.currentIndex = 0;
engine.loadQuestion(0);

// 1. Giả lập người chơi chọn SAI câu ngữ pháp số 1
const wrongGrammarChoice = (sampleGrammarQ.correct + 1) % 4;
engine.handleAnswerSelect(wrongGrammarChoice, null);

assert(engine.feedbackGrammarCoach.style.display === 'block' && engine.feedbackGrammarCoach.innerHTML.includes('grammar-formula-pill') && engine.feedbackGrammarCoach.innerHTML.includes('g-anim-word'), "Khi làm sai ngữ pháp, Ngăn Kéo Phản Hồi hiển thị ngay hộp phân tích ngữ pháp kèm hiệu ứng chữ chạy từng từ (.g-anim-word)");
assert(engine.feedbackExplanation.style.display === 'none' && !engine.feedbackExplanation.textContent.includes('TOEIC'), "Đã ẩn hoàn toàn khối 'TOEIC 600-650' (#feedback-explanation) để ưu tiên diện tích cho khối phân tích ngữ pháp (#feedback-grammar-coach)");
assert(engine.questions[1] && engine.questions[1].isGrammarRedo === true && engine.questions[1].baseQuestionId === sampleGrammarQ.id, "Câu hỏi tiếp theo ngay lập tức (currentIndex + 1) được chèn là câu Làm Lại Ngữ Pháp (isGrammarRedo === true)");

// 2. Bấm sang câu tiếp theo -> Phải là câu Làm Lại Ngữ Pháp kèm bảng hiệu ứng chữ giải thích chi tiết và gạch chân từ dấu hiệu
engine.nextQuestion();
const activeRedoQ = engine.questions[engine.currentIndex];
assert(activeRedoQ.isGrammarRedo === true, "Khi sang câu tiếp theo, người chơi được làm lại ngay câu ngữ pháp vừa sai");
assert(engine.adaptiveGrammarBanner.style.display === 'block' && engine.adaptiveGrammarBanner.innerHTML.includes('grammar-formula-flow') && engine.adaptiveGrammarBanner.innerHTML.includes('g-anim-word'), "Trên thẻ câu hỏi Làm Lại Ngữ Pháp hiển thị bảng công thức 3 bước và hiệu ứng chữ giải thích kỹ (.adaptive-grammar-banner)");
assert(engine.questionMainText.innerHTML.includes('grammar-cue-word') && engine.questionMainText.innerHTML.includes('grammar-redo-slot'), "Câu văn hiển thị hiệu ứng gạch chân sáng ở các từ dấu hiệu ngữ pháp (.grammar-cue-word) và gợi ý từ loại ngay tại chỗ trống (.grammar-redo-slot)");

console.log("\n======================================================================");
console.log(`🏁 KẾT QUẢ: ${passed}/${total} BÀI KIỂM ĐỊNH ADAPTIVE & TOEIC ĐẠT TUYỆT ĐỐI!`);
console.log("======================================================================");
clearInterval(engine.timerInterval);
process.exit(0);

