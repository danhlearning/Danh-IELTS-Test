/**
 * IELTS BLITZ ARENA - GAME ENGINE (iOS 27 LIQUID GLASS EDITION)
 * 10-Second Countdown, Spaced Repetition, Active Recall & Long-Term Memory Retention
 */

const CONFUSABLE_WORDS_DB = {
  complimentary: '⚠️ Phân biệt: "complimentary" (miễn phí / ca ngợi) ≠ "complementary" (bổ sung cho nhau).',
  economic: '⚠️ Phân biệt: "economic" (thuộc nền kinh tế) ≠ "economical" (tiết kiệm chi phí, nhiên liệu).',
  eligible: '⚠️ Phân biệt: "eligible + for/to V" (đủ điều kiện/tư cách) ≠ "legible" (chữ viết rõ ràng, dễ đọc).',
  confidential: '⚠️ Phân biệt: "confidential" (tuyệt mật, bảo mật) ≠ "confident" (tự tin).',
  considerable: '⚠️ Phân biệt: "considerable" (đáng kể, lớn) ≠ "considerate" (chu đáo, biết nghĩ cho người khác).',
  prospective: '⚠️ Phân biệt: "prospective" (tiềm năng, tương lai) ≠ "perspective" (góc nhìn, quan điểm).',
  compliance: '⚠️ Phân biệt: "in compliance with" (tuân thủ quy định) ≠ "appliance" (thiết bị gia dụng).',
  warranty: '⚠️ Phân biệt: "under warranty" (còn trong hạn bảo hành) ≠ "guaranty/guarantee" (cam kết đảm bảo).',
  notify: '⚠️ Phân biệt: "notify + Tân ngữ chỉ người (notify someone of)" ≠ "announce + Sự việc (announce something)".',
  reimburse: '⚠️ Phân biệt: "reimburse someone for expenses" (hoàn trả chi phí thực tế) ≠ "compensate" (bồi thường thiệt hại).',
  mandatory: '⚠️ Đồng nghĩa phòng thi: "mandatory" = "compulsory" = "obligatory" (bắt buộc theo quy định).',
  revenue: '⚠️ Phân biệt: "revenue" (tổng doanh thu bán hàng) ≠ "net profit/income" (lợi nhuận ròng sau thuế).',
  appraisal: '⚠️ Phân biệt: "performance appraisal" (đánh giá năng lực định kỳ) ≠ "approval" (sự phê duyệt).',
  terminate: '⚠️ Phân biệt: "terminate" (chấm dứt hợp đồng chủ động) ≠ "expire" (hết hạn tự nhiên).',
  discrepancy: '⚠️ Cấu trúc TOEIC Part 5: "discrepancy between A and B" hoặc "discrepancy in + N" (sự chênh lệch số liệu).',
  feasible: '⚠️ Phân biệt: "feasible" (khả thi về mặt thực hiện/ngân sách) ≠ "plausible" (nghe có vẻ hợp lý).',
  lucrative: '⚠️ Phân biệt: "lucrative" (sinh lời cao, béo bở) thường đi với "contract / market / career".',
  tentative: '⚠️ Phân biệt: "tentative schedule/itinerary" (lịch trình dự kiến, có thể thay đổi) ≠ "permanent" (cố định).',
  stringent: '⚠️ Cụm cố định: "stringent safety regulations / standards" (quy định/tiêu chuẩn nghiêm ngặt).',
  itinerary: '⚠️ Phân biệt: "itinerary" (lịch trình chi tiết chuyến công tác/du lịch) ≠ "agenda" (chương trình nghị sự cuộc họp).',
  invoice: '⚠️ Phân biệt: "invoice" (hóa đơn yêu cầu thanh toán) ≠ "receipt" (biên lai xác nhận đã thu tiền).',
  refund: '⚠️ Phân biệt: "full refund" (hoàn tiền 100% khi trả hàng) ≠ "rebate" (khoản chiết khấu hoàn lại sau khi mua).',
  vacancy: '⚠️ Phân biệt: "job vacancy / opening" (vị trí công việc còn trống) ≠ "vacation" (kỳ nghỉ).',
  extension: '⚠️ Đa nghĩa TOEIC: "extension" vừa là "sự gia hạn (deadline)" vừa là "số máy lẻ nội bộ".',
  postpone: '⚠️ Đồng nghĩa Part 5: "postpone + V-ing" = "put off" = "reschedule" (hoãn lại sang thời điểm khác).',
  supervise: '⚠️ Từ gia đình hay bẫy: "supervise" (động từ: giám sát), "supervisor" (người giám sát), "supervision" (sự giám sát).',
  representative: '⚠️ Bẫy từ loại: "representative" vừa là Tính từ, vừa là Danh từ đếm được (người đại diện).',
  specification: '⚠️ Thường dùng số nhiều "specifications (specs)" (thông số kỹ thuật chi tiết của sản phẩm/dự án).',
  mitigate: '⚠️ Collocation Band 7+: "mitigate the impact/risk" = "alleviate" (giảm nhẹ mức độ nghiêm trọng).',
  detrimental: '⚠️ Giới từ bắt buộc: "be detrimental TO something" = "be harmful to" (gây hại cho...).',
  ubiquitous: '⚠️ Band 7.5+: "ubiquitous" = "omnipresent" (hiện diện ở khắp mọi nơi trong đời sống hiện đại).',
  precipitous: '⚠️ Phân biệt: "a precipitous decline" (sự sụt giảm dốc đứng/đột ngột) ≠ "precipitate" (thúc đẩy nhanh).'
};

class GameEngine {
  constructor() {
    this.totalQuestionsPerRound = 10;
    this.maxTimeSeconds = 15.0; // Cơ chế đếm ngược 15 GIÂY chuẩn
    this.activeRoundTimeLimit = 15.0;
    this.timeStepMs = 50;

    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.hearts = 3;
    this.maxHearts = 3;
    this.consecutiveForHeartRecovery = 0;
    
    this.remainingTime = this.maxTimeSeconds;
    this.timerInterval = null;
    this.isAnsweringLocked = false;
    this.isFrozen = false;

    this.roundResults = []; // true / false
    this.responseTimes = [];
    this.sessionVocabs = []; // Danh sách từ trong vòng chơi
    this.questionStartTime = 0;

    this.powerups = {
      fiftyFifty: true,
      freeze: true,
      hint: true
    };

    // Hệ thống Spaced Repetition (SRS), Tiến độ ngày & Kho Đề Thi Tự Nhập AI
    this.srsMatrix = this.loadSRSMatrix();
    this.usedQuestionIds = this.loadUsedQuestionIds();
    this.weakWordIds = this.loadWeakWords();
    this.memoryProfiles = this.loadMemoryProfiles();
    this.dailyTracker = this.loadDailyTracker();
    this.autoNextEnabled = this.loadAutoNextSetting();
    this.customExamBank = this.loadCustomExamBank();
    this.selectedExamFile = null;
    this.examQuestionTypeMode = 'mixed';
    this.examQuestionCount = 10;
    this.masterySearchQuery = '';
    this.currentGradeFilter = 'all'; // Mặc định luôn luôn là adaptive toàn diện theo yêu cầu người dùng

    this.initDOMElements();
    this.bindEvents();
    this.applyPersistedSettings();
    this.updateGradeFilterUI();
    this.updateDailyTrackerUI();
    this.updateAutoNextUI();
    this.renderCustomExamPreview();
  }

  // Hệ thống phản hồi xúc giác vật lý (Tactile Haptic Feedback) đa nền tảng (Android Vibrate API + iOS 17.4+/18+ Taptic Switch)
  triggerHaptic(style = 'light') {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        if (style === 'light') {
          navigator.vibrate(12);
        } else if (style === 'medium') {
          navigator.vibrate(22);
        } else if (style === 'success') {
          navigator.vibrate([22, 30, 35]);
        } else if (style === 'error') {
          navigator.vibrate([55, 45, 65]);
        } else {
          navigator.vibrate(14);
        }
      }
      // Hỗ trợ Taptic Engine vật lý trên iOS 17.4+ / iOS 18+ Safari qua input[switch]
      if (this.iosHapticTrigger && typeof this.iosHapticTrigger.click === 'function') {
        this.iosHapticTrigger.click();
      }
    } catch (e) {}
  }

  attachTactileHaptics(btnEl, hapticStyle = 'light') {
    if (!btnEl || typeof btnEl.addEventListener !== 'function') return;
    const onPressStart = () => {
      if (btnEl.disabled) return;
      if (btnEl.classList && btnEl.classList.add) btnEl.classList.add('haptic-press');
      this.triggerHaptic(hapticStyle);
    };
    const onPressEnd = () => {
      if (btnEl.classList && btnEl.classList.remove) btnEl.classList.remove('haptic-press');
    };
    btnEl.addEventListener('pointerdown', onPressStart, { passive: true });
    btnEl.addEventListener('pointerup', onPressEnd, { passive: true });
    btnEl.addEventListener('pointerleave', onPressEnd, { passive: true });
    btnEl.addEventListener('pointercancel', onPressEnd, { passive: true });
  }

  loadCustomExamBank() {
    try {
      const saved = localStorage.getItem('ielts_custom_exam_bank');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomExamBank() {
    try {
      localStorage.setItem('ielts_custom_exam_bank', JSON.stringify(this.customExamBank || []));
    } catch (e) {}
  }

  getTodayDateKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getYesterdayDateKey() {
    const yest = new Date(Date.now() - 86400000);
    const y = yest.getFullYear();
    const m = String(yest.getMonth() + 1).padStart(2, '0');
    const d = String(yest.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  loadDailyTracker() {
    const todayKey = this.getTodayDateKey();
    const defaultTracker = {
      dateKey: todayKey,
      todayCount: 0,
      dailyGoal: 30,
      streakDays: 1,
      lastActiveDate: todayKey
    };
    try {
      const saved = localStorage.getItem('ielts_daily_tracker');
      if (!saved) return defaultTracker;
      const parsed = JSON.parse(saved);
      const dailyGoal = Number(parsed.dailyGoal) || 30;
      let streakDays = Math.max(1, Number(parsed.streakDays) || 1);
      let todayCount = Number(parsed.todayCount) || 0;

      if (parsed.dateKey !== todayKey) {
        if (parsed.dateKey === this.getYesterdayDateKey() && todayCount > 0) {
          streakDays += 1;
        } else if (parsed.dateKey !== this.getYesterdayDateKey()) {
          streakDays = 1;
        }
        todayCount = 0;
      }

      return {
        dateKey: todayKey,
        todayCount,
        dailyGoal,
        streakDays,
        lastActiveDate: todayKey
      };
    } catch (e) {
      return defaultTracker;
    }
  }

  saveDailyTracker() {
    try {
      localStorage.setItem('ielts_daily_tracker', JSON.stringify(this.dailyTracker));
    } catch (e) {}
  }

  recordDailyAnswer() {
    if (!this.dailyTracker) this.dailyTracker = this.loadDailyTracker();
    const todayKey = this.getTodayDateKey();
    if (this.dailyTracker.dateKey !== todayKey) {
      if (this.dailyTracker.dateKey === this.getYesterdayDateKey()) {
        this.dailyTracker.streakDays = (this.dailyTracker.streakDays || 1) + 1;
      } else {
        this.dailyTracker.streakDays = 1;
      }
      this.dailyTracker.dateKey = todayKey;
      this.dailyTracker.todayCount = 0;
    }
    this.dailyTracker.todayCount += 1;
    this.saveDailyTracker();
    this.updateDailyTrackerUI();
  }

  setDailyGoal(newGoal) {
    const goalNum = Number(newGoal) || 30;
    if (!this.dailyTracker) this.dailyTracker = this.loadDailyTracker();
    this.dailyTracker.dailyGoal = goalNum;
    this.saveDailyTracker();
    this.updateDailyTrackerUI();
  }

  updateDailyTrackerUI() {
    if (!this.dailyTracker) return;
    const { todayCount, dailyGoal, streakDays } = this.dailyTracker;
    if (this.dailyStreakFireEl) {
      this.dailyStreakFireEl.textContent = `🔥 ${streakDays} ngày`;
    }
    if (this.dailyGoalTextEl) {
      this.dailyGoalTextEl.textContent = `${todayCount}/${dailyGoal}`;
    }
    if (this.dailyGoalPill && this.dailyGoalPill.classList) {
      this.dailyGoalPill.classList.toggle('goal-met', todayCount >= dailyGoal);
    }
    if (this.modalDailyStreakEl) {
      this.modalDailyStreakEl.textContent = `🔥 Chuỗi ${streakDays} ngày`;
    }
    if (this.modalDailyProgressLbl) {
      this.modalDailyProgressLbl.textContent = `Hôm nay: ${todayCount} / ${dailyGoal} câu`;
    }
    if (this.modalDailyBarFill) {
      const pct = Math.min(100, Math.round((todayCount / Math.max(1, dailyGoal)) * 100));
      this.modalDailyBarFill.style.width = `${pct}%`;
    }
    if (this.dailyGoalSelector && this.dailyGoalSelector.querySelectorAll) {
      const btns = this.dailyGoalSelector.querySelectorAll('.dt-goal-btn');
      btns.forEach(b => {
        const g = (b && typeof b.getAttribute === 'function') ? Number(b.getAttribute('data-goal')) : 0;
        if (b && b.classList) b.classList.toggle('active', g === dailyGoal);
      });
    }
  }

  loadAutoNextSetting() {
    try {
      const saved = localStorage.getItem('ielts_auto_next');
      if (saved === null) return true;
      return saved === 'true';
    } catch (e) {
      return true;
    }
  }

  toggleAutoNext() {
    this.autoNextEnabled = !this.autoNextEnabled;
    try {
      localStorage.setItem('ielts_auto_next', String(this.autoNextEnabled));
    } catch (e) {}
    this.updateAutoNextUI();
    if (!this.autoNextEnabled && this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  updateAutoNextUI() {
    if (!this.btnAutoNextToggle) return;
    if (this.btnAutoNextToggle.classList) {
      this.btnAutoNextToggle.classList.toggle('active', this.autoNextEnabled);
    }
    this.btnAutoNextToggle.innerHTML = `<span>⚡ Tự qua: ${this.autoNextEnabled ? 'BẬT' : 'TẮT'}</span>`;
  }

  loadUsedQuestionIds() {
    try {
      const saved = sessionStorage.getItem('ielts_used_questions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  }

  saveUsedQuestionIds() {
    try {
      sessionStorage.setItem('ielts_used_questions', JSON.stringify([...this.usedQuestionIds]));
    } catch (e) {}
  }

  loadWeakWords() {
    try {
      const saved = localStorage.getItem('ielts_weak_words');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveWeakWords() {
    try {
      localStorage.setItem('ielts_weak_words', JSON.stringify(this.weakWordIds));
    } catch (e) {}
  }

  loadMemoryProfiles() {
    try {
      const saved = localStorage.getItem('ielts_memory_profiles');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  saveMemoryProfiles() {
    try {
      localStorage.setItem('ielts_memory_profiles', JSON.stringify(this.memoryProfiles));
    } catch (e) {}
  }

  getWordProfile(q) {
    if (!q) return { word: '', testedCount: 0, failCount: 0, consecutiveCorrect: 0, lastSeen: 0, avgResponseTime: 6.0, masteryLevel: 1, retention: 25 };
    const key = (q.target_word || q.id || 'WORD').toUpperCase();
    if (!this.memoryProfiles[key]) {
      this.memoryProfiles[key] = {
        word: key,
        testedCount: 0,
        failCount: 0,
        consecutiveCorrect: 0,
        lastSeen: 0,
        avgResponseTime: 6.0,
        masteryLevel: 1,
        retention: 25
      };
    }
    return this.memoryProfiles[key];
  }

  updateMemoryProfile(q, isCorrect, timeTaken = 5.0) {
    if (!q) return null;
    const prof = this.getWordProfile(q);
    prof.testedCount++;
    prof.lastSeen = Date.now();

    if (timeTaken > 0) {
      prof.avgResponseTime = prof.testedCount === 1
        ? Number(timeTaken.toFixed(2))
        : Number(((prof.avgResponseTime * 0.7) + (timeTaken * 0.3)).toFixed(2));
    }

    if (isCorrect) {
      prof.consecutiveCorrect++;
      if (timeTaken < 3.0) {
        prof.retention = Math.min(100, prof.retention + 30);
      } else if (timeTaken <= 8.0) {
        prof.retention = Math.min(100, prof.retention + 20);
      } else {
        prof.retention = Math.min(100, prof.retention + 10);
      }

      // Nâng cấp độ Mastery (Lv.1 🌱 đến Lv.5 💎)
      if (prof.consecutiveCorrect >= 4 && prof.retention >= 90) {
        prof.masteryLevel = 5;
      } else if (prof.consecutiveCorrect >= 3 && prof.retention >= 75) {
        prof.masteryLevel = 4;
      } else if (prof.consecutiveCorrect >= 2 && prof.retention >= 50) {
        prof.masteryLevel = 3;
      } else if (prof.consecutiveCorrect >= 1) {
        prof.masteryLevel = 2;
      }
    } else {
      prof.failCount++;
      prof.consecutiveCorrect = 0;
      prof.retention = Math.max(25, prof.retention - 30);
      prof.masteryLevel = Math.max(1, prof.masteryLevel - 1);
    }

    const key = (q.target_word || q.id || 'WORD').toUpperCase();
    this.memoryProfiles[key] = prof;
    this.saveMemoryProfiles();
    return prof;
  }

  calculatePriorityScore(q) {
    const prof = this.getWordProfile(q);
    if (prof.testedCount === 0) {
      return 2.5; // Ưu tiên cao cho từ vựng mới tiếp xúc
    }
    const failRate = prof.failCount / Math.max(1, prof.testedCount);
    const hoursSinceSeen = (Date.now() - prof.lastSeen) / (1000 * 60 * 60);
    const timeDecay = Math.min(1.0, hoursSinceSeen / 24);
    const speedFactor = Math.min(1.0, prof.avgResponseTime / 15.0);

    let score = (failRate * 0.40) + (timeDecay * 0.35) + (speedFactor * 0.25);
    score += (100 - prof.retention) / 100 * 0.3;

    if (this.weakWordIds && this.weakWordIds.includes(q.id)) {
      score += 0.5;
    }
    return score;
  }

  loadSRSMatrix() {
    try {
      const saved = localStorage.getItem('ielts_srs_matrix');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  saveSRSMatrix() {
    try {
      localStorage.setItem('ielts_srs_matrix', JSON.stringify(this.srsMatrix));
    } catch (e) {
      console.error("Không thể lưu SRS matrix", e);
    }
  }

  updateWordRetention(wordId, isCorrect) {
    if (!this.srsMatrix[wordId]) {
      this.srsMatrix[wordId] = { retention: 25, failCount: 0, testedCount: 0 };
    }
    const record = this.srsMatrix[wordId];
    record.testedCount++;

    if (isCorrect) {
      record.retention = Math.min(100, record.retention + 25);
    } else {
      record.retention = Math.max(25, record.retention - 25);
      record.failCount++;
    }
    this.saveSRSMatrix();
    return record.retention;
  }

  getWordRetention(wordId) {
    return this.srsMatrix[wordId] ? this.srsMatrix[wordId].retention : 25;
  }

  initDOMElements() {
    // Top status & Segmented Round Bar & Daily Goal
    this.timerBar = document.getElementById('timer-bar');
    this.timerSecondsEl = document.getElementById('timer-seconds');
    this.countdownDigitalBox = document.getElementById('countdown-digital-box');
    this.scoreEl = document.getElementById('score-display');
    this.progressText = document.getElementById('progress-text');
    this.streakPill = document.getElementById('streak-pill');
    this.streakText = document.getElementById('streak-text');
    this.heartsContainer = document.getElementById('hearts-container');
    this.segmentedRoundBar = document.getElementById('segmented-round-bar');
    this.dailyGoalPill = document.getElementById('daily-goal-pill');
    this.dailyStreakFireEl = document.getElementById('daily-streak-fire');
    this.dailyGoalTextEl = document.getElementById('daily-goal-text');

    // Dynamic Island Liquid Droplet Spring
    this.islandEl = document.getElementById('dynamic-island');
    this.islandMsg = document.getElementById('island-message');
    this.islandIcon = document.getElementById('island-drop-icon');
    this.islandTitle = document.getElementById('island-drop-title');

    // Question card
    this.questionCard = document.getElementById('question-card');
    this.gradeBadge = document.getElementById('grade-badge');
    this.bandBadge = document.getElementById('band-badge');
    this.masteryBadge = document.getElementById('mastery-badge');
    this.modeBadge = document.getElementById('mode-badge');
    this.topicBadge = document.getElementById('topic-badge');
    this.promptText = document.getElementById('prompt-text');
    this.questionMainText = document.getElementById('question-main-text');
    this.letterBoxContainer = document.getElementById('letter-box-container');
    this.vocabImageContainer = document.getElementById('vocab-image');
    this.vocabImg = document.getElementById('vocab-img');
    this.phoneticGuide = document.getElementById('phonetic-guide');
    this.academicHintPill = document.getElementById('academic-hint-pill');

    // Audio Quiz Panel
    this.audioQuizPanel = document.getElementById('audio-quiz-panel');
    this.audioWaveBars = document.getElementById('audio-wave-bars');
    this.btnAudioQuizPlay = document.getElementById('btn-audio-quiz-play');
    this.btnAudioQuizSlow = document.getElementById('btn-audio-quiz-slow');

    // Answers & Powerups
    this.answersContainer = document.getElementById('answers-container');
    this.btnFiftyFifty = document.getElementById('btn-fifty');
    this.btnFreeze = document.getElementById('btn-freeze');
    this.btnHint = document.getElementById('btn-hint');

    // Feedback Drawer
    this.feedbackDrawer = document.getElementById('feedback-drawer');
    this.feedbackTitle = document.getElementById('feedback-title');
    this.feedbackVietnamese = document.getElementById('feedback-vietnamese');
    this.feedbackExplanation = document.getElementById('feedback-explanation');
    this.feedbackConfusableBox = document.getElementById('feedback-confusable-box');
    this.btnAutoNextToggle = document.getElementById('btn-auto-next-toggle');
    this.examTaskLabel = document.getElementById('exam-task-label');
    this.examSentenceQuote = document.getElementById('exam-sentence-quote');
    this.commonMistakeText = document.getElementById('common-mistake-text');
    this.btnNext = document.getElementById('btn-next');

    // Victory Modal
    this.modalOverlay = document.getElementById('modal-overlay');
    this.finalScoreEl = document.getElementById('final-score');
    this.maxStreakEl = document.getElementById('max-streak');
    this.avgTimeEl = document.getElementById('avg-time');
    this.accuracyEl = document.getElementById('accuracy-rate');
    this.bandGradeEl = document.getElementById('band-grade');
    this.wordleGridEl = document.getElementById('wordle-grid');
    this.btnShare = document.getElementById('btn-share');
    this.btnReplay = document.getElementById('btn-replay');
    this.btnVaultOpen = document.getElementById('btn-vault-open');
    this.btnVictoryMastery = document.getElementById('btn-victory-mastery');

    // Exam Vault Modal
    this.vaultOverlay = document.getElementById('vault-overlay');
    this.vaultList = document.getElementById('vault-list');
    this.btnVaultClose = document.getElementById('btn-vault-close');

    // Grade & Band Filter
    this.btnGradeFilter = document.getElementById('btn-grade-filter');
    this.currentFilterPillLabel = document.getElementById('current-filter-pill-label');
    this.gradeModalOverlay = document.getElementById('grade-modal-overlay');
    this.btnGradeModalClose = document.getElementById('btn-grade-modal-close');

    // Mastery Analytics & JSON Backup Modal
    this.btnAudioQuizMode = document.getElementById('btn-audio-quiz-mode');
    this.btnMasteryStats = document.getElementById('btn-mastery-stats');
    this.masteryModalOverlay = document.getElementById('mastery-modal-overlay');
    this.btnMasteryModalClose = document.getElementById('btn-mastery-modal-close');
    this.statTotalLearned = document.getElementById('stat-total-learned');
    this.statAvgRetention = document.getElementById('stat-avg-retention');
    this.statMasteredCount = document.getElementById('stat-mastered-count');
    this.statWeakCount = document.getElementById('stat-weak-count');
    this.masteryBarsBox = document.getElementById('mastery-bars-box');
    this.masterySearchInput = document.getElementById('mastery-search-input');
    this.masteryFilterTabs = document.getElementById('mastery-filter-tabs');
    this.masteryWordList = document.getElementById('mastery-word-list');
    this.btnPracticeWeakNow = document.getElementById('btn-practice-weak-now');
    this.btnExportJson = document.getElementById('btn-export-json');
    this.btnImportJson = document.getElementById('btn-import-json');
    this.inputImportJson = document.getElementById('input-import-json');
    this.modalDailyStreakEl = document.getElementById('modal-daily-streak');
    this.modalDailyProgressLbl = document.getElementById('modal-daily-progress-lbl');
    this.modalDailyBarFill = document.getElementById('modal-daily-bar-fill');
    this.dailyGoalSelector = document.getElementById('daily-goal-selector');
    this.currentMasteryTab = 'all';

    // AI Exam Importer Modal & Haptic Switch
    this.btnExamImport = document.getElementById('btn-exam-import');
    this.examImportModalOverlay = document.getElementById('exam-import-modal-overlay');
    this.btnExamImportClose = document.getElementById('btn-exam-import-close');
    this.examDropzone = document.getElementById('exam-dropzone');
    this.inputExamFile = document.getElementById('input-exam-file');
    this.examSelectedFilePill = document.getElementById('exam-selected-file-pill');
    this.examSelectedFileName = document.getElementById('exam-selected-file-name');
    this.btnClearExamFile = document.getElementById('btn-clear-exam-file');
    this.btnFillSampleExam = document.getElementById('btn-fill-sample-exam');
    this.examRawTextInput = document.getElementById('exam-raw-text-input');
    this.examModeSelector = document.getElementById('exam-mode-selector');
    this.examCountSelector = document.getElementById('exam-count-selector');
    this.btnRunExamConvert = document.getElementById('btn-run-exam-convert');
    this.examImportStatus = document.getElementById('exam-import-status');
    this.examPreviewCountLabel = document.getElementById('exam-preview-count-label');
    this.btnClearCustomBank = document.getElementById('btn-clear-custom-bank');
    this.examPreviewList = document.getElementById('exam-preview-list');
    this.btnStartCustomExam = document.getElementById('btn-start-custom-exam');
    this.customExamCountBadge = document.getElementById('custom-exam-count-badge');
    this.iosHapticTrigger = document.getElementById('ios-haptic-trigger');

    // Header actions
    this.btnThemeToggle = document.getElementById('btn-theme-toggle');
    this.themeIconSvg = document.getElementById('theme-icon-svg');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIconSvg = document.getElementById('sound-icon-svg');
    this.btnViewToggle = document.getElementById('btn-view-toggle');
  }

  bindEvents() {
    this.btnThemeToggle.addEventListener('click', () => this.toggleTheme());
    this.btnSoundToggle.addEventListener('click', () => this.toggleSound());
    if (this.btnViewToggle) {
      this.btnViewToggle.addEventListener('click', () => this.toggleViewMode());
    }
    if (this.btnAudioQuizMode) {
      this.btnAudioQuizMode.addEventListener('click', () => this.toggleAudioQuizMode());
    }
    if (this.btnMasteryStats) {
      this.btnMasteryStats.addEventListener('click', () => this.openMasteryModal());
    }
    if (this.dailyGoalPill) {
      this.dailyGoalPill.addEventListener('click', () => this.openMasteryModal());
    }
    if (this.btnVictoryMastery) {
      this.btnVictoryMastery.addEventListener('click', () => this.openMasteryModal());
    }
    if (this.btnMasteryModalClose) {
      this.btnMasteryModalClose.addEventListener('click', () => this.closeMasteryModal());
    }
    if (this.masteryModalOverlay) {
      this.masteryModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.masteryModalOverlay) this.closeMasteryModal();
      });
    }
    if (this.btnAutoNextToggle) {
      this.btnAutoNextToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleAutoNext();
      });
    }
    if (this.dailyGoalSelector && this.dailyGoalSelector.querySelectorAll) {
      const goalBtns = this.dailyGoalSelector.querySelectorAll('.dt-goal-btn');
      goalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const g = (btn && typeof btn.getAttribute === 'function') ? (Number(btn.getAttribute('data-goal')) || 30) : 30;
          this.setDailyGoal(g);
        });
      });
    }
    if (this.masterySearchInput) {
      this.masterySearchInput.addEventListener('input', (e) => {
        this.masterySearchQuery = String(e.target.value || '').trim().toLowerCase();
        this.renderMasteryWordList(this.currentMasteryTab);
      });
    }
    if (this.btnPracticeWeakNow) {
      this.btnPracticeWeakNow.addEventListener('click', () => {
        this.closeMasteryModal();
        this.setGradeFilter('weak');
      });
    }
    if (this.btnExportJson) {
      this.btnExportJson.addEventListener('click', () => this.exportBackupJSON());
    }
    if (this.btnImportJson && this.inputImportJson) {
      this.btnImportJson.addEventListener('click', () => this.inputImportJson.click());
      this.inputImportJson.addEventListener('change', (e) => {
        const file = e.target && e.target.files ? e.target.files[0] : null;
        if (file) {
          this.importBackupJSON(file);
          e.target.value = '';
        }
      });
    }
    if (this.masteryFilterTabs && this.masteryFilterTabs.querySelectorAll) {
      const mTabs = this.masteryFilterTabs.querySelectorAll('.m-tab-btn');
      mTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const level = (tab && typeof tab.getAttribute === 'function') ? (tab.getAttribute('data-mlevel') || 'all') : 'all';
          this.setMasteryFilterTab(level);
        });
      });
    }
    if (document.querySelectorAll) {
      const kpiCards = document.querySelectorAll('.mastery-kpi-card[data-kpi-filter]');
      kpiCards.forEach(card => {
        card.addEventListener('click', () => {
          const targetLv = (card && typeof card.getAttribute === 'function') ? (card.getAttribute('data-kpi-filter') || 'all') : 'all';
          this.setMasteryFilterTab(targetLv);
        });
      });
    }

    if (this.btnAudioQuizPlay) {
      this.btnAudioQuizPlay.addEventListener('click', () => {
        const q = this.questions[this.currentIndex];
        if (!q) return;
        const word = q.audioTargetWord || q.target_word || q.options[q.correct];
        this.triggerAudioWaveAnimation(950);
        if (typeof speechEngine !== 'undefined') speechEngine.speakWord(word, 0.92);
      });
    }
    if (this.btnAudioQuizSlow) {
      this.btnAudioQuizSlow.addEventListener('click', () => {
        const q = this.questions[this.currentIndex];
        if (!q) return;
        const word = q.audioTargetWord || q.target_word || q.options[q.correct];
        this.triggerAudioWaveAnimation(1350);
        if (typeof speechEngine !== 'undefined') speechEngine.speakSlow(word);
      });
    }

    this.btnFiftyFifty.addEventListener('click', () => this.useFiftyFifty());
    this.btnFreeze.addEventListener('click', () => this.useFreeze());
    this.btnHint.addEventListener('click', () => this.useHint());
    this.attachTactileHaptics(this.btnFiftyFifty, 'medium');
    this.attachTactileHaptics(this.btnFreeze, 'medium');
    this.attachTactileHaptics(this.btnHint, 'medium');

    this.btnNext.addEventListener('click', () => {
      this.triggerHaptic('light');
      this.nextQuestion();
    });
    this.btnReplay.addEventListener('click', () => {
      this.triggerHaptic('medium');
      this.startNewRound();
    });
    this.btnShare.addEventListener('click', () => this.copyShareCard());

    if (this.btnVaultOpen) {
      this.btnVaultOpen.addEventListener('click', () => this.openVault());
    }
    if (this.btnVaultClose) {
      this.btnVaultClose.addEventListener('click', () => this.closeVault());
    }

    if (this.btnGradeFilter) {
      this.btnGradeFilter.addEventListener('click', () => this.openGradeModal());
    }
    if (this.btnGradeModalClose) {
      this.btnGradeModalClose.addEventListener('click', () => this.closeGradeModal());
    }
    if (this.gradeModalOverlay) {
      this.gradeModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.gradeModalOverlay) this.closeGradeModal();
      });
    }

    if (document.querySelectorAll) {
      const optionBtns = document.querySelectorAll('.grade-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filterKey = (btn && typeof btn.getAttribute === 'function') ? btn.getAttribute('data-filter') : 'all';
          if (filterKey === 'custom_exam' && (!this.customExamBank || this.customExamBank.length === 0)) {
            this.closeGradeModal();
            this.openExamImportModal();
            return;
          }
          this.setGradeFilter(filterKey);
        });
      });
    }

    this.bindExamImporterEvents();
    this.bindKeyboardAndSwipeEvents();

    // Mở khóa Web Audio Context khi user chạm lần đầu
    const unlockAudio = () => {
      soundEngine.init();
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
  }

  setMasteryFilterTab(level) {
    this.currentMasteryTab = String(level || 'all');
    if (this.masteryFilterTabs && this.masteryFilterTabs.querySelectorAll) {
      const mTabs = this.masteryFilterTabs.querySelectorAll('.m-tab-btn');
      mTabs.forEach(t => {
        if (t && t.classList && typeof t.getAttribute === 'function') {
          t.classList.toggle('active', t.getAttribute('data-mlevel') === this.currentMasteryTab);
        }
      });
    }
    this.renderMasteryWordList(this.currentMasteryTab);
  }

  bindKeyboardAndSwipeEvents() {
    // 1. Cử chỉ vuốt trên ngăn kéo giải thích (Swipe Down hoặc Swipe Left để qua câu)
    if (this.feedbackDrawer && this.feedbackDrawer.addEventListener) {
      let touchStartX = 0;
      let touchStartY = 0;
      this.feedbackDrawer.addEventListener('touchstart', (e) => {
        if (!e.touches || !e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      this.feedbackDrawer.addEventListener('touchend', (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (this.feedbackDrawer.classList && this.feedbackDrawer.classList.contains('active')) {
          if (dy > 42 || dx < -55) {
            this.nextQuestion();
          }
        }
      }, { passive: true });
    }

    // 2. Phím tắt bàn phím cho PC / iPad Magic Keyboard
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (this.modalOverlay && this.modalOverlay.classList && this.modalOverlay.classList.contains('active')) return;
        if (this.masteryModalOverlay && this.masteryModalOverlay.classList && this.masteryModalOverlay.classList.contains('active')) return;
        if (this.gradeModalOverlay && this.gradeModalOverlay.classList && this.gradeModalOverlay.classList.contains('active')) return;

        // Khi ngăn kéo giải thích đang mở: Enter / Space / ArrowRight để qua câu tiếp theo
        if (this.feedbackDrawer && this.feedbackDrawer.classList && this.feedbackDrawer.classList.contains('active')) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextQuestion();
            return;
          }
        }

        const q = this.questions[this.currentIndex];
        if (!q) return;

        // Phím 0 để nghe lại phát âm
        if (e.key === '0') {
          const word = q.audioTargetWord || q.target_word || (q.options && q.options[q.correct]);
          if (word && typeof speechEngine !== 'undefined') speechEngine.speakWord(word, 0.92);
          return;
        }

        if (this.isAnsweringLocked) return;

        if (q.mode === 'letter_fill' && !q.isAudioQuiz) {
          if (e.key === 'Backspace') {
            const undoBtn = document.getElementById('btn-letter-undo');
            if (undoBtn && undoBtn.click) undoBtn.click();
            return;
          }
          if (e.key === 'Escape') {
            const clearBtn = document.getElementById('btn-letter-clear');
            if (clearBtn && clearBtn.click) clearBtn.click();
            return;
          }
          const upper = String(e.key || '').toUpperCase();
          if (/^[A-Z]$/.test(upper) && this.answersContainer && this.answersContainer.querySelectorAll) {
            const tiles = Array.from(this.answersContainer.querySelectorAll('.letter-tile-btn'));
            const matchTile = tiles.find(t => !t.disabled && (!t.classList || !t.classList.contains('used')) && t.textContent.trim().toUpperCase() === upper);
            if (matchTile && matchTile.click) matchTile.click();
          }
          return;
        }

        // Các chế độ 4 đáp án A/B/C/D (Phím 1-4 hoặc A-D)
        const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        const upperKey = String(e.key || '').toUpperCase();
        if (Object.prototype.hasOwnProperty.call(keyMap, upperKey) && this.answersContainer && this.answersContainer.querySelectorAll) {
          const idx = keyMap[upperKey];
          const allBtns = this.answersContainer.querySelectorAll('.btn-tactile');
          if (allBtns && allBtns[idx] && (!allBtns[idx].classList || !allBtns[idx].classList.contains('eliminated'))) {
            this.handleAnswerSelect(idx, allBtns[idx]);
          }
        }
      });
    }
  }

  applyPersistedSettings() {
    const isLight = localStorage.getItem('ielts_theme') === 'light';
    const metaThemeColor = document.getElementById('meta-theme-color');
    const metaStatusBar = document.getElementById('meta-status-bar-style');
    if (isLight) {
      if (document.documentElement && document.documentElement.classList) {
        document.documentElement.classList.add('light-theme');
      }
      if (document.body && document.body.classList) {
        document.body.classList.add('light-theme');
      }
      this.updateThemeIcon(true);
      if (metaThemeColor && typeof metaThemeColor.setAttribute === 'function') {
        metaThemeColor.setAttribute('content', '#ffffff');
      }
      if (metaStatusBar && typeof metaStatusBar.setAttribute === 'function') {
        metaStatusBar.setAttribute('content', 'default');
      }
    } else {
      if (document.documentElement && document.documentElement.classList) {
        document.documentElement.classList.remove('light-theme');
      }
      if (document.body && document.body.classList) {
        document.body.classList.remove('light-theme');
      }
      this.updateThemeIcon(false);
      if (metaThemeColor && typeof metaThemeColor.setAttribute === 'function') {
        metaThemeColor.setAttribute('content', '#000000');
      }
      if (metaStatusBar && typeof metaStatusBar.setAttribute === 'function') {
        metaStatusBar.setAttribute('content', 'black-translucent');
      }
    }

    this.updateSoundIcon(soundEngine.isMuted);
  }

  updateThemeIcon(isLight) {
    if (!this.themeIconSvg) return;
    if (isLight) {
      // Icon Mặt Trời
      this.themeIconSvg.innerHTML = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
    } else {
      // Icon Mặt Trăng
      this.themeIconSvg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
    }
  }

  updateSoundIcon(isMuted) {
    if (!this.soundIconSvg) return;
    if (isMuted) {
      this.soundIconSvg.innerHTML = `<line x1="1" y1="1" x2="23" y2="23"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M23 9l-6 6M17 9l6 6"/>`;
    } else {
      this.soundIconSvg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    }
  }

  toggleTheme() {
    const isNowLight = document.body ? document.body.classList.toggle('light-theme') : false;
    if (document.documentElement && document.documentElement.classList) {
      document.documentElement.classList.toggle('light-theme', isNowLight);
    }
    localStorage.setItem('ielts_theme', isNowLight ? 'light' : 'dark');
    this.updateThemeIcon(isNowLight);
    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor && typeof metaThemeColor.setAttribute === 'function') {
      metaThemeColor.setAttribute('content', isNowLight ? '#ffffff' : '#000000');
    }
    const metaStatusBar = document.getElementById('meta-status-bar-style');
    if (metaStatusBar && typeof metaStatusBar.setAttribute === 'function') {
      metaStatusBar.setAttribute('content', isNowLight ? 'default' : 'black-translucent');
    }
  }

  toggleSound() {
    const muted = soundEngine.toggleMute();
    this.updateSoundIcon(muted);
  }

  toggleViewMode() {
    const isFullscreen = document.body.classList.toggle('fullscreen-mode');
    const spanText = this.btnViewToggle.querySelector('span');
    if (spanText) {
      spanText.textContent = isFullscreen ? 'Khung iPhone' : 'Tràn màn hình';
    }
  }

  getFilteredBank() {
    if (!this.currentGradeFilter || this.currentGradeFilter === 'all' || this.currentGradeFilter === 'audio') {
      return [...IELTS_VOCAB_BANK];
    }
    if (this.currentGradeFilter === 'custom_exam') {
      if (this.customExamBank && this.customExamBank.length > 0) {
        return [...this.customExamBank];
      }
      return [...IELTS_VOCAB_BANK];
    }
    if (this.currentGradeFilter === 'weak') {
      const weakSet = new Set(this.weakWordIds || []);
      const weakMatches = IELTS_VOCAB_BANK.filter(q => {
        if (weakSet.has(q.id)) return true;
        const prof = this.getWordProfile(q);
        return prof.failCount > 0 || (prof.testedCount > 0 && prof.masteryLevel <= 2);
      });
      return weakMatches.length >= 10 ? weakMatches : [...IELTS_VOCAB_BANK];
    }
    if (this.currentGradeFilter === 'part5_speed') {
      const part5Modes = ['word_class', 'preposition', 'collocation', 'sentence_cloze'];
      const matches = IELTS_VOCAB_BANK.filter(q =>
        (q.category === 'toeic' || q.topic_category === 'toeic' || (q.id && q.id.startsWith('toeic_'))) &&
        part5Modes.includes(q.mode)
      );
      return matches.length >= 10 ? matches : [...IELTS_VOCAB_BANK];
    }
    if (this.currentGradeFilter === 'toeic') {
      return IELTS_VOCAB_BANK.filter(q => q.category === 'toeic' || q.topic_category === 'toeic' || (q.id && q.id.startsWith('toeic_')));
    }
    if (['toeic400', 'toeic500', 'toeic600', 'toeic700'].includes(this.currentGradeFilter)) {
      return IELTS_VOCAB_BANK.filter(q => q.toeic_tier === this.currentGradeFilter);
    }
    if (this.currentGradeFilter === 'ielts') {
      return IELTS_VOCAB_BANK.filter(q => q.category !== 'toeic' && q.topic_category !== 'toeic' && (!q.id || !q.id.startsWith('toeic_')));
    }
    if (this.currentGradeFilter === 'band7') {
      return IELTS_VOCAB_BANK.filter(q => parseFloat(q.band) >= 7.0);
    }
    if (this.currentGradeFilter.startsWith('g')) {
      const gNum = parseInt(this.currentGradeFilter.replace('g', ''), 10);
      return IELTS_VOCAB_BANK.filter(q => q.grade === gNum);
    }
    return [...IELTS_VOCAB_BANK];
  }

  buildAudioQuizVariant(baseQ, pool, idx) {
    const targetWord = (baseQ.target_word || baseQ.options[baseQ.correct] || '').trim();
    const askMeaning = idx % 2 === 0; // Xen kẽ: Nghe chọn nghĩa tiếng Việt & Nghe chọn mặt chữ tiếng Anh

    if (askMeaning) {
      const otherMeanings = pool
        .filter(x => x.vietnamese && x.vietnamese !== baseQ.vietnamese)
        .map(x => x.vietnamese);
      const uniqueMeanings = [...new Set(otherMeanings)];
      const distractors = shuffleArray(uniqueMeanings).slice(0, 3);
      while (distractors.length < 3) {
        distractors.push('cải thiện hiệu suất công việc');
      }
      const options = shuffleArray([baseQ.vietnamese, ...distractors]);
      return {
        ...baseQ,
        isAudioQuiz: true,
        audioTargetWord: targetWord,
        mode: 'meaning_match',
        prompt: '🎧 Nghe phát âm và chọn nghĩa tiếng Việt chính xác:',
        audioSubPrompt: 'Chạm "Nghe chuẩn" hoặc "Chậm 0.7x" để nghe lại từ vựng',
        options,
        correct: options.indexOf(baseQ.vietnamese)
      };
    } else {
      const otherWords = pool
        .filter(x => x.target_word && x.target_word.toLowerCase() !== targetWord.toLowerCase())
        .map(x => x.target_word);
      const uniqueWords = [...new Set(otherWords)];
      const distractors = shuffleArray(uniqueWords).slice(0, 3);
      while (distractors.length < 3) {
        distractors.push('sustainable');
      }
      const options = shuffleArray([targetWord, ...distractors]);
      return {
        ...baseQ,
        isAudioQuiz: true,
        audioTargetWord: targetWord,
        mode: 'meaning_match',
        prompt: '🎧 Nghe phát âm và chọn đúng từ vựng tiếng Anh:',
        audioSubPrompt: `Gợi ý chủ đề: ${baseQ.topic}`,
        options,
        correct: options.indexOf(targetWord)
      };
    }
  }

  generateAdaptiveQueue(pool) {
    if (!pool || pool.length === 0) return [];

    // Lọc ra các câu hỏi CHƯA TỪNG XUẤT HIỆN trong các vòng chơi gần đây
    let availableQuestions = pool.filter(q => !this.usedQuestionIds.has(q.id));

    // Nếu kho câu hỏi chưa dùng còn dưới 10 câu, làm mới lại kho
    if (availableQuestions.length < this.totalQuestionsPerRound) {
      this.usedQuestionIds.clear();
      availableQuestions = [...pool];
    }

    const workingPool = availableQuestions.length >= this.totalQuestionsPerRound 
      ? availableQuestions 
      : [...pool];

    // Phân loại câu hỏi theo 3 tầng nhận thức tự nhiên (Cognitive Progression Tiers):
    // Tầng 1 (Khởi động - Nhận diện & Mặt chữ): meaning_match, letter_fill
    // Tầng 2 (Tăng tốc - Ngữ pháp & Cụm từ): word_class, collocation
    // Tầng 3 (Về đích - Ngữ cảnh thực chiến & Giới từ): preposition, sentence_cloze
    const tier1Modes = ['meaning_match', 'letter_fill'];
    const tier2Modes = ['word_class', 'collocation'];
    const tier3Modes = ['preposition', 'sentence_cloze'];

    const t1Pool = workingPool.filter(q => tier1Modes.includes(q.mode));
    const t2Pool = workingPool.filter(q => tier2Modes.includes(q.mode));
    const t3Pool = workingPool.filter(q => tier3Modes.includes(q.mode));

    // Sắp xếp theo trọng số ưu tiên Adaptive (kết hợp jitter ngẫu nhiên 0 - 0.2 để tăng tính biến hóa)
    const sortByPriority = (arr) => {
      return [...arr].sort((a, b) => {
        const scoreA = this.calculatePriorityScore(a) + (Math.random() * 0.2);
        const scoreB = this.calculatePriorityScore(b) + (Math.random() * 0.2);
        return scoreB - scoreA;
      });
    };

    const sortedT1 = sortByPriority(t1Pool);
    const sortedT2 = sortByPriority(t2Pool);
    const sortedT3 = sortByPriority(t3Pool);

    const selected = [];
    const usedWordsInRound = new Set();

    const pickFromList = (sourceList, count) => {
      const picked = [];
      for (const q of sourceList) {
        if (picked.length >= count) break;
        const word = (q.target_word || q.id).toUpperCase();
        if (!usedWordsInRound.has(word) && !selected.some(item => item.id === q.id)) {
          picked.push(q);
          usedWordsInRound.add(word);
        }
      }
      if (picked.length < count) {
        for (const q of sourceList) {
          if (picked.length >= count) break;
          if (!selected.some(item => item.id === q.id) && !picked.some(item => item.id === q.id)) {
            picked.push(q);
          }
        }
      }
      return picked;
    };

    // Chọn: 3 câu Tầng 1, 4 câu Tầng 2, 3 câu Tầng 3
    selected.push(...pickFromList(sortedT1, 3));
    selected.push(...pickFromList(sortedT2, 4));
    selected.push(...pickFromList(sortedT3, 3));

    // Bù đắp nếu một tầng nào đó bị thiếu (ví dụ bộ lọc quá nhỏ)
    if (selected.length < this.totalQuestionsPerRound && selected.length < workingPool.length) {
      const remaining = sortByPriority(workingPool.filter(q => !selected.some(s => s.id === q.id)));
      for (const q of remaining) {
        if (selected.length >= this.totalQuestionsPerRound) break;
        selected.push(q);
      }
    }

    // Ghi nhận ID đã chọn vào usedQuestionIds để chống lặp tuyệt đối
    selected.forEach(q => this.usedQuestionIds.add(q.id));
    this.saveUsedQuestionIds();

    // Nếu người học đang chọn Chế độ Nghe Phát Âm (Audio Quiz), chuyển đổi thành thử thách Nghe
    if (this.currentGradeFilter === 'audio') {
      return selected.map((q, idx) => this.buildAudioQuizVariant(q, pool, idx));
    }

    return selected;
  }

  renderSegmentedRoundBar() {
    if (!this.segmentedRoundBar) return;
    const total = this.questions.length || this.totalQuestionsPerRound;
    let html = '';
    for (let i = 0; i < total; i++) {
      let stateClass = 'seg-upcoming';
      if (i < this.roundResults.length) {
        stateClass = this.roundResults[i] ? 'seg-correct' : 'seg-wrong';
      } else if (i === this.currentIndex) {
        stateClass = 'seg-current';
      }
      html += `<span class="seg-dot ${stateClass}"></span>`;
    }
    this.segmentedRoundBar.innerHTML = html;
  }

  // Khởi tạo vòng chơi 10 câu độc nhất 100%, tự động hóa thông minh theo Adaptive Learning
  startNewRound() {
    clearTimeout(this.autoAdvanceTimer);
    this.modalOverlay.classList.remove('active');
    this.feedbackDrawer.classList.remove('active');
    if (this.vaultOverlay) this.vaultOverlay.classList.remove('active');
    if (this.gradeModalOverlay) this.gradeModalOverlay.classList.remove('active');
    if (this.masteryModalOverlay) this.masteryModalOverlay.classList.remove('active');
    if (this.examImportModalOverlay) this.examImportModalOverlay.classList.remove('active');

    this.activeRoundTimeLimit = this.currentGradeFilter === 'part5_speed' ? 12.0 : this.maxTimeSeconds;

    const pool = this.getFilteredBank();
    this.questions = this.generateAdaptiveQueue(pool);

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.hearts = 3;
    this.consecutiveForHeartRecovery = 0;
    this.roundResults = [];
    this.responseTimes = [];
    this.sessionVocabs = [];

    this.powerups = { fiftyFifty: true, freeze: true, hint: true };
    this.updatePowerupButtons();
    this.updateHeartsUI();
    this.updateScoreUI();
    this.updateStreakUI();

    this.loadQuestion(this.currentIndex);
  }

  loadQuestion(index) {
    clearTimeout(this.autoAdvanceTimer);
    if (index >= this.questions.length || this.hearts <= 0) {
      this.finishRound();
      return;
    }

    this.isAnsweringLocked = false;
    this.isFrozen = false;
    this.feedbackDrawer.classList.remove('active');
    this.renderSegmentedRoundBar();

    // Hiệu ứng mượt mà khi đổi thẻ câu hỏi
    if (this.questionCard) {
      this.questionCard.style.animation = 'none';
      void this.questionCard.offsetHeight; // Trigger reflow
      this.questionCard.style.animation = 'cardEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    const q = this.questions[index];
    if (!this.sessionVocabs.some(item => item.id === q.id)) {
      this.sessionVocabs.push(q);
    }

    this.progressText.textContent = `Câu ${index + 1}/${this.questions.length}`;

    if (this.gradeBadge) {
      this.gradeBadge.textContent = q.grade_label || (q.grade ? `Lớp ${q.grade}` : 'TOEIC');
      if (q.category === 'toeic' || q.topic_category === 'toeic' || (q.id && q.id.startsWith('toeic_'))) {
        this.gradeBadge.style.background = 'rgba(245, 158, 11, 0.25)';
        this.gradeBadge.style.color = '#fbbf24';
        this.gradeBadge.style.borderColor = 'rgba(251, 191, 36, 0.4)';
      } else if (q.grade >= 10) {
        this.gradeBadge.style.background = 'rgba(168, 85, 247, 0.25)';
        this.gradeBadge.style.color = '#c084fc';
        this.gradeBadge.style.borderColor = 'rgba(192, 132, 252, 0.4)';
      } else {
        this.gradeBadge.style.background = 'rgba(56, 189, 248, 0.25)';
        this.gradeBadge.style.color = '#38bdf8';
        this.gradeBadge.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      }
    }

    if (this.masteryBadge) {
      const prof = this.getWordProfile(q);
      const masteryConfig = {
        1: { text: 'Lv.1 🌱', bg: 'rgba(16, 185, 129, 0.18)', color: '#34d399' },
        2: { text: 'Lv.2 🌿', bg: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' },
        3: { text: 'Lv.3 🌸', bg: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' },
        4: { text: 'Lv.4 ⭐', bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' },
        5: { text: 'Lv.5 💎', bg: 'rgba(168, 85, 247, 0.25)', color: '#c084fc' }
      };
      const mInfo = masteryConfig[prof.masteryLevel] || masteryConfig[1];
      this.masteryBadge.textContent = mInfo.text;
      this.masteryBadge.style.background = mInfo.bg;
      this.masteryBadge.style.color = mInfo.color;
    }

    this.bandBadge.textContent = `BAND ${q.band}`;
    this.topicBadge.textContent = `🏷️ ${q.topic}`;

    const modeLabels = {
      letter_fill: '🔤 Điền chữ cái',
      meaning_match: '🇻🇳 ➔ 🇬🇧 Chọn từ đúng',
      collocation: '🧩 Ghép Collocation',
      word_class: '🏷️ Phân biệt từ loại',
      preposition: '🎯 Chọn giới từ',
      sentence_cloze: '✍️ Điền vào câu'
    };
    
    if (q.isAudioQuiz) {
      this.modeBadge.innerHTML = `🎧 Luyện Nghe AI`;
      this.modeBadge.style.background = `rgba(56, 189, 248, 0.22)`;
      this.modeBadge.style.color = `#38bdf8`;
    } else if (q.isRecallVariant) {
      this.modeBadge.innerHTML = `🔁 Active Recall`;
      this.modeBadge.style.background = `rgba(236, 72, 153, 0.25)`;
      this.modeBadge.style.color = `#f472b6`;
    } else {
      this.modeBadge.textContent = modeLabels[q.mode] || 'IELTS Quiz';
      this.modeBadge.style.background = `var(--bg-pill-glass)`;
      this.modeBadge.style.color = `var(--text-secondary)`;
    }

    // Hiển thị hình ảnh minh họa chì (Pencil Art từ repo Danh_English_Tutor)
    let hasVisibleVocabImage = false;
    if (this.vocabImageContainer && this.vocabImg) {
      const targetKey = (q.target_word || '').trim().toLowerCase();
      const imgUrl = (!q.isAudioQuiz && typeof VOCAB_IMAGES !== 'undefined') ? VOCAB_IMAGES[targetKey] : null;
      if (imgUrl) {
        this.vocabImg.src = imgUrl;
        this.vocabImg.alt = q.target_word || 'Minh họa từ vựng';
        this.vocabImageContainer.style.display = 'flex';
        hasVisibleVocabImage = true;
      } else {
        this.vocabImageContainer.style.display = 'none';
        this.vocabImg.src = '';
      }
    }

    if (this.audioQuizPanel) {
      this.audioQuizPanel.style.display = q.isAudioQuiz ? 'flex' : 'none';
    }

    this.applySmartTextScale(q, hasVisibleVocabImage);

    if (q.isAudioQuiz) {
      this.promptText.textContent = q.prompt || '🎧 Nghe phát âm và chọn đáp án đúng:';
      this.letterBoxContainer.style.display = 'none';
      this.questionMainText.innerHTML = `<span class="audio-subprompt-text">${q.audioSubPrompt || 'Chạm nút loa bên trên để nghe lại phát âm'}</span>`;
      this.renderAnswerButtons(q);

      const wordToPlay = q.audioTargetWord || q.target_word || q.options[q.correct];
      setTimeout(() => {
        this.triggerAudioWaveAnimation(950);
        if (typeof speechEngine !== 'undefined') {
          speechEngine.speakWord(wordToPlay, 0.92);
        }
      }, 150);
    } else if (q.mode === 'letter_fill') {
      this.promptText.textContent = 'Chạm các chữ cái bên dưới để hoàn thành từ:';
      this.letterBoxContainer.style.display = 'flex';
      this.questionMainText.innerHTML = `<span class="meaning-highlight">“${q.vietnamese}”</span>`;
      this.renderInteractiveLetterFill(q);
    } else if (q.mode === 'meaning_match') {
      this.promptText.textContent = 'Chọn từ tiếng Anh chính xác mang nghĩa:';
      this.letterBoxContainer.style.display = 'none';
      this.questionMainText.innerHTML = `<span class="meaning-highlight">“${q.vietnamese}”</span>`;
      this.renderAnswerButtons(q);
    } else if (q.sentence) {
      this.promptText.textContent = q.prompt || 'Chọn đáp án học thuật chính xác:';
      this.letterBoxContainer.style.display = 'none';
      const highlightedSentence = q.sentence.replace(/_{2,}/g, '<span class="blank-slot">____</span>');
      this.questionMainText.innerHTML = highlightedSentence;
      this.renderAnswerButtons(q);
    } else {
      this.promptText.textContent = 'Chọn đáp án chính xác:';
      this.letterBoxContainer.style.display = 'none';
      this.questionMainText.innerHTML = q.prompt;
      this.renderAnswerButtons(q);
    }

    // Không hiển thị phiên âm IPA trong lúc làm câu hỏi để tránh làm lộ đáp án (chỉ hiển thị sau khi trả lời ở popup Feedback)
    if (this.phoneticGuide) {
      this.phoneticGuide.textContent = '';
      this.phoneticGuide.style.display = 'none';
    }
    if (this.academicHintPill) {
      if (q.isAudioQuiz) {
        this.academicHintPill.innerHTML = `🎧 Luyện phản xạ Nghe phát âm chuẩn`;
      } else if (q.mode === 'letter_fill') {
        const missLen = Array.isArray(q.missing) ? q.missing.length : (q.missing ? q.missing.length : 1);
        this.academicHintPill.innerHTML = `💡 Thiếu ${missLen} chữ cái`;
      } else if (q.mode === 'collocation') {
        this.academicHintPill.innerHTML = `💡 Academic Collocation Band 7+`;
      } else if (q.mode === 'word_class') {
        this.academicHintPill.innerHTML = `💡 Ngữ pháp & Dạng từ`;
      } else if (q.mode === 'preposition') {
        this.academicHintPill.innerHTML = `💡 Giới từ phụ thuộc`;
      } else if (q.mode === 'sentence_cloze') {
        this.academicHintPill.innerHTML = `💡 Điền câu ngữ cảnh`;
      } else {
        this.academicHintPill.innerHTML = `💡 Chọn từ đồng nghĩa`;
      }
    }

    this.startTimer();
  }

  applySmartTextScale(q, hasImage = false) {
    if (!this.questionMainText || !this.questionMainText.classList) return;
    this.questionMainText.classList.remove('text-scale-xl', 'text-scale-md', 'text-scale-sm', 'text-scale-xs');

    if (q.isAudioQuiz) {
      this.questionMainText.classList.add('text-scale-sm');
      return;
    }

    const rawText = (q.mode === 'letter_fill' || q.mode === 'meaning_match')
      ? String(q.vietnamese || '')
      : String(q.sentence || q.prompt || '');
    const len = rawText.length;

    if (len > 115 || (hasImage && len > 75)) {
      this.questionMainText.classList.add('text-scale-xs');
    } else if (len > 80 || hasImage || q.mode === 'letter_fill') {
      this.questionMainText.classList.add('text-scale-sm');
    } else if (len > 36) {
      this.questionMainText.classList.add('text-scale-md');
    } else {
      this.questionMainText.classList.add('text-scale-xl');
    }
  }

  applyMaskedWordScale(charCount) {
    if (!this.letterBoxContainer || !this.letterBoxContainer.classList) return;
    this.letterBoxContainer.classList.remove('word-len-short', 'word-len-medium', 'word-len-long', 'word-len-xlong');
    if (charCount >= 13) {
      this.letterBoxContainer.classList.add('word-len-xlong');
    } else if (charCount >= 11) {
      this.letterBoxContainer.classList.add('word-len-long');
    } else if (charCount >= 9) {
      this.letterBoxContainer.classList.add('word-len-medium');
    } else {
      this.letterBoxContainer.classList.add('word-len-short');
    }
  }

  findTileButton(tileId) {
    if (!tileId || !this.answersContainer) return null;
    if (this.answersContainer.querySelector) {
      try {
        const el = this.answersContainer.querySelector(`[data-tile-id="${tileId}"]`);
        if (el) return el;
      } catch (e) {}
    }
    if (this.answersContainer.querySelectorAll) {
      const all = Array.from(this.answersContainer.querySelectorAll('.letter-tile-btn'));
      return all.find(b => (b.dataset && b.dataset.tileId === tileId) || b.id === tileId) || null;
    }
    return null;
  }

  renderInteractiveLetterFill(q) {
    this.answersContainer.innerHTML = '';
    this.letterBoxContainer.innerHTML = '';

    const chars = q.masked.split(' ');
    this.applyMaskedWordScale(chars.length);
    const blankBoxes = [];
    let blankIdx = 0;

    chars.forEach(ch => {
      const box = document.createElement('div');
      if (ch === '_') {
        box.className = 'letter-box blank empty';
        box.textContent = '_';
        if (!box.dataset) box.dataset = {};
        box.dataset.blankIndex = String(blankIdx);
        blankBoxes.push(box);
        blankIdx++;

        box.addEventListener('click', () => {
          if (this.isAnsweringLocked) return;
          if (box.classList.contains('filled')) {
            const tileId = box.dataset.tileId;
            box.textContent = '_';
            box.className = 'letter-box blank empty';
            delete box.dataset.tileId;

            if (tileId) {
              const tileBtn = this.findTileButton(tileId);
              if (tileBtn) {
                tileBtn.classList.remove('used');
                tileBtn.disabled = false;
              }
            }
            soundEngine.playTick(false);
          }
        });
      } else {
        box.className = 'letter-box';
        box.textContent = ch;
      }
      this.letterBoxContainer.appendChild(box);
    });

    // Tạo 8 phím chữ cái (gồm các ký tự cần điền + các ký tự nhiễu)
    const missingLetters = (Array.isArray(q.missing) ? [...q.missing] : q.missing.split('')).map(c => c.toUpperCase());
    const candidateDistractors = ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N', 'D', 'C', 'M', 'P', 'B'];
    const neededDistractors = Math.max(0, 8 - missingLetters.length);
    const filteredDistractors = shuffleArray(candidateDistractors.filter(ch => !missingLetters.includes(ch)));
    const selectedDistractors = filteredDistractors.slice(0, neededDistractors);
    while (selectedDistractors.length < neededDistractors) {
      selectedDistractors.push('A');
    }

    const tileChars = shuffleArray([...missingLetters, ...selectedDistractors]);

    const tilesContainer = document.createElement('div');
    tilesContainer.className = 'letter-tiles-container';

    const tilesGrid = document.createElement('div');
    tilesGrid.className = 'letter-tiles-grid';

    tileChars.forEach((ch, idx) => {
      const tileBtn = document.createElement('button');
      tileBtn.type = 'button';
      tileBtn.className = 'letter-tile-btn';
      tileBtn.textContent = ch;
      if (!tileBtn.dataset) tileBtn.dataset = {};
      tileBtn.dataset.tileId = `tile-${idx}`;
      tileBtn.dataset.char = ch;

      tileBtn.addEventListener('click', () => {
        if (this.isAnsweringLocked) return;
        const emptySlot = blankBoxes.find(b => b.classList.contains('empty'));
        if (!emptySlot) return;

        this.triggerHaptic('light');
        emptySlot.textContent = ch;
        emptySlot.classList.remove('empty');
        emptySlot.classList.add('filled');
        emptySlot.dataset.tileId = tileBtn.dataset.tileId;

        tileBtn.classList.add('used');
        tileBtn.disabled = true;
        soundEngine.playTick(false);

        const allFilled = blankBoxes.every(b => b.classList.contains('filled'));
        if (allFilled) {
          this.evaluateLetterFill(q, blankBoxes);
        }
      });
      this.attachTactileHaptics(tileBtn, 'light');

      tilesGrid.appendChild(tileBtn);
    });

    tilesContainer.appendChild(tilesGrid);

    // 2 Nút thao tác nhanh: Xóa ký tự (Undo) & Làm lại (Clear)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'letter-fill-actions';

    const btnUndo = document.createElement('button');
    btnUndo.type = 'button';
    btnUndo.className = 'letter-action-btn';
    btnUndo.id = 'btn-letter-undo';
    btnUndo.innerHTML = '⌫ Xóa ký tự';
    btnUndo.addEventListener('click', () => {
      if (this.isAnsweringLocked) return;
      this.triggerHaptic('light');
      const filledBlanks = blankBoxes.filter(b => b.classList.contains('filled'));
      if (filledBlanks.length === 0) return;
      const lastSlot = filledBlanks[filledBlanks.length - 1];
      const tileId = lastSlot.dataset.tileId;
      lastSlot.textContent = '_';
      lastSlot.className = 'letter-box blank empty';
      delete lastSlot.dataset.tileId;

      if (tileId) {
        const tileBtn = this.findTileButton(tileId);
        if (tileBtn) {
          tileBtn.classList.remove('used');
          tileBtn.disabled = false;
        }
      }
      soundEngine.playTick(false);
    });

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'letter-action-btn';
    btnClear.id = 'btn-letter-clear';
    btnClear.innerHTML = '🔄 Làm lại';
    btnClear.addEventListener('click', () => {
      if (this.isAnsweringLocked) return;
      this.triggerHaptic('light');
      blankBoxes.forEach(b => {
        if (b.classList.contains('filled')) {
          const tileId = b.dataset.tileId;
          b.textContent = '_';
          b.className = 'letter-box blank empty';
          delete b.dataset.tileId;
          if (tileId) {
            const tileBtn = this.findTileButton(tileId);
            if (tileBtn) {
              tileBtn.classList.remove('used');
              tileBtn.disabled = false;
            }
          }
        }
      });
      soundEngine.playTick(false);
    });

    actionsDiv.appendChild(btnUndo);
    actionsDiv.appendChild(btnClear);
    tilesContainer.appendChild(actionsDiv);

    this.answersContainer.appendChild(tilesContainer);
  }

  evaluateLetterFill(q, blankBoxes) {
    const filledChars = blankBoxes.map(b => b.textContent.trim().toUpperCase());
    const missingChars = (Array.isArray(q.missing) ? q.missing : q.missing.split('')).map(m => m.trim().toUpperCase());
    const isCorrect = filledChars.join('') === missingChars.join('');

    if (isCorrect) {
      this.isAnsweringLocked = true;
      clearInterval(this.timerInterval);
      blankBoxes.forEach(b => {
        b.classList.remove('wrong-word');
        b.classList.add('correct-word');
      });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([35]); } catch (e) {}
      }

      const timeTaken = (Date.now() - this.questionStartTime) / 1000;
      this.responseTimes.push(timeTaken);
      const retentionRate = this.updateWordRetention(q.id, true);
      this.updateMemoryProfile(q, true, timeTaken);
      this.handleCorrectAnswer(timeTaken);
      this.roundResults.push(true);
      this.recordDailyAnswer();
      this.renderSegmentedRoundBar();
      this.showFeedbackDrawer(true, q, false, retentionRate);
    } else {
      this.isAnsweringLocked = true;
      clearInterval(this.timerInterval);
      blankBoxes.forEach(b => b.classList.add('wrong-word'));

      // Hiển thị ký tự đúng để học sinh nhận diện từ đúng
      const missingLetters = Array.isArray(q.missing) ? q.missing : q.missing.split('');
      blankBoxes.forEach((b, i) => {
        b.textContent = missingLetters[i] || '_';
        b.classList.remove('empty');
        b.classList.add('filled', 'wrong-word');
      });

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([60, 50, 70]); } catch (e) {}
      }
      this.handleWrongAnswer(false);
      const timeTaken = (Date.now() - this.questionStartTime) / 1000;
      this.responseTimes.push(timeTaken);
      const retentionRate = this.updateWordRetention(q.id, false);
      this.updateMemoryProfile(q, false, timeTaken);
      this.roundResults.push(false);
      this.recordDailyAnswer();
      this.renderSegmentedRoundBar();

      // Với câu sai: Hiện feedback drawer giải thích và đợi học sinh bấm nút "Tiếp tục"
      this.showFeedbackDrawer(false, q, false, retentionRate);
    }
  }

  renderLetterBoxes(maskedStr) {
    this.letterBoxContainer.innerHTML = '';
    const chars = maskedStr.split(' ');
    this.applyMaskedWordScale(chars.length);
    chars.forEach(ch => {
      const box = document.createElement('div');
      box.className = `letter-box ${ch === '_' ? 'blank' : ''}`;
      box.textContent = ch === '_' ? '_' : ch;
      this.letterBoxContainer.appendChild(box);
    });
  }

  renderAnswerButtons(q) {
    this.answersContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-tactile';
      const labelClass = String(optText || '').length > 26 ? 'btn-label opt-len-long' : 'btn-label';
      btn.innerHTML = `<span class="btn-badge">${letters[idx]}</span> <span class="${labelClass}">${optText}</span>`;
      this.attachTactileHaptics(btn, 'light');
      btn.addEventListener('click', () => this.handleAnswerSelect(idx, btn));
      this.answersContainer.appendChild(btn);
    });
  }

  // Điền & Highlight trực tiếp từ đúng vào ô trống ____ trong câu ngữ cảnh
  fillInlineBlankSlot(q, isCorrect) {
    if (!q || !q.sentence || !this.questionMainText) return;
    const correctAns = (q.options && q.options[q.correct]) ? q.options[q.correct] : (q.target_word || '');
    if (!correctAns) return;
    const slotClass = isCorrect ? 'blank-slot slot-filled-correct' : 'blank-slot slot-filled-reveal';
    this.questionMainText.innerHTML = q.sentence.replace(/_{2,}/g, `<span class="${slotClass}">${correctAns}</span>`);
  }

  // Đếm ngược với bước nhảy 50ms siêu mượt
  startTimer() {
    clearInterval(this.timerInterval);
    const roundLimit = this.activeRoundTimeLimit || this.maxTimeSeconds;
    this.remainingTime = roundLimit;
    this.questionStartTime = Date.now();
    this.timerBar.classList.remove('urgent');
    if (this.countdownDigitalBox) this.countdownDigitalBox.classList.remove('urgent');

    // Theo dõi giây nguyên để phát âm thanh tích tắc êm ái từng giây, tránh phát 20 lần/giây
    let lastTickSecond = Math.ceil(this.remainingTime);

    const updateTimer = () => {
      if (this.isFrozen || this.isAnsweringLocked) return;

      this.remainingTime -= this.timeStepMs / 1000;
      const progressPercent = Math.max(0, (this.remainingTime / roundLimit) * 100);
      this.timerBar.style.width = `${progressPercent}%`;

      // Cập nhật số giây thời gian thực (ví dụ: 14.8s)
      if (this.timerSecondsEl) {
        this.timerSecondsEl.textContent = `${Math.max(0, this.remainingTime).toFixed(1)}s`;
      }

      const currentSec = Math.ceil(this.remainingTime);

      // Khi còn dưới 3.0 giây: Báo động đỏ và nhịp tích tắc êm ái
      if (this.remainingTime <= 3.0) {
        this.timerBar.classList.add('urgent');
        if (this.countdownDigitalBox) this.countdownDigitalBox.classList.add('urgent');
        if (currentSec !== lastTickSecond && currentSec > 0) {
          lastTickSecond = currentSec;
          soundEngine.playTick(true);
        }
      } else {
        // Nhịp đếm nhẹ nhàng từng giây một
        if (currentSec !== lastTickSecond && currentSec > 0) {
          lastTickSecond = currentSec;
          soundEngine.playTick(false);
        }
      }

      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    };

    this.timerInterval = setInterval(updateTimer, this.timeStepMs);
  }

  sparkleCelebration(target) {
    // Disabled per user request (replaced by vibration + green/red border animation)
  }

  handleAnswerSelect(selectedIndex, selectedBtn) {
    if (this.isAnsweringLocked) return;
    this.isAnsweringLocked = true;
    clearInterval(this.timerInterval);

    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === q.correct;
    const timeTaken = (Date.now() - this.questionStartTime) / 1000;
    this.responseTimes.push(timeTaken);

    // Hỗ trợ hiển thị trực quan cho dạng Letter Fill khi gọi trực tiếp từ test/phím
    if (q.mode === 'letter_fill' && q.missing && this.letterBoxContainer && this.letterBoxContainer.querySelectorAll) {
      const blanks = this.letterBoxContainer.querySelectorAll('.letter-box.blank');
      const missingLetters = Array.isArray(q.missing) ? q.missing : q.missing.split('');
      if (blanks && blanks.forEach) {
        blanks.forEach((b, i) => {
          b.textContent = missingLetters[i] || '_';
          if (b.classList && b.classList.add) {
            b.classList.add('filled');
            b.classList.add(isCorrect ? 'correct-word' : 'wrong-word');
          }
        });
      }
    } else if (q.sentence) {
      this.fillInlineBlankSlot(q, isCorrect);
    }

    const allButtons = this.answersContainer.querySelectorAll ? this.answersContainer.querySelectorAll('.btn-tactile') : [];
    const retentionRate = this.updateWordRetention(q.id, isCorrect);
    this.updateMemoryProfile(q, isCorrect, timeTaken);

    if (isCorrect) {
      if (selectedBtn && selectedBtn.classList && selectedBtn.classList.add) selectedBtn.classList.add('correct');
      const badge = selectedBtn && selectedBtn.querySelector ? selectedBtn.querySelector('.btn-badge') : null;
      if (badge) badge.textContent = '✓';
      this.triggerHaptic('success');
      this.handleCorrectAnswer(timeTaken);
    } else {
      if (selectedBtn && selectedBtn.classList && selectedBtn.classList.add) selectedBtn.classList.add('wrong');
      const wrongBadge = selectedBtn && selectedBtn.querySelector ? selectedBtn.querySelector('.btn-badge') : null;
      if (wrongBadge) wrongBadge.textContent = '✕';
      if (allButtons[q.correct] && allButtons[q.correct].classList && allButtons[q.correct].classList.add) {
        allButtons[q.correct].classList.add('correct');
        const correctBadge = allButtons[q.correct].querySelector ? allButtons[q.correct].querySelector('.btn-badge') : null;
        if (correctBadge) correctBadge.textContent = '✓';
      }
      this.triggerHaptic('error');
      this.handleWrongAnswer();
    }

    this.roundResults.push(isCorrect);
    this.recordDailyAnswer();
    this.renderSegmentedRoundBar();
    this.showFeedbackDrawer(isCorrect, q, false, retentionRate);
  }

  handleTimeout() {
    if (this.isAnsweringLocked) return;
    this.isAnsweringLocked = true;

    const q = this.questions[this.currentIndex];
    this.responseTimes.push(this.maxTimeSeconds);
    this.roundResults.push(false);
    this.recordDailyAnswer();
    this.renderSegmentedRoundBar();

    if (q.mode === 'letter_fill' && q.missing && this.letterBoxContainer && this.letterBoxContainer.querySelectorAll) {
      const blanks = this.letterBoxContainer.querySelectorAll('.letter-box.blank');
      const missingLetters = Array.isArray(q.missing) ? q.missing : q.missing.split('');
      if (blanks && blanks.forEach) {
        blanks.forEach((b, i) => {
          b.textContent = missingLetters[i] || '_';
          if (b.classList && b.classList.add) {
            b.classList.add('filled');
            b.classList.add('wrong-word');
          }
        });
      }
      const tileBtns = this.answersContainer.querySelectorAll ? this.answersContainer.querySelectorAll('.letter-tile-btn') : [];
      if (tileBtns && tileBtns.forEach) tileBtns.forEach(btn => { btn.disabled = true; });
    } else {
      if (q.sentence) {
        this.fillInlineBlankSlot(q, false);
      }
      const allButtons = this.answersContainer.querySelectorAll ? this.answersContainer.querySelectorAll('.btn-tactile') : [];
      if (allButtons[q.correct] && allButtons[q.correct].classList && allButtons[q.correct].classList.add) {
        allButtons[q.correct].classList.add('correct');
      }
    }

    const retentionRate = this.updateWordRetention(q.id, false);
    this.updateMemoryProfile(q, false, this.maxTimeSeconds);
    this.handleWrongAnswer(true);

    this.showFeedbackDrawer(false, q, true, retentionRate);
  }

  handleCorrectAnswer(timeTaken) {
    this.streak++;
    if (this.streak > this.maxStreak) {
      this.maxStreak = this.streak;
    }

    // Cơ chế hồi tim: 4 câu đúng liên tiếp hồi 1 tim
    this.consecutiveForHeartRecovery++;
    if (this.consecutiveForHeartRecovery >= 4 && this.hearts < this.maxHearts) {
      this.hearts++;
      this.consecutiveForHeartRecovery = 0;
      this.updateHeartsUI();
      this.flashDynamicIsland('💚 +1 EXTRA LIFE!');
    }

    // Time-Decay scoring cho thang 15 GIÂY
    const timeDecayFactor = Math.max(0.5, 1 - (timeTaken / (2 * this.maxTimeSeconds)));
    let multiplier = 1.0;

    if (this.streak >= 8) {
      multiplier = 2.0; // FEVER MODE
    } else if (this.streak >= 5) {
      multiplier = 1.5;
    } else if (this.streak >= 3) {
      multiplier = 1.2;
    }

    const earnedXP = Math.round(1000 * timeDecayFactor * multiplier);
    this.score += earnedXP;

    soundEngine.playCorrect(this.streak);

    // PHÁT ÂM CHUẨN TỪ VỰNG KHI CHỌN ĐÚNG (TONE TRUNG - CAO, RÕ RÀNG)
    const q = this.questions[this.currentIndex];
    const wordToSpeak = q.target_word || q.options[q.correct];
    setTimeout(() => {
      if (typeof speechEngine !== 'undefined') {
        speechEngine.speakWord(wordToSpeak);
      }
    }, 180);

    if (this.streak === 8) {
      soundEngine.playFever();
      this.flashDynamicIsland('⚡ FEVER MODE x2.0!');
    } else if (this.streak >= 3) {
      this.flashDynamicIsland(`🔥 STREAK x${this.streak}! (+${earnedXP} XP)`);
    }

    this.updateScoreUI();
    this.updateStreakUI();
  }

  handleWrongAnswer(isTimeout = false) {
    this.streak = 0;
    this.consecutiveForHeartRecovery = 0;
    this.hearts = Math.max(0, this.hearts - 1);
    
    soundEngine.playWrong();
    this.updateHeartsUI();
    this.updateStreakUI();

    const q = this.questions[this.currentIndex];
    if (q) {
      if (!this.weakWordIds.includes(q.id)) {
        this.weakWordIds.push(q.id);
        this.saveWeakWords();
      }
      this.injectRecallVariant(q);
    }

    if (isTimeout) {
      this.flashDynamicIsland('⏰ TIME OUT! -1 HEART');
    } else {
      this.flashDynamicIsland('💔 OOPS! -1 HEART');
    }
  }

  injectRecallVariant(wrongQ) {
    if (!wrongQ || wrongQ.isRecallVariant) return;
    const pool = this.getFilteredBank();
    const otherWords = pool
      .filter(x => x.target_word && x.target_word !== wrongQ.target_word)
      .map(x => x.target_word);
    const distractors = shuffleArray(otherWords).slice(0, 3);
    const options = shuffleArray([wrongQ.target_word, ...distractors]);
    const recallVariant = {
      ...wrongQ,
      id: `${wrongQ.id}_recall_${Date.now()}`,
      isRecallVariant: true,
      mode: 'meaning_match',
      prompt: `[ÔN TẬP GỢI NHỚ] Chọn từ tiếng Anh mang nghĩa: "${wrongQ.vietnamese}"`,
      options: options,
      correct: options.indexOf(wrongQ.target_word)
    };
    const insertIdx = Math.min(this.questions.length, this.currentIndex + 3);
    this.questions.splice(insertIdx, 0, recallVariant);
  }

  getConfusableNote(q) {
    if (!q) return '';
    const key = String(q.target_word || '').trim().toLowerCase();
    if (CONFUSABLE_WORDS_DB[key]) {
      return CONFUSABLE_WORDS_DB[key];
    }
    if (q.common_mistake) {
      return `⚠️ Bẫy phòng thi: ${q.common_mistake}`;
    }
    return '';
  }

  showFeedbackDrawer(isCorrect, q, isTimeout = false, retentionRate = 25) {
    this.feedbackDrawer.className = `feedback-drawer active ${isCorrect ? 'correct-state' : 'wrong-state'}`;
    
    if (isCorrect) {
      this.feedbackTitle.innerHTML = `<span style="color:var(--color-success)">✓ CHÍNH XÁC!</span> <span style="font-size:0.75rem; background:rgba(16,185,129,0.15); color:var(--color-success); padding:3px 10px; border-radius:8px; font-weight:800;">🧠 Độ nhớ: ${retentionRate}%</span>`;
    } else if (isTimeout) {
      this.feedbackTitle.innerHTML = `<span style="color:var(--color-danger)">⏰ HẾT GIỜ!</span> <span style="font-size:0.75rem; background:rgba(239,68,68,0.15); color:var(--color-danger); padding:3px 10px; border-radius:8px; font-weight:800;">🧠 Độ nhớ: ${retentionRate}%</span>`;
    } else {
      this.feedbackTitle.innerHTML = `<span style="color:var(--color-danger)">✕ CHƯA ĐÚNG!</span> <span style="font-size:0.75rem; background:rgba(239,68,68,0.15); color:var(--color-danger); padding:3px 10px; border-radius:8px; font-weight:800;">🧠 Độ nhớ: ${retentionRate}%</span>`;
    }

    const displayWord = q.target_word || (q.options && q.options[q.correct]) || '';

    this.feedbackVietnamese.innerHTML = `
      <div class="feedback-word-info">
        <span class="feedback-vn-text">${displayWord ? `<strong style="color:var(--accent-primary);margin-right:4px;">${displayWord}:</strong>` : ''}${q.vietnamese}</span>
        ${q.phonetic ? `<span class="feedback-phonetic-badge">${q.phonetic}</span>` : ''}
      </div>
      <button class="btn-audio-replay" id="btn-audio-replay" title="Nghe lại phát âm chuẩn" aria-label="Nghe lại phát âm chuẩn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fill-opacity="0.25"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      </button>
    `;

    const replayBtn = document.getElementById('btn-audio-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        replayBtn.classList.add('playing');
        setTimeout(() => replayBtn.classList.remove('playing'), 900);
        const word = q.target_word || (q.options && q.options[q.correct]) || '';
        if (typeof speechEngine !== 'undefined') speechEngine.speakWord(word);
      });
    }

    if (this.feedbackExplanation) {
      this.feedbackExplanation.textContent = q.explanation || '';
    }

    if (this.feedbackConfusableBox) {
      const confNote = this.getConfusableNote(q);
      if (confNote) {
        this.feedbackConfusableBox.textContent = confNote;
        this.feedbackConfusableBox.style.display = 'block';
      } else {
        this.feedbackConfusableBox.textContent = '';
        this.feedbackConfusableBox.style.display = 'none';
      }
    }

    if (this.examTaskLabel) {
      this.examTaskLabel.textContent = q.exam_task || 'Writing Task 2';
    }
    if (this.examSentenceQuote) {
      this.examSentenceQuote.textContent = q.real_exam_sentence ? `"${q.real_exam_sentence}"` : '';
    }
    if (this.commonMistakeText) {
      this.commonMistakeText.textContent = q.common_mistake ? `💡 ${q.common_mistake}` : '';
    }

    clearTimeout(this.autoAdvanceTimer);
    this.autoAdvanceTimer = null;

    // CHỈ tự động chuyển sang câu tiếp theo khi Auto-Next đang BẬT và học sinh trả lời ĐÚNG (sau 1.6s).
    // Với câu trả lời SAI hoặc HẾT GIỜ: TUYỆT ĐỐI KHÔNG tự động đổi câu.
    if (this.autoNextEnabled && isCorrect && this.hearts > 0 && this.currentIndex < this.questions.length - 1) {
      this.autoAdvanceTimer = setTimeout(() => {
        if (this.feedbackDrawer && this.feedbackDrawer.classList.contains('active')) {
          this.nextQuestion();
        }
      }, 1600);
    }
  }

  nextQuestion() {
    clearTimeout(this.autoAdvanceTimer);
    this.currentIndex++;
    if (this.currentIndex >= this.questions.length || this.hearts <= 0) {
      this.finishRound();
    } else {
      this.loadQuestion(this.currentIndex);
    }
  }

  useFiftyFifty() {
    if (!this.powerups.fiftyFifty || this.isAnsweringLocked) return;
    this.powerups.fiftyFifty = false;
    this.updatePowerupButtons();
    soundEngine.playPowerup();

    const q = this.questions[this.currentIndex];

    if (q.mode === 'letter_fill') {
      const missingLetters = (Array.isArray(q.missing) ? q.missing : q.missing.split('')).map(m => m.toUpperCase());
      const tileBtns = this.answersContainer.querySelectorAll 
        ? Array.from(this.answersContainer.querySelectorAll('.letter-tile-btn'))
        : [];
      const distractorTiles = tileBtns.filter(btn => {
        const ch = (btn.dataset && btn.dataset.char) || btn.textContent.trim();
        return !missingLetters.includes(ch) && (!btn.classList || !btn.classList.contains('used'));
      });
      const toEliminate = shuffleArray(distractorTiles).slice(0, 2);
      toEliminate.forEach(tile => {
        if (tile.classList && tile.classList.add) tile.classList.add('eliminated');
        tile.disabled = true;
      });
      this.flashDynamicIsland('⚡ 50:50 ĐÃ LOẠI 2 KÝ TỰ SAI');
      return;
    }

    const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== q.correct);
    const shuffledWrong = shuffleArray(wrongIndices).slice(0, 2);

    const allButtons = this.answersContainer.querySelectorAll ? this.answersContainer.querySelectorAll('.btn-tactile') : [];
    shuffledWrong.forEach(idx => {
      if (allButtons[idx] && allButtons[idx].classList && allButtons[idx].classList.add) {
        allButtons[idx].classList.add('eliminated');
      }
    });

    this.flashDynamicIsland('⚡ 50:50 ĐÃ LOẠI 2 ĐÁP ÁN SAI');
  }

  useFreeze() {
    if (!this.powerups.freeze || this.isAnsweringLocked || this.isFrozen) return;
    this.powerups.freeze = false;
    this.isFrozen = true;
    this.updatePowerupButtons();
    soundEngine.playPowerup();

    this.flashDynamicIsland('❄️ ĐÓNG BĂNG THỜI GIAN (+3S)');
    setTimeout(() => {
      this.isFrozen = false;
    }, 3000);
  }

  useHint() {
    if (!this.powerups.hint || this.isAnsweringLocked) return;
    this.powerups.hint = false;
    this.updatePowerupButtons();
    soundEngine.playPowerup();

    const q = this.questions[this.currentIndex];
    this.flashDynamicIsland(`💡 GỢI Ý: ${q.vietnamese.slice(0, 32)}...`);
  }

  updatePowerupButtons() {
    if (this.btnFiftyFifty) this.btnFiftyFifty.disabled = !this.powerups.fiftyFifty;
    if (this.btnFreeze) this.btnFreeze.disabled = !this.powerups.freeze;
    if (this.btnHint) this.btnHint.disabled = !this.powerups.hint;
  }

  updateHeartsUI() {
    if (!this.heartsContainer) return;
    const heartWrappers = this.heartsContainer.querySelectorAll('.heart-wrapper');
    heartWrappers.forEach((wrapper, idx) => {
      if (idx < this.hearts) {
        wrapper.classList.remove('lost');
      } else {
        wrapper.classList.add('lost');
      }
    });
  }

  updateScoreUI() {
    if (this.scoreEl) this.scoreEl.textContent = `${this.score.toLocaleString()} XP`;
  }

  updateStreakUI() {
    const screenContent = document.getElementById('screen-content');
    if (!this.streakPill || !this.streakText) return;

    if (this.streak >= 8) {
      this.streakPill.className = 'streak-pill fever';
      this.streakText.textContent = `FEVER x2.0 🔥`;
      if (screenContent) screenContent.classList.add('fever-active');
    } else if (this.streak >= 5) {
      this.streakPill.className = 'streak-pill fever';
      this.streakText.textContent = `STREAK x1.5 🔥`;
      if (screenContent) screenContent.classList.add('fever-active');
    } else if (this.streak >= 3) {
      this.streakPill.className = 'streak-pill';
      this.streakText.textContent = `STREAK x1.2 🔥`;
      if (screenContent) screenContent.classList.remove('fever-active');
    } else {
      this.streakPill.className = 'streak-pill';
      this.streakText.textContent = `${this.streak} COMBO`;
      if (screenContent) screenContent.classList.remove('fever-active');
    }
  }

  flashDynamicIsland(msg, options = {}) {
    // Dynamic Island drop animation disabled per user request
    if (!this.islandEl) return;
    if (this.islandMsg) this.islandMsg.textContent = msg;
  }

  retractDynamicIsland() {
    // Dynamic Island drop animation disabled per user request
  }

  finishRound() {
    clearInterval(this.timerInterval);
    clearTimeout(this.autoAdvanceTimer);
    if (this.feedbackDrawer) this.feedbackDrawer.classList.remove('active');
    soundEngine.playVictory();

    const totalAnswered = this.roundResults.length;
    const correctCount = this.roundResults.filter(Boolean).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    
    const avgTime = this.responseTimes.length > 0 
      ? (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(1) 
      : '0.0';

    const isToeicRound = ['part5_speed', 'toeic', 'toeic400', 'toeic500', 'toeic600', 'toeic700'].includes(this.currentGradeFilter);
    let bandTitle = "IELTS 5.5 Novice";

    if (isToeicRound) {
      const speedBonus = Math.max(0, Math.round((10 - parseFloat(avgTime)) * 12));
      const estimatedToeic = Math.min(990, Math.max(380, Math.round(350 + (accuracy * 4.5) + speedBonus)));
      if (accuracy >= 90) {
        bandTitle = `🏆 TOEIC ~${estimatedToeic} • Part 5 Master`;
      } else if (accuracy >= 75) {
        bandTitle = `⚡ TOEIC ~${estimatedToeic} • Business Pro`;
      } else {
        bandTitle = `🎯 TOEIC ~${estimatedToeic} • Rising Executive`;
      }
    } else {
      if (accuracy >= 90 && this.score >= 9000) {
        bandTitle = "🏆 IELTS 7.5+ Speed Demon";
      } else if (accuracy >= 80 && this.score >= 7000) {
        bandTitle = "⚡ IELTS 7.0 Master";
      } else if (accuracy >= 60) {
        bandTitle = "🎯 IELTS 6.5 Competent";
      } else {
        bandTitle = "📚 IELTS 5.5 - 6.0 Achiever";
      }
    }

    if (this.finalScoreEl) this.finalScoreEl.textContent = `${this.score.toLocaleString()} XP`;
    if (this.maxStreakEl) this.maxStreakEl.textContent = `${this.maxStreak}`;
    if (this.avgTimeEl) this.avgTimeEl.textContent = `${avgTime}s`;
    if (this.accuracyEl) this.accuracyEl.textContent = `${accuracy}% (${correctCount}/${totalAnswered})`;
    if (this.bandGradeEl) this.bandGradeEl.textContent = bandTitle;

    const emojiBlocks = this.roundResults.map(res => res ? '🟩' : '🟥').join('');
    this.generatedEmojiGrid = 
`⚡ Danh học IELTS & TOEIC Arena ⚡
🏆 Score: ${this.score.toLocaleString()} XP | Grade: ${bandTitle}
🔥 Max Streak: ${this.maxStreak} | ⏱️ Avg Time: ${avgTime}s
${emojiBlocks}
🎯 Học từ vựng phản xạ cùng: Danh học IELTS`;

    if (this.wordleGridEl) this.wordleGridEl.textContent = emojiBlocks;
    if (this.modalOverlay) this.modalOverlay.classList.add('active');
    this.launchConfetti();
  }

  openVault() {
    if (!this.vaultList) return;
    this.vaultList.innerHTML = '';

    this.sessionVocabs.forEach(v => {
      const card = document.createElement('div');
      card.className = 'vault-item-card';
      const ret = this.getWordRetention(v.id);
      const word = v.target_word || v.masked || v.options[v.correct];
      const gradeText = v.grade_label || (v.grade ? `Lớp ${v.grade}` : 'IELTS');

      card.innerHTML = `
        <div class="vault-item-top">
          <span class="vault-word-title">
            ${word} 
            <span style="font-size:0.8rem; color:var(--text-muted);">${v.phonetic || ''}</span>
            <button class="btn-vault-speak" title="Phát âm từ vựng">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
          </span>
          <div style="display:flex; gap:6px; align-items:center;">
            <span class="vault-grade-pill">${gradeText}</span>
            <span class="vault-band-pill">Band ${v.band}</span>
            <span class="vault-retention-pill">🧠 ${ret}%</span>
          </div>
        </div>
        <div class="vault-meaning">${v.vietnamese}</div>
        <div class="vault-sentence-quote">
          "${v.real_exam_sentence || v.explanation}"
        </div>
        ${v.common_mistake ? `<div class="vault-mistake-tip">⚠️ ${v.common_mistake}</div>` : ''}
      `;

      const speakBtn = card.querySelector('.btn-vault-speak');
      if (speakBtn) {
        speakBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof speechEngine !== 'undefined') speechEngine.speakWord(v.target_word || v.options[v.correct]);
        });
      }

      this.vaultList.appendChild(card);
    });

    if (this.vaultOverlay) this.vaultOverlay.classList.add('active');
  }

  closeVault() {
    if (this.vaultOverlay) this.vaultOverlay.classList.remove('active');
  }

  triggerAudioWaveAnimation(durationMs = 950) {
    if (!this.audioWaveBars || !this.audioWaveBars.classList) return;
    this.audioWaveBars.classList.add('speaking');
    clearTimeout(this.waveAnimTimeout);
    this.waveAnimTimeout = setTimeout(() => {
      if (this.audioWaveBars && this.audioWaveBars.classList) {
        this.audioWaveBars.classList.remove('speaking');
      }
    }, durationMs);
  }

  toggleAudioQuizMode() {
    if (this.currentGradeFilter === 'audio') {
      this.setGradeFilter('all');
    } else {
      this.setGradeFilter('audio');
    }
  }

  openGradeModal() {
    const weakBadge = document.getElementById('weak-filter-count-badge');
    if (weakBadge) {
      const stats = this.getAggregatedWordStats();
      weakBadge.textContent = stats.weakWords.length > 0 ? `${stats.weakWords.length} từ` : 'Ưu tiên';
    }
    if (this.customExamCountBadge) {
      const count = (this.customExamBank && this.customExamBank.length) || 0;
      this.customExamCountBadge.textContent = count > 0 ? `${count} câu` : 'Tải đề';
    }
    if (this.gradeModalOverlay) {
      this.gradeModalOverlay.classList.add('active');
    }
  }

  closeGradeModal() {
    if (this.gradeModalOverlay) {
      this.gradeModalOverlay.classList.remove('active');
    }
  }

  setGradeFilter(filterKey) {
    this.currentGradeFilter = filterKey;
    localStorage.setItem('ielts_grade_filter', filterKey);
    this.usedQuestionIds.clear(); // Reset question rotation on filter switch
    this.updateGradeFilterUI();
    this.closeGradeModal();
    this.startNewRound();
    if (this.currentFilterPillLabel) {
      this.flashDynamicIsland(`🎓 Đã chuyển: ${this.currentFilterPillLabel.textContent}`);
    }
  }

  updateGradeFilterUI() {
    const filterLabels = {
      all: 'Adaptive',
      audio: '🎧 Nghe AI',
      weak: '🔥 Từ Yếu',
      custom_exam: '📄 Đề Tự Nhập',
      part5_speed: '⚡ Part 5 Speed',
      toeic: 'TOEIC 400-700',
      toeic400: 'TOEIC 400+',
      toeic500: 'TOEIC 500+',
      toeic600: 'TOEIC 600+',
      toeic700: 'TOEIC 700+',
      ielts: 'IELTS 6-12',
      g6: 'Lớp 6',
      g7: 'Lớp 7',
      g8: 'Lớp 8',
      g9: 'Lớp 9',
      g10: 'Lớp 10',
      g11: 'Lớp 11',
      g12: 'Lớp 12',
      band7: 'Band 7.0+'
    };
    if (this.currentFilterPillLabel) {
      this.currentFilterPillLabel.textContent = filterLabels[this.currentGradeFilter] || 'Adaptive';
    }
    if (this.btnAudioQuizMode && this.btnAudioQuizMode.classList) {
      this.btnAudioQuizMode.classList.toggle('active-mode', this.currentGradeFilter === 'audio');
    }
    if (this.btnExamImport && this.btnExamImport.classList) {
      this.btnExamImport.classList.toggle('active-mode', this.currentGradeFilter === 'custom_exam');
    }
    if (this.customExamCountBadge) {
      const count = (this.customExamBank && this.customExamBank.length) || 0;
      this.customExamCountBadge.textContent = count > 0 ? `${count} câu` : 'Tải đề';
    }
    if (document.querySelectorAll) {
      const optionBtns = document.querySelectorAll('.grade-option-btn');
      optionBtns.forEach(btn => {
        if (btn && typeof btn.getAttribute === 'function' && btn.classList) {
          if (btn.getAttribute('data-filter') === this.currentGradeFilter) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        }
      });
    }
  }

  bindExamImporterEvents() {
    if (this.btnExamImport) {
      this.btnExamImport.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.openExamImportModal();
      });
    }
    if (this.btnExamImportClose) {
      this.btnExamImportClose.addEventListener('click', () => this.closeExamImportModal());
    }
    if (this.examImportModalOverlay) {
      this.examImportModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.examImportModalOverlay) this.closeExamImportModal();
      });
    }
    if (this.examDropzone && this.inputExamFile) {
      this.examDropzone.addEventListener('click', (e) => {
        if (e.target === this.btnClearExamFile) return;
        this.inputExamFile.click();
      });
      this.examDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (this.examDropzone.classList) this.examDropzone.classList.add('drag-over');
      });
      this.examDropzone.addEventListener('dragleave', () => {
        if (this.examDropzone.classList) this.examDropzone.classList.remove('drag-over');
      });
      this.examDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (this.examDropzone.classList) this.examDropzone.classList.remove('drag-over');
        const file = e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files[0] : null;
        if (file) this.handleExamFileSelected(file);
      });
      this.inputExamFile.addEventListener('change', (e) => {
        const file = e.target && e.target.files ? e.target.files[0] : null;
        if (file) this.handleExamFileSelected(file);
      });
    }
    if (this.btnClearExamFile) {
      this.btnClearExamFile.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearSelectedExamFile();
      });
    }
    if (this.btnFillSampleExam && this.examRawTextInput) {
      this.btnFillSampleExam.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.examRawTextInput.value =
`1. All visitors must display their identification badges ____ entering the research laboratory.
A. prior to   B. instead of   C. except for   D. regardless of
Answer: A
2. The accounting department found a significant ____ between the estimated budget and actual expenses.
A. discrepancy   B. itinerary   C. warranty   D. vacancy
Answer: A
3. Ms.oma's contract renewal is ____ upon her completing the mandatory safety certification.
A. contingent   B. complimentary   C. tentative   D. lucrative
Answer: A
4. Please submit all original travel receipts so we can ____ your accommodation expenses promptly.
A. reimburse   B. postpone   C. supervise   D. terminate
Answer: A
5. Following the merger, the board implemented ____ quality control standards across all factories.
A. stringent   B. eligible   C. confidential   D. prospective
Answer: A`;
      });
    }
    if (this.examModeSelector && this.examModeSelector.querySelectorAll) {
      const modeBtns = this.examModeSelector.querySelectorAll('.cfg-pill-btn');
      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.triggerHaptic('light');
          const m = (btn && typeof btn.getAttribute === 'function') ? btn.getAttribute('data-emode') : 'mixed';
          this.examQuestionTypeMode = m || 'mixed';
          modeBtns.forEach(b => {
            if (b && b.classList && typeof b.getAttribute === 'function') {
              b.classList.toggle('active', b.getAttribute('data-emode') === this.examQuestionTypeMode);
            }
          });
        });
      });
    }
    if (this.examCountSelector && this.examCountSelector.querySelectorAll) {
      const countBtns = this.examCountSelector.querySelectorAll('.cfg-count-btn');
      countBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.triggerHaptic('light');
          const c = (btn && typeof btn.getAttribute === 'function') ? Number(btn.getAttribute('data-ecount')) : 10;
          this.examQuestionCount = c || 10;
          countBtns.forEach(b => {
            if (b && b.classList && typeof b.getAttribute === 'function') {
              b.classList.toggle('active', Number(b.getAttribute('data-ecount')) === this.examQuestionCount);
            }
          });
        });
      });
    }
    if (this.btnRunExamConvert) {
      this.btnRunExamConvert.addEventListener('click', () => {
        this.triggerHaptic('medium');
        this.convertExamFileToQuestions();
      });
    }
    if (this.btnClearCustomBank) {
      this.btnClearCustomBank.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.customExamBank = [];
        this.saveCustomExamBank();
        this.renderCustomExamPreview();
        this.updateGradeFilterUI();
      });
    }
    if (this.btnStartCustomExam) {
      this.btnStartCustomExam.addEventListener('click', () => {
        this.triggerHaptic('success');
        this.closeExamImportModal();
        this.setGradeFilter('custom_exam');
      });
    }
  }

  openExamImportModal() {
    this.renderCustomExamPreview();
    if (this.examImportModalOverlay) {
      this.examImportModalOverlay.classList.add('active');
    }
  }

  closeExamImportModal() {
    if (this.examImportModalOverlay) {
      this.examImportModalOverlay.classList.remove('active');
    }
  }

  handleExamFileSelected(file) {
    if (!file) return;
    this.selectedExamFile = file;
    this.triggerHaptic('light');
    if (this.examSelectedFilePill) {
      this.examSelectedFilePill.style.display = 'inline-flex';
    }
    if (this.examSelectedFileName) {
      const sizeKB = Math.max(1, Math.round((file.size || 1024) / 1024));
      this.examSelectedFileName.textContent = `📎 ${file.name} (${sizeKB} KB)`;
    }
    if (this.examImportStatus) {
      this.examImportStatus.style.display = 'block';
      this.examImportStatus.textContent = `✅ Đã chọn file "${file.name}". Bấm nút chuyển đổi bên dưới để tạo câu hỏi!`;
    }
  }

  clearSelectedExamFile() {
    this.selectedExamFile = null;
    if (this.inputExamFile) this.inputExamFile.value = '';
    if (this.examSelectedFilePill) this.examSelectedFilePill.style.display = 'none';
    if (this.examImportStatus) this.examImportStatus.style.display = 'none';
  }

  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      if (typeof FileReader === 'undefined') {
        reject(new Error('Trình duyệt không hỗ trợ FileReader'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = String((e.target && e.target.result) || '');
        const commaIdx = result.indexOf(',');
        resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
      };
      reader.onerror = () => reject(new Error('Không thể đọc file'));
      reader.readAsDataURL(file);
    });
  }

  async convertExamFileToQuestions() {
    const rawText = this.examRawTextInput ? String(this.examRawTextInput.value || '').trim() : '';
    if (!this.selectedExamFile && !rawText) {
      if (this.examImportStatus) {
        this.examImportStatus.style.display = 'block';
        this.examImportStatus.textContent = '⚠️ Vui lòng chọn file đề thi (Ảnh, PDF, Word) hoặc dán nội dung đề thi vào ô văn bản!';
      }
      this.triggerHaptic('error');
      return;
    }

    if (this.btnRunExamConvert) {
      this.btnRunExamConvert.disabled = true;
      this.btnRunExamConvert.innerHTML = '<span>⏳ AI đang phân tích đề & tạo câu hỏi...</span>';
    }
    if (this.examImportStatus) {
      this.examImportStatus.style.display = 'block';
      this.examImportStatus.textContent = '🤖 Đang đọc cấu trúc đề thi và chuyển thành câu hỏi Trắc nghiệm & Điền từ...';
    }

    try {
      let base64Data = '';
      let fileName = '';
      let mimeType = '';

      if (this.selectedExamFile) {
        fileName = this.selectedExamFile.name || 'exam-file';
        mimeType = this.selectedExamFile.type || '';
        base64Data = await this.readFileAsBase64(this.selectedExamFile);
      }

      const response = await fetch('/api/exam-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          mimeType,
          base64Data,
          rawText,
          questionCount: this.examQuestionCount || 10,
          questionTypeMode: this.examQuestionTypeMode || 'mixed'
        })
      });

      const data = await response.json();
      if (!response.ok || !data || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error((data && data.error) || 'Không trích xuất được câu hỏi từ tài liệu.');
      }

      this.customExamBank = [...data.questions, ...(this.customExamBank || [])].slice(0, 120);
      this.saveCustomExamBank();
      this.renderCustomExamPreview();
      this.updateGradeFilterUI();
      soundEngine.playVictory();
      this.triggerHaptic('success');

      if (this.examImportStatus) {
        this.examImportStatus.style.display = 'block';
        this.examImportStatus.textContent = `🎉 Đã tạo thành công ${data.questions.length} câu hỏi Trắc nghiệm & Điền từ! Bấm nút màu xanh bên dưới để vào luyện ngay.`;
      }
    } catch (err) {
      if (this.examImportStatus) {
        this.examImportStatus.style.display = 'block';
        this.examImportStatus.textContent = `⚠️ ${err.message || 'Lỗi khi chuyển đổi đề thi.'}`;
      }
      this.triggerHaptic('error');
    } finally {
      if (this.btnRunExamConvert) {
        this.btnRunExamConvert.disabled = false;
        this.btnRunExamConvert.innerHTML = '<span>✨ Chuyển Thành Câu Hỏi Trắc Nghiệm & Điền Từ</span>';
      }
    }
  }

  renderCustomExamPreview() {
    const bank = this.customExamBank || [];
    if (this.examPreviewCountLabel) {
      this.examPreviewCountLabel.textContent = `📚 Kho đề tự nhập hiện có: ${bank.length} câu`;
    }
    if (this.btnClearCustomBank) {
      this.btnClearCustomBank.style.display = bank.length > 0 ? 'inline-block' : 'none';
    }
    if (this.btnStartCustomExam) {
      this.btnStartCustomExam.style.display = bank.length > 0 ? 'block' : 'none';
    }
    if (!this.examPreviewList) return;

    if (bank.length === 0) {
      this.examPreviewList.innerHTML = `
        <div class="mastery-empty-state">
          <span>📄 Chưa có đề thi nào được nhập. Hãy tải lên Ảnh chụp đề thi, file PDF, file Word (.docx) hoặc bấm "📋 Dán Đề Mẫu" để trải nghiệm ngay!</span>
        </div>
      `;
      return;
    }

    const modeTagMap = {
      letter_fill: '🔤 Điền chữ cái',
      sentence_cloze: '✍️ Điền từ vào câu',
      meaning_match: '🇻🇳 Chọn từ đúng',
      word_class: '🏷️ Từ loại',
      collocation: '🧩 Collocation',
      preposition: '🎯 Giới từ'
    };

    this.examPreviewList.innerHTML = '';
    bank.slice(0, 25).forEach((q, idx) => {
      const item = document.createElement('div');
      item.className = 'exam-preview-item';
      const ansWord = (q.options && q.options[q.correct]) || q.target_word || '';
      item.innerHTML = `
        <div class="ep-top">
          <span class="ep-word">#${idx + 1}. ${ansWord} <span style="font-weight:600;color:var(--text-secondary);">(${q.vietnamese || ''})</span></span>
          <span class="ep-mode-badge">${modeTagMap[q.mode] || 'Trắc nghiệm'}</span>
        </div>
        <div class="ep-sentence">${q.sentence || q.prompt || ''}</div>
      `;
      this.examPreviewList.appendChild(item);
    });
  }

  getAggregatedWordStats() {
    const wordMap = new Map();
    if (typeof IELTS_VOCAB_BANK !== 'undefined' && Array.isArray(IELTS_VOCAB_BANK)) {
      IELTS_VOCAB_BANK.forEach(q => {
        const rawWord = (q.target_word || q.options[q.correct] || '').trim();
        if (!rawWord) return;
        const key = rawWord.toUpperCase();
        if (!wordMap.has(key)) {
          const prof = this.getWordProfile(q);
          const isWeak = (this.weakWordIds && this.weakWordIds.includes(q.id)) || prof.failCount > 0;
          wordMap.set(key, {
            key,
            word: rawWord,
            vietnamese: q.vietnamese || '',
            phonetic: q.phonetic || '',
            band: q.band || '6.5',
            topic: q.topic || 'Academic',
            example: q.real_exam_sentence || q.sentence || '',
            testedCount: prof.testedCount || 0,
            failCount: prof.failCount || 0,
            masteryLevel: prof.masteryLevel || 1,
            retention: prof.retention || 25,
            isWeak
          });
        } else {
          const existing = wordMap.get(key);
          if (this.weakWordIds && this.weakWordIds.includes(q.id)) {
            existing.isWeak = true;
          }
        }
      });
    }

    const allWords = Array.from(wordMap.values());
    const learnedWords = allWords.filter(w => w.testedCount > 0);
    const weakWords = allWords.filter(w => w.isWeak || (w.testedCount > 0 && w.retention < 50));
    const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    allWords.forEach(w => {
      const lv = Math.min(5, Math.max(1, w.masteryLevel || 1));
      levelCounts[lv] = (levelCounts[lv] || 0) + 1;
    });

    const avgRetention = learnedWords.length > 0
      ? Math.round(learnedWords.reduce((sum, w) => sum + w.retention, 0) / learnedWords.length)
      : 25;

    return {
      allWords,
      learnedWords,
      weakWords,
      levelCounts,
      avgRetention,
      masteredCount: (levelCounts[4] || 0) + (levelCounts[5] || 0)
    };
  }

  openMasteryModal() {
    this.updateDailyTrackerUI();
    this.renderMasteryDashboard();
    if (this.masteryModalOverlay) {
      this.masteryModalOverlay.classList.add('active');
    }
  }

  closeMasteryModal() {
    if (this.masteryModalOverlay) {
      this.masteryModalOverlay.classList.remove('active');
    }
  }

  renderMasteryDashboard() {
    const stats = this.getAggregatedWordStats();
    if (this.statTotalLearned) {
      this.statTotalLearned.textContent = `${stats.learnedWords.length}/${stats.allWords.length}`;
    }
    if (this.statAvgRetention) {
      this.statAvgRetention.textContent = `${stats.avgRetention}%`;
    }
    if (this.statMasteredCount) {
      this.statMasteredCount.textContent = `${stats.masteredCount}`;
    }
    if (this.statWeakCount) {
      this.statWeakCount.textContent = `${stats.weakWords.length}`;
    }

    if (this.masteryBarsBox) {
      const total = Math.max(1, stats.allWords.length);
      const levelsMeta = [
        { lv: 1, label: 'Lv.1 🌱 Mới', color: '#10b981' },
        { lv: 2, label: 'Lv.2 🌿 Đang học', color: '#38bdf8' },
        { lv: 3, label: 'Lv.3 🌸 Nhớ tốt', color: '#f472b6' },
        { lv: 4, label: 'Lv.4 ⭐ Nhuần nhuyễn', color: '#f59e0b' },
        { lv: 5, label: 'Lv.5 💎 Thành thạo', color: '#a855f7' }
      ];

      this.masteryBarsBox.innerHTML = levelsMeta.map(m => {
        const count = stats.levelCounts[m.lv] || 0;
        const pct = Math.round((count / total) * 100);
        return `
          <div class="m-bar-row" data-bar-lv="${m.lv}" title="Bấm để lọc danh sách từ ${m.label}">
            <span class="m-bar-label">${m.label}</span>
            <div class="m-bar-track">
              <div class="m-bar-fill" style="width: ${Math.max(4, pct)}%; background: ${m.color};"></div>
            </div>
            <span class="m-bar-val">${count} từ</span>
          </div>
        `;
      }).join('');

      if (this.masteryBarsBox.querySelectorAll) {
        const barRows = this.masteryBarsBox.querySelectorAll('.m-bar-row[data-bar-lv]');
        barRows.forEach(row => {
          row.addEventListener('click', () => {
            const lv = (row && typeof row.getAttribute === 'function') ? row.getAttribute('data-bar-lv') : 'all';
            this.setMasteryFilterTab(lv);
          });
        });
      }
    }

    this.renderMasteryWordList(this.currentMasteryTab || 'all', stats);
  }

  renderMasteryWordList(filterLevel = 'all', precomputedStats = null) {
    if (!this.masteryWordList) return;
    const stats = precomputedStats || this.getAggregatedWordStats();
    let list = [...stats.allWords];

    if (filterLevel === 'weak') {
      list = stats.weakWords;
    } else if (['1', '2', '3', '4', '5'].includes(String(filterLevel))) {
      const targetLv = parseInt(filterLevel, 10);
      list = list.filter(w => w.masteryLevel === targetLv);
    }

    const qStr = (this.masterySearchQuery || '').trim().toLowerCase();
    if (qStr) {
      list = list.filter(w =>
        w.word.toLowerCase().includes(qStr) ||
        w.vietnamese.toLowerCase().includes(qStr) ||
        w.topic.toLowerCase().includes(qStr)
      );
    }

    // Ưu tiên hiển thị các từ đã học hoặc từ yếu lên đầu
    list.sort((a, b) => {
      if (b.testedCount !== a.testedCount) return b.testedCount - a.testedCount;
      return b.retention - a.retention;
    });

    if (list.length === 0) {
      this.masteryWordList.innerHTML = `
        <div class="mastery-empty-state">
          <span>✨ Không tìm thấy từ vựng nào khớp bộ lọc. Hãy thử từ khóa khác hoặc đấu thêm vài ván!</span>
        </div>
      `;
      return;
    }

    const lvBadges = {
      1: 'Lv.1 🌱',
      2: 'Lv.2 🌿',
      3: 'Lv.3 🌸',
      4: 'Lv.4 ⭐',
      5: 'Lv.5 💎'
    };

    this.masteryWordList.innerHTML = '';
    list.slice(0, 60).forEach(item => {
      const row = document.createElement('div');
      row.className = 'mastery-word-card';
      row.innerHTML = `
        <div class="mw-left">
          <div class="mw-title-line">
            <span class="mw-word">${item.word}</span>
            ${item.phonetic ? `<span class="mw-phonetic">${item.phonetic}</span>` : ''}
            <span class="mw-lv-pill">${lvBadges[item.masteryLevel] || 'Lv.1 🌱'}</span>
          </div>
          <div class="mw-vn">${item.vietnamese}</div>
          ${item.example ? `<div class="mw-context-sub">"${item.example}"</div>` : ''}
        </div>
        <div class="mw-right">
          <span class="mw-ret-badge">${item.retention}%</span>
          <button type="button" class="btn-vault-speak" title="Nghe phát âm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </button>
        </div>
      `;
      row.addEventListener('click', () => {
        if (typeof speechEngine !== 'undefined') {
          speechEngine.speakWord(item.word, 0.92);
        }
      });
      this.masteryWordList.appendChild(row);
    });
  }

  exportBackupJSON() {
    try {
      const payload = {
        app: 'Danh học IELTS & TOEIC Arena',
        version: '3.2.0',
        exportedAt: new Date().toISOString(),
        memoryProfiles: this.memoryProfiles || {},
        srsMatrix: this.srsMatrix || {},
        weakWordIds: this.weakWordIds || [],
        dailyTracker: this.dailyTracker || {}
      };
      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateTag = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `danh-ielts-backup-${dateTag}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      soundEngine.playCorrect(1);
    } catch (e) {
      console.error('Lỗi xuất file JSON:', e);
    }
  }

  importBackupJSON(file) {
    if (!file || typeof FileReader === 'undefined') return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(String(evt.target.result || '{}'));
        if (parsed.memoryProfiles && typeof parsed.memoryProfiles === 'object') {
          this.memoryProfiles = { ...this.memoryProfiles, ...parsed.memoryProfiles };
          this.saveMemoryProfiles();
        }
        if (parsed.srsMatrix && typeof parsed.srsMatrix === 'object') {
          this.srsMatrix = { ...this.srsMatrix, ...parsed.srsMatrix };
          this.saveSRSMatrix();
        }
        if (Array.isArray(parsed.weakWordIds)) {
          const mergedWeak = new Set([...(this.weakWordIds || []), ...parsed.weakWordIds]);
          this.weakWordIds = [...mergedWeak];
          this.saveWeakWords();
        }
        if (parsed.dailyTracker && typeof parsed.dailyTracker === 'object') {
          this.dailyTracker = { ...this.dailyTracker, ...parsed.dailyTracker };
          this.saveDailyTracker();
          this.updateDailyTrackerUI();
        }
        this.renderMasteryDashboard();
        soundEngine.playVictory();
      } catch (err) {
        console.error('File JSON không hợp lệ:', err);
      }
    };
    reader.readAsText(file);
  }

  copyShareCard() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.generatedEmojiGrid).then(() => {
        const shareSpan = this.btnShare.querySelector('span');
        if (shareSpan) shareSpan.textContent = '✓ Đã Copy Kết Quả!';
        setTimeout(() => {
          if (shareSpan) shareSpan.textContent = 'Copy Kết Quả Khoe Bạn Bè';
        }, 2000);
      });
    } else {
      alert("Kết quả đã tạo:\n\n" + this.generatedEmojiGrid);
    }
  }

  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 440;
    canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 956;

    const particles = [];
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        gravity: 0.35,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    const rAF = (typeof window !== 'undefined' && window.requestAnimationFrame) || (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : (fn => setTimeout(fn, 16)));
    const cAF = (typeof window !== 'undefined' && window.cancelAnimationFrame) || (typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : (id => clearTimeout(id)));

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vr;
        p.opacity -= 0.008;

        if (p.opacity > 0 && p.y < canvas.height) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrame = rAF(animate);
      } else {
        cAF(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  }
}

// Khởi chạy khi load xong DOM
window.addEventListener('DOMContentLoaded', () => {
  const game = new GameEngine();
  game.startNewRound();
});
