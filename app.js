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
    this.hapticEnabled = this.loadHapticSetting();
    this.lastHapticStyle = null;
    this.lastHapticPattern = null;
    this.hapticHistory = [];
    this.customExamBank = this.loadCustomExamBank();
    this.savedExamPhotos = this.loadSavedExamPhotos();
    this.savedExamsHistory = this.loadSavedExamsHistory();
    this.selectedExamFile = null;
    this.examQuestionTypeMode = 'mixed';
    this.initialExamBatchSize = 5;
    this.maxQuestionsPerExam = 60;
    this.examQuestionCount = 60;
    this.isGeneratingExamInBackground = false;
    this.backgroundExamJobId = 0;
    this.masterySearchQuery = '';
    this.audioGradeFilter = this.loadAudioGradeFilter();
    this.phoneticCoachCache = this.loadPhoneticCoachCache();
    this.lastMispronouncedWord = '';
    this.lastPhoneticCoachTip = '';
    this.currentGradeFilter = 'all'; // Mặc định luôn luôn là adaptive toàn diện theo yêu cầu người dùng

    this.initDOMElements();
    this.bindEvents();
    this.applyPersistedSettings();
    this.preloadedImageCache = new Map();
    this.preloadedQuestionCache = new Map();

    this.updateGradeFilterUI();
    this.updateAudioGradeFilterUI();
    this.updateDailyTrackerUI();
    this.updateAutoNextUI();
    this.updateHapticUI();
    this.renderSavedExamPhotosGallery();
    this.renderCustomExamPreview();
  }

  // Từ điển & Bộ suy luận Loại Từ (Part of Speech: (n), (v), (adj), (adv), (prep), (phr)) chuẩn học thuật
  getWordPOS(word, q = null) {
    const raw = String(word || '').trim();
    if (!raw) return '';
    // Bỏ qua nếu là ký tự đơn (chế độ letter_fill) hoặc chuỗi có dấu tiếng Việt dài (nghĩa tiếng Việt trong Audio Quiz)
    if (/^[a-zA-Z](\s*-\s*[a-zA-Z])*$/.test(raw)) return '';
    if (/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(raw)) return '';

    const w = raw.toLowerCase().replace(/^to\s+/i, '').trim();
    const preps = new Set([
      'in', 'on', 'at', 'to', 'for', 'with', 'from', 'of', 'by', 'into', 'upon',
      'about', 'against', 'between', 'among', 'within', 'without', 'through',
      'during', 'despite', 'throughout', 'over', 'under', 'across', 'toward',
      'towards', 'prior to', 'instead of', 'except for', 'regardless of',
      'according to', 'due to', 'because of', 'in spite of', 'on behalf of'
    ]);
    if (preps.has(w)) return '(prep)';

    const cleanW = w.replace(/\s+(to|for|with|on|in|of|from|at|by|into|about|upon|against|over)$/i, '').trim();

    if (cleanW.includes(' ')) {
      if (/^(make|take|have|give|get|do|pay|play|keep|put|set|bring|carry|come|go|look|run|turn|work|find|point|hold|break|call|cut|fill|hand|catch|bear|wreak)\b/.test(cleanW)) {
        return '(v.phr)';
      }
      return '(n.phr)';
    }

    const posDict = {
      uniform: '(n)', pollution: '(n)', appliance: '(n)', volunteer: '(n/v)', turbine: '(n)',
      creativity: '(n)', concentrate: '(v)', landslide: '(n)', punctual: '(adj)', artisan: '(n)',
      monument: '(n)', qualification: '(n)', breadwinner: '(n)', biodiversity: '(n)',
      discrimination: '(n)', infrastructure: '(n)', 'self-reliant': '(adj)', apprenticeship: '(n)',
      perseverance: '(n)', algorithm: '(n)', biodegradable: '(adj)', waterfall: '(n)',
      landmark: '(n)', housework: '(n)', sunburn: '(n)', pavement: '(n)', ancestor: '(n)',
      bargain: '(n/v)', itinerary: '(n)', ecotourism: '(n)', liveable: '(adj)', resilient: '(adj)',
      multicultural: '(adj)', longevity: '(n)', emission: '(n)', deforestation: '(n)',
      sustainable: '(adj)', renewable: '(adj)', preserve: '(v)', conserve: '(v)',
      contaminate: '(v)', deplete: '(v)', mitigate: '(v)', alleviate: '(v)', exacerbate: '(v)',
      deteriorate: '(v)', proliferate: '(v)', fluctuate: '(v)', stagnate: '(v)', plummet: '(v)',
      skyrocket: '(v)', surpass: '(v)', exceed: '(v)', predominate: '(v)', allocate: '(v)',
      reimburse: '(v)', postpone: '(v)', supervise: '(v)', terminate: '(v)', comply: '(v)',
      abide: '(v)', adhere: '(v)', negotiate: '(v)', collaborate: '(v)', implement: '(v)',
      delegate: '(v/n)', recruit: '(v/n)', audit: '(n/v)', merge: '(v)', acquire: '(v)',
      subsidize: '(v)', waive: '(v)', expedite: '(v)', streamline: '(v)', overhaul: '(v/n)',
      scrutinize: '(v)', rectify: '(v)', jeopardize: '(v)', undermine: '(v)', foster: '(v)',
      bolster: '(v)', cultivate: '(v)', inhibit: '(v)', deter: '(v)', hinder: '(v)',
      impede: '(v)', curb: '(v)', trigger: '(v)', prompt: '(v/adj)', promptly: '(adv)',
      stem: '(v)', yield: '(v/n)', encompass: '(v)', comprise: '(v)', constitute: '(v)',
      entail: '(v)', warrant: '(v/n)', mandate: '(n/v)', authorize: '(v)', verify: '(v)',
      confirm: '(v)', notify: '(v)', commute: '(v/n)', embark: '(v)', participate: '(v)',
      immerse: '(v)', indulge: '(v)', refrain: '(v)', abstain: '(v)', cope: '(v)',
      tentative: '(adj)', tentatively: '(adv)', stringent: '(adj)', contingent: '(adj)',
      eligible: '(adj)', prospective: '(adj)', confidential: '(adj)', proprietary: '(adj)',
      mandatory: '(adj)', compulsory: '(adj)', obligatory: '(adj)', voluntary: '(adj)',
      optional: '(adj)', complimentary: '(adj)', lucrative: '(adj)', profitable: '(adj)',
      feasible: '(adj)', viable: '(adj)', plausible: '(adj)', tangible: '(adj)',
      intangible: '(adj)', obsolete: '(adj)', redundant: '(adj)', vacant: '(adj)',
      fragile: '(adj)', durable: '(adj)', versatile: '(adj)', portable: '(adj)',
      affordable: '(adj)', 'cost-effective': '(adj)', ubiquitous: '(adj)', prevalent: '(adj)',
      pervasive: '(adj)', rampant: '(adj)', unprecedented: '(adj)', indispensable: '(adj)',
      integral: '(adj)', paramount: '(adj)', pivotal: '(adj)', crucial: '(adj)', vital: '(adj)',
      detrimental: '(adj)', adverse: '(adj)', beneficial: '(adj)', conducive: '(adj)',
      susceptible: '(adj)', vulnerable: '(adj)', prone: '(adj)', immune: '(adj)',
      exempt: '(adj)', liable: '(adj)', accountable: '(adj)', adjacent: '(adj)',
      unanimous: '(adj)', preliminary: '(adj)', subsequent: '(adj)', simultaneous: '(adj)',
      spontaneous: '(adj)', rigorous: '(adj)', thorough: '(adj)', meticulous: '(adj)',
      diligent: '(adj)', proficient: '(adj)', competent: '(adj)', adept: '(adj)',
      renowned: '(adj)', eminent: '(adj)', prominent: '(adj)', prestigious: '(adj)',
      notorious: '(adj)', affluent: '(adj)', prosperous: '(adj)', impoverished: '(adj)',
      schedule: '(n/v)', invoice: '(n)', warranty: '(n)', vacancy: '(n)', discrepancy: '(n)',
      subsidiary: '(n)', headquarters: '(n)', agenda: '(n)', memorandum: '(n)',
      brochure: '(n)', pamphlet: '(n)', leaflet: '(n)', catalog: '(n)', inventory: '(n)',
      merchandise: '(n)', apparel: '(n)', defect: '(n)', defective: '(adj)',
      malfunction: '(n/v)', outage: '(n)', disruption: '(n)', congestion: '(n)',
      pedestrian: '(n)', commuter: '(n)', passenger: '(n)', departure: '(n)',
      tariff: '(n)', freight: '(n)', cargo: '(n)', shipment: '(n)', courier: '(n)',
      recipient: '(n)', warehouse: '(n)', franchise: '(n)', merger: '(n)',
      acquisition: '(n)', bankruptcy: '(n)', revenue: '(n)', turnover: '(n)',
      dividend: '(n)', deficit: '(n)', surplus: '(n)', budget: '(n)', expenditure: '(n)',
      expense: '(n)', reimbursement: '(n)', remuneration: '(n)', compensation: '(n)',
      compensate: '(v)', pension: '(n)', severance: '(n)', incentive: '(n)',
      commission: '(n)', installment: '(n)', mortgage: '(n)', collateral: '(n)',
      liability: '(n)', asset: '(n)', equity: '(n)', portfolio: '(n)', receipt: '(n)',
      voucher: '(n)', coupon: '(n)', rebate: '(n)', refund: '(n/v)', clientele: '(n)',
      colleague: '(n)', subordinate: '(n)', supervisor: '(n)', executive: '(n)',
      committee: '(n)', delegation: '(n)', nominee: '(n)', candidate: '(n)',
      applicant: '(n)', intern: '(n)', trainee: '(n)', internship: '(n)',
      predecessor: '(n)', successor: '(n)', counterpart: '(n)', advocate: '(n/v)',
      proponent: '(n)', opponent: '(n)', verdict: '(n)', lawsuit: '(n)',
      legislation: '(n)', regulation: '(n)', statute: '(n)', clause: '(n)',
      provision: '(n)', stipulate: '(v)', breach: '(n/v)', infringement: '(n)',
      violation: '(n)', penalty: '(n)', sanction: '(n)', embargo: '(n)',
      consensus: '(n)', compromise: '(n/v)', deadlock: '(n)', breakthrough: '(n)',
      milestone: '(n)', benchmark: '(n)', criterion: '(n)', criteria: '(n)',
      paradigm: '(n)', phenomenon: '(n)', dilemma: '(n)', predicament: '(n)',
      catastrophe: '(n)', calamity: '(n)', famine: '(n)', drought: '(n)',
      epidemic: '(n)', pandemic: '(n)', outbreak: '(n)', hygiene: '(n)',
      sanitation: '(n)', nutrition: '(n)', obesity: '(n)', fatigue: '(n)',
      symptom: '(n)', diagnosis: '(n)', remedy: '(n)', therapy: '(n)',
      rehabilitation: '(n)', immunity: '(n)', vaccine: '(n)', antibiotic: '(n)',
      sedentary: '(adj)', chronic: '(adj)', acute: '(adj)', infectious: '(adj)',
      contagious: '(adj)', lethal: '(adj)', fatal: '(adj)', genetic: '(adj)',
      cognitive: '(adj)', vocational: '(adj)', extracurricular: '(adj)',
      ecosystem: '(n)', skytrain: '(n)', peacekeeping: '(n)', donate: '(v)',
      fossil: '(n/adj)', bullying: '(n)', landfill: '(n)', automate: '(v)',
      fond: '(adj)', afraid: '(adj)', wait: '(v)', bad: '(adj)', help: '(v/n)',
      share: '(v/n)', succeed: '(v)', suffer: '(v)', believe: '(v)', belong: '(v)',
      accustomed: '(adj)', insist: '(v)', consist: '(v)', specialize: '(v)',
      congratulate: '(v)', apologize: '(v)', interfere: '(v)', result: '(n/v)',
      deprived: '(adj)', accommodate: '(v)', qualified: '(adj)', procedure: '(n)',
      renovation: '(n)', proposal: '(n)', complaint: '(n)', performance: '(n)',
      facility: '(n)', deadline: '(n)', reservation: '(n)', specification: '(n)',
      obligation: '(n)', discount: '(n/v)', productive: '(adj)', announcement: '(n)',
      conference: '(n)', delivery: '(n)', evaluate: '(v)', appointment: '(n)',
      salary: '(n)', customer: '(n)', repair: '(v/n)', attend: '(v)', baggage: '(n)',
      cashier: '(n)', lobby: '(n)', manager: '(n)', message: '(n)', order: '(n/v)',
      package: '(n)', ticket: '(n)', visitor: '(n)', assistance: '(n)',
      promotion: '(n)', accountant: '(n)', contract: '(n)', department: '(n)',
      equipment: '(n)', inspect: '(v)', policy: '(n)', purchase: '(v/n)',
      distribute: '(v)', contribute: '(v)', banquet: '(n)', estimate: '(v/n)',
      extension: '(n)', maintenance: '(n)', representative: '(n)',
      subscription: '(n)', consolidate: '(v)', credential: '(n)', amendment: '(n)'
    };

    if (posDict[cleanW]) return posDict[cleanW];

    // Suy luận hình thái từ (Morphological Suffix Inference) cho các biến thể từ loại (Word Class options)
    if (/ly$/.test(cleanW) && !/(supply|apply|rely|comply|imply|reply|multiply|ally|bully|monopoly|anomaly|assembly|family|friendly|costly|likely|lively|lonely|lovely|timely|orderly|daily|weekly|monthly|yearly|elderly)$/i.test(cleanW)) {
      return '(adv)';
    }
    if (/(tion|sion|ment|ness|ity|ance|ence|ship|hood|dom|ism|ist|ture|cy|logy|nomy|graphy|ette|ade|er|or|ee|ant)$/i.test(cleanW)) {
      if (/(significant|abundant|reluctant|redundant|vacant|relevant|tolerant|compliant|dominant|ignorant|important|distant|constant|instant|pleasant|elegant|brilliant|vibrant|hesitant)$/i.test(cleanW)) {
        return '(adj)';
      }
      return '(n)';
    }
    if (/(ize|ise|ify|ate|en)$/i.test(cleanW)) {
      if (/(candidate|delegate|mandate|advocate|graduate|estimate|associate|subordinate|accurate|adequate|appropriate|delicate|desperate|elaborate|fortunate|immediate|legitimate|moderate|passionate|ultimate|considerate|corporate|separate|intricate|innate|wooden|golden|woolen|broken|spoken|written|chosen|frozen|hidden|forbidden)$/i.test(cleanW)) {
        return '(adj)';
      }
      return '(v)';
    }
    if (/(ive|ous|ful|less|able|ible|ic|al|ent)$/i.test(cleanW)) {
      if (/(manual|journal|capital|signal|rival|festival|hospital|animal|approval|proposal|arrival|survival|removal|renewal|withdrawal|refusal|disposal|dismissal|appraisal|trial|potential|individual|professional|chemical|material|terminal|topic|critic|characteristic|statistic|logic|ethic|panic|traffic|public|president|resident|student|client|patient|recipient|ingredient|component|opponent|proponent|continent|accident|incident)$/i.test(cleanW)) {
        return '(n)';
      }
      return '(adj)';
    }
    if (/ing$/.test(cleanW)) return '(v-ing)';
    if (/ed$/.test(cleanW)) return '(v-ed)';
    if (q && q.vietnamese) {
      const vn = String(q.vietnamese).toLowerCase();
      if (/^(sự |việc |người |nhà |chế độ |hệ thống |khoản |tiền |bản |hợp đồng|lịch trình|hóa đơn|bằng cấp)/.test(vn)) return '(n)';
      if (/^(một cách )/.test(vn)) return '(adv)';
    }
    return '(v)';
  }

  resolveQuestionImageUrl(q) {
    if (!q || q.isAudioQuiz) return null;
    if (q.image_url) return q.image_url;
    if (typeof VOCAB_IMAGES === 'undefined') return null;
    const targetKey = (q.target_word || '').trim().toLowerCase();
    const baseKey = targetKey.replace(/\s+(to|for|with|on|in|of|from|at|by|into|about|upon)$/i, '');
    return VOCAB_IMAGES[targetKey] || VOCAB_IMAGES[baseKey] || null;
  }

  // Tiền xử lý & nạp trước (Preload) tài nguyên hình ảnh + siêu dữ liệu của câu hỏi vào RAM
  getOrPrecomputeQuestionMeta(q) {
    if (!q) return null;
    const cacheKey = q.id || `${q.target_word}_${q.mode}`;
    if (this.preloadedQuestionCache && this.preloadedQuestionCache.has(cacheKey)) {
      return this.preloadedQuestionCache.get(cacheKey);
    }

    const imgUrl = this.resolveQuestionImageUrl(q);
    if (imgUrl && this.preloadedImageCache && !this.preloadedImageCache.has(imgUrl)) {
      try {
        if (typeof Image !== 'undefined') {
          const preImg = new Image();
          preImg.decoding = 'async';
          preImg.src = imgUrl;
          if (typeof preImg.decode === 'function') {
            preImg.decode().catch(() => {});
          }
          this.preloadedImageCache.set(imgUrl, preImg);
        }
      } catch (e) {}
    }

    const ansWord = (q.mode === 'word_class' && q.options && q.options[q.correct])
      ? q.options[q.correct]
      : (q.target_word || (q.options && q.options[q.correct]) || '');
    const mainPos = this.getWordPOS(ansWord, q);
    const optionPosList = Array.isArray(q.options)
      ? q.options.map(opt => this.getWordPOS(opt, q))
      : [];
    const highlightedSentence = q.sentence
      ? q.sentence.replace(/_{2,}/g, '<span class="blank-slot">____</span>')
      : '';

    const meta = {
      imgUrl,
      hasImage: Boolean(imgUrl),
      mainPos,
      optionPosList,
      highlightedSentence
    };

    if (this.preloadedQuestionCache) {
      this.preloadedQuestionCache.set(cacheKey, meta);
    }
    return meta;
  }

  // Nạp trước (Lookahead Preloader) các từ vựng tiếp theo trong hàng đợi để chuyển câu 0ms không trễ
  preloadUpcomingQuestions(startIndex = 0, lookaheadCount = 4) {
    if (!Array.isArray(this.questions) || this.questions.length === 0) return;

    const endImmediate = Math.min(this.questions.length, startIndex + lookaheadCount);
    for (let i = Math.max(0, startIndex); i < endImmediate; i++) {
      this.getOrPrecomputeQuestionMeta(this.questions[i]);
    }

    // Làm nóng bộ phát âm Web Speech API
    if (typeof speechEngine !== 'undefined' && speechEngine.synth && typeof speechEngine.synth.getVoices === 'function') {
      try { speechEngine.synth.getVoices(); } catch (e) {}
    }

    // Nạp nền toàn bộ các câu còn lại trong vòng chơi khi luồng chính rảnh
    if (endImmediate < this.questions.length) {
      const scheduleIdle = (typeof window !== 'undefined' && window.requestIdleCallback)
        ? window.requestIdleCallback
        : (fn => setTimeout(fn, 24));
      scheduleIdle(() => {
        if (!Array.isArray(this.questions)) return;
        for (let j = endImmediate; j < this.questions.length; j++) {
          this.getOrPrecomputeQuestionMeta(this.questions[j]);
        }
      });
    }
  }

  // Hệ thống phản hồi rung xúc giác (Haptic Feedback Engine) đa tầng qua Haptic API của trình duyệt:
  // 1. Web Vibration API (navigator.vibrate) với nhịp rung vật lý riêng biệt cho Đúng / Sai / Chuỗi Combo / Hết giờ
  // 2. Web Gamepad HapticActuator API (vibrationActuator.playEffect / pulse) nếu thiết bị/tay cầm hỗ trợ
  // 3. iOS 17.4+ / iOS 18+ Safari Native Taptic Engine qua công tắc <input type="checkbox" switch>
  // 4. Sub-Bass Acoustic Tactile Impulse (Web Audio 45Hz-115Hz) + Phản hồi vi chuyển động (Visual Micro-Haptics)
  triggerHaptic(style = 'light', options = {}) {
    const normalizedStyle = style === 'correct'
      ? 'success'
      : (style === 'wrong' ? 'error' : String(style || 'light'));

    let pattern = [12];
    if (normalizedStyle === 'light' || normalizedStyle === 'tap') {
      pattern = [12];
    } else if (normalizedStyle === 'medium') {
      pattern = [22];
    } else if (normalizedStyle === 'success') {
      // Trả lời ĐÚNG: Nhịp rung đôi giòn giã (hoặc nhịp 3 cao trào khi đạt chuỗi Streak >= 3)
      pattern = this.streak >= 3 ? [18, 28, 26, 28, 52] : [20, 35, 38];
    } else if (normalizedStyle === 'error') {
      // Trả lời SAI: Nhịp rung kép trầm và đầm (Double Heavy Buzz) tạo cảm giác khựng thực tế
      pattern = [65, 45, 95];
    } else if (normalizedStyle === 'timeout') {
      // HẾT GIỜ: Nhịp rung cảnh báo dứt khoát
      pattern = [85, 50, 120];
    } else {
      pattern = [15];
    }

    this.lastHapticStyle = normalizedStyle;
    this.lastHapticPattern = pattern;
    if (!Array.isArray(this.hapticHistory)) {
      this.hapticHistory = [];
    }
    this.hapticHistory.push({
      style: normalizedStyle,
      pattern: [...pattern],
      timestamp: Date.now()
    });
    if (this.hapticHistory.length > 30) {
      this.hapticHistory.shift();
    }

    if (this.hapticEnabled === false && !(options && options.force)) {
      return false;
    }

    try {
      // 1. Chuẩn Web Vibration API của trình duyệt (navigator.vibrate)
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern.length === 1 ? pattern[0] : pattern);
      }

      // 2. Chuẩn Gamepad HapticActuator API của trình duyệt (dual-rumble / pulse)
      if (typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function') {
        const gamepads = navigator.getGamepads() || [];
        for (let i = 0; i < gamepads.length; i++) {
          const gp = gamepads[i];
          if (!gp) continue;
          const actuator = gp.vibrationActuator || (Array.isArray(gp.hapticActuators) && gp.hapticActuators[0]);
          if (actuator && typeof actuator.playEffect === 'function') {
            if (normalizedStyle === 'success') {
              actuator.playEffect('dual-rumble', {
                startDelay: 0,
                duration: 95,
                weakMagnitude: 0.75,
                strongMagnitude: 0.35
              }).catch(() => {});
            } else if (normalizedStyle === 'error' || normalizedStyle === 'timeout') {
              actuator.playEffect('dual-rumble', {
                startDelay: 0,
                duration: 185,
                weakMagnitude: 0.55,
                strongMagnitude: 0.95
              }).catch(() => {});
            } else {
              actuator.playEffect('dual-rumble', {
                startDelay: 0,
                duration: 24,
                weakMagnitude: 0.3,
                strongMagnitude: 0.1
              }).catch(() => {});
            }
          } else if (actuator && typeof actuator.pulse === 'function') {
            const intensity = (normalizedStyle === 'error' || normalizedStyle === 'timeout') ? 0.9 : (normalizedStyle === 'success' ? 0.65 : 0.25);
            const dur = (normalizedStyle === 'error' || normalizedStyle === 'timeout') ? 160 : (normalizedStyle === 'success' ? 85 : 20);
            actuator.pulse(intensity, dur).catch(() => {});
          }
        }
      }

      // 3. Hỗ trợ Taptic Engine vật lý trên iOS 17.4+ / iOS 18+ Safari qua input[switch]
      if (this.iosHapticTrigger && typeof this.iosHapticTrigger.click === 'function') {
        this.iosHapticTrigger.click();
        if (normalizedStyle === 'success') {
          setTimeout(() => {
            if (this.iosHapticTrigger && typeof this.iosHapticTrigger.click === 'function') {
              this.iosHapticTrigger.click();
            }
          }, 65);
        } else if (normalizedStyle === 'error' || normalizedStyle === 'timeout') {
          setTimeout(() => {
            if (this.iosHapticTrigger && typeof this.iosHapticTrigger.click === 'function') {
              this.iosHapticTrigger.click();
            }
          }, 55);
          setTimeout(() => {
            if (this.iosHapticTrigger && typeof this.iosHapticTrigger.click === 'function') {
              this.iosHapticTrigger.click();
            }
          }, 115);
        }
      }

      // 4. Xung cộng hưởng trầm (Sub-Bass Tactile Impulse) qua Web Audio API
      if (typeof soundEngine !== 'undefined' && soundEngine && typeof soundEngine.playHapticPulse === 'function') {
        const pulseType = (normalizedStyle === 'success' && this.streak >= 3) ? 'fever' : normalizedStyle;
        soundEngine.playHapticPulse(pulseType);
      }

      // 5. Hiệu ứng phản hồi xúc giác thị giác đồng bộ trên thẻ câu hỏi khi trả lời Đúng / Sai
      if (this.questionCard && this.questionCard.classList && (normalizedStyle === 'success' || normalizedStyle === 'error' || normalizedStyle === 'timeout')) {
        const cls = normalizedStyle === 'success' ? 'haptic-card-success' : 'haptic-card-error';
        this.questionCard.classList.remove('haptic-card-success', 'haptic-card-error');
        this.questionCard.classList.add(cls);
        clearTimeout(this.hapticVisualTimeout);
        this.hapticVisualTimeout = setTimeout(() => {
          if (this.questionCard && this.questionCard.classList) {
            this.questionCard.classList.remove('haptic-card-success', 'haptic-card-error');
          }
        }, 380);
      }
    } catch (e) {}
    return true;
  }

  loadHapticSetting() {
    try {
      const saved = localStorage.getItem('ielts_haptic_enabled');
      if (saved === null) return true;
      return saved === 'true';
    } catch (e) {
      return true;
    }
  }

  toggleHaptic() {
    this.hapticEnabled = !this.hapticEnabled;
    try {
      localStorage.setItem('ielts_haptic_enabled', String(this.hapticEnabled));
    } catch (e) {}
    this.updateHapticUI();
    if (this.hapticEnabled) {
      this.triggerHaptic('success', { force: true });
    }
    return this.hapticEnabled;
  }

  updateHapticUI() {
    if (this.settingsHapticBadge) {
      this.settingsHapticBadge.textContent = this.hapticEnabled ? 'Bật 📳' : 'Tắt 📴';
    }
    if (this.btnHapticToggle && this.btnHapticToggle.classList) {
      this.btnHapticToggle.classList.toggle('muted-setting', !this.hapticEnabled);
    }
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

  loadAudioGradeFilter() {
    try {
      const saved = localStorage.getItem('ielts_audio_grade_filter');
      return saved || 'all';
    } catch (e) {
      return 'all';
    }
  }

  saveAudioGradeFilter() {
    try {
      localStorage.setItem('ielts_audio_grade_filter', this.audioGradeFilter || 'all');
    } catch (e) {}
  }

  setAudioGradeFilter(gradeKey) {
    this.audioGradeFilter = String(gradeKey || 'all').trim();
    this.saveAudioGradeFilter();
    this.usedQuestionIds.clear();
    this.updateAudioGradeFilterUI();
    this.updateGradeFilterUI();
    if (this.currentGradeFilter === 'audio') {
      this.startNewRound();
    }
  }

  updateAudioGradeFilterUI() {
    if (this.audioGradeFilterBar && this.audioGradeFilterBar.querySelectorAll) {
      const chips = this.audioGradeFilterBar.querySelectorAll('.audio-grade-chip');
      chips.forEach(chip => {
        if (chip && chip.classList && typeof chip.getAttribute === 'function') {
          const val = chip.getAttribute('data-audio-grade') || 'all';
          chip.classList.toggle('active', val === (this.audioGradeFilter || 'all'));
        }
      });
    }
  }

  loadPhoneticCoachCache() {
    try {
      const saved = localStorage.getItem('ielts_phonetic_coach_cache_v1');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  savePhoneticCoachCache() {
    try {
      localStorage.setItem('ielts_phonetic_coach_cache_v1', JSON.stringify(this.phoneticCoachCache || {}));
    } catch (e) {}
  }

  // Bộ Phân Tích Âm Tiết, Trọng Âm & Cách Đặt Lưỡi / Khẩu Hình (AI Phonetic Coach 1-Line)
  analyzeWordSyllablesAndTip(word, phonetic = '', spokenText = '') {
    const raw = String(word || 'sustainable').trim().replace(/^to\s+/i, '');
    const primaryToken = raw.split(/\s+/)[0].replace(/[^a-zA-Z-]/g, '').toLowerCase() || 'sustainable';

    if (this.phoneticCoachCache && this.phoneticCoachCache[primaryToken]) {
      return this.phoneticCoachCache[primaryToken];
    }

    const PHONETIC_STRESS_DB = {
      sustainable: { syllables: ['sus', 'tain', 'a', 'ble'], stressIndex: 1, tip: 'mở rộng khẩu hình âm đôi /eɪ/, bật nhẹ âm cuối /-bəl/' },
      comprehensive: { syllables: ['com', 'pre', 'hen', 'sive'], stressIndex: 2, tip: 'hạ nhẹ cằm ở âm /hen/, khép răng âm cuối /-sɪv/' },
      mandatory: { syllables: ['man', 'da', 'to', 'ry'], stressIndex: 0, tip: 'mở rộng miệng âm /mæn/, lướt nhẹ các âm tiết sau' },
      discrepancy: { syllables: ['dis', 'crep', 'an', 'cy'], stressIndex: 1, tip: 'bật rõ cụm phụ âm /kr/ ở âm tiết thứ 2' },
      reimburse: { syllables: ['re', 'im', 'burse'], stressIndex: 2, tip: 'nhấn mạnh âm cuối /bɜːs/, cong nhẹ đầu lưỡi' },
      stringent: { syllables: ['strin', 'gent'], stressIndex: 0, tip: 'bật cụm phụ âm đầu /str-/, âm cuối /-dʒənt/ rõ nét' },
      contingent: { syllables: ['con', 'tin', 'gent'], stressIndex: 1, tip: 'đặt đầu lưỡi chạm nướu bật rõ âm /tɪn/' },
      significant: { syllables: ['sig', 'nif', 'i', 'cant'], stressIndex: 1, tip: 'nhấn gọn âm /nɪf/, môi dưới chạm răng trên ở âm /f/' },
      implement: { syllables: ['im', 'ple', 'ment'], stressIndex: 0, tip: 'nhấn dứt khoát âm đầu /ɪm/, khép hai môi rõ' },
      negotiate: { syllables: ['ne', 'go', 'ti', 'ate'], stressIndex: 1, tip: 'tròn môi ở âm /ɡəʊ/, âm thứ 3 đọc nhẹ /ʃi/' },
      proficient: { syllables: ['pro', 'fi', 'cient'], stressIndex: 1, tip: 'nhấn âm /fɪ/, chu nhẹ môi ở âm /ʃənt/' },
      feasible: { syllables: ['fea', 'si', 'ble'], stressIndex: 0, tip: 'kéo căng khóe miệng âm dài /fiː/, rung dây thanh âm /z/' },
      ubiquitous: { syllables: ['u', 'biq', 'ui', 'tous'], stressIndex: 1, tip: 'âm đầu đọc là /juː/, nhấn mạnh âm tiết 2 /bɪk/' },
      precipitous: { syllables: ['pre', 'cip', 'i', 'tous'], stressIndex: 1, tip: 'nhấn mạnh âm /sɪp/, bật hơi nhẹ âm /p/' },
      detrimental: { syllables: ['det', 'ri', 'men', 'tal'], stressIndex: 2, tip: 'nhấn rõ âm tiết thứ 3 /men/, đầu lưỡi chạm lợi âm /t/' },
      mitigate: { syllables: ['mit', 'i', 'gate'], stressIndex: 0, tip: 'nhấn gọn âm đầu /mɪt/, mở miệng âm đôi /ɡeɪt/ ở cuối' },
      environment: { syllables: ['en', 'vi', 'ron', 'ment'], stressIndex: 1, tip: 'mở rộng khẩu hình âm đôi /vaɪ/, răng trên chạm môi dưới âm /v/' },
      biodiversity: { syllables: ['bi', 'o', 'di', 'ver', 'si', 'ty'], stressIndex: 3, tip: 'nhấn mạnh âm thứ 4 /vɜː/, cong nhẹ lưỡi' },
      infrastructure: { syllables: ['in', 'fra', 'struc', 'ture'], stressIndex: 0, tip: 'nhấn âm đầu /ɪn/, bật cụm /strʌk/ rõ ràng' },
      itinerary: { syllables: ['i', 'tin', 'er', 'a', 'ry'], stressIndex: 1, tip: 'âm đầu đọc /aɪ/, nhấn mạnh âm tiết thứ 2 /tɪn/' },
      warranty: { syllables: ['war', 'ran', 'ty'], stressIndex: 0, tip: 'tròn môi âm đầu /wɔː/, lướt nhẹ hai âm sau' },
      vacancy: { syllables: ['va', 'can', 'cy'], stressIndex: 0, tip: 'mở miệng âm đôi /veɪ/, răng trên chạm nhẹ môi dưới' },
      schedule: { syllables: ['sched', 'ule'], stressIndex: 0, tip: 'bật âm đầu /sked-/ hoặc /ʃed-/, uốn nhẹ lưỡi âm cuối' },
      renewable: { syllables: ['re', 'new', 'a', 'ble'], stressIndex: 1, tip: 'nhấn mạnh âm tiết thứ 2 /njuː/, tròn môi' },
      pollution: { syllables: ['pol', 'lu', 'tion'], stressIndex: 1, tip: 'nhấn âm tiết 2 /luː/, chu nhẹ môi ở đuôi /-ʃən/' },
      qualification: { syllables: ['qual', 'i', 'fi', 'ca', 'tion'], stressIndex: 3, tip: 'nhấn mạnh âm thứ 4 /keɪ/ ngay trước đuôi -tion' },
      concentrate: { syllables: ['con', 'cen', 'trate'], stressIndex: 0, tip: 'nhấn mạnh âm đầu /kɒn/, bật rõ cụm /tr/ ở cuối' },
      punctual: { syllables: ['punc', 'tu', 'al'], stressIndex: 0, tip: 'nhấn âm đầu /pʌŋk/, âm giữa đọc /tʃu/' }
    };

    const preset = PHONETIC_STRESS_DB[primaryToken];
    let syllables = [];
    let stressIndex = 0;
    let articulationTip = 'mở rõ khẩu hình ở âm tiết mang dấu nhấn';

    if (preset) {
      syllables = [...preset.syllables];
      stressIndex = preset.stressIndex;
      articulationTip = preset.tip;
    } else {
      // Tách âm tiết tự động theo cụm nguyên âm tiếng Anh
      const cleanNoSilentE = primaryToken.length > 4 && /[^aeiou]e$/i.test(primaryToken) && !/(le|re)$/i.test(primaryToken)
        ? primaryToken.slice(0, -1)
        : primaryToken;
      const chunks = cleanNoSilentE.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi);
      if (chunks && chunks.length > 0) {
        syllables = chunks.map(s => s.toLowerCase());
        if (cleanNoSilentE.length < primaryToken.length) {
          syllables[syllables.length - 1] += primaryToken.slice(-1);
        }
      } else {
        syllables = [primaryToken];
      }

      // Ưu tiên dò dấu nhấn trọng âm ˈ trong phiên âm IPA nếu có
      const ipa = String(phonetic || '').replace(/^\/|\/$/g, '').trim();
      if (ipa && ipa.includes('ˈ') && syllables.length > 1) {
        const beforeStress = ipa.split('ˈ')[0];
        const vowelMatches = beforeStress.match(/[ɑæʌɔaɪiɛeʊuɜəɒ]+/g);
        const estimatedIdx = vowelMatches ? vowelMatches.length : 0;
        stressIndex = Math.min(syllables.length - 1, Math.max(0, estimatedIdx));
      } else if (syllables.length > 1 && /(tion|sion|ic|ical|ity|ety|cient|tial|cial)$/i.test(primaryToken)) {
        stressIndex = Math.max(0, syllables.length - 2);
      } else if (syllables.length >= 3 && /(able|ible|ment|ness|ous|ive|ate|ary|ory|ize|ise|fy)$/i.test(primaryToken)) {
        stressIndex = Math.max(0, syllables.length - 3);
      } else if (syllables.length === 2 && /^(re|de|pre|con|com|in|im|ex|sub|pro|per|ob|ad|al|en|em|dis|un|mis)/i.test(primaryToken)) {
        stressIndex = 1;
      } else {
        stressIndex = 0;
      }

      const stressedSyl = syllables[stressIndex] || syllables[0] || '';
      if (/^(th)/i.test(stressedSyl)) {
        articulationTip = 'đặt nhẹ đầu lưỡi giữa hai hàm răng ở âm /θ, ð/';
      } else if (/^(str|spr|spl|scr|pl|pr|tr|cr|br|gr|fl|fr)/i.test(stressedSyl)) {
        articulationTip = 'đặt đầu lưỡi chạm vòm lợi bật rõ cụm phụ âm đầu';
      } else if (/(tion|sion|cient|tial|cial|sh)/i.test(primaryToken)) {
        articulationTip = 'chu nhẹ môi đẩy hơi êm ở âm /ʃ/';
      } else if (/[aeiou]{2}|ai|ay|ea|ee|oa|oo/i.test(stressedSyl)) {
        articulationTip = `mở rộng khẩu hình ngân rõ âm "${stressedSyl.toUpperCase()}"`;
      } else {
        articulationTip = `hạ nhẹ hàm và bật rõ âm "${stressedSyl.toUpperCase()}"`;
      }
    }

    const formattedSyllables = syllables
      .map((s, idx) => (idx === stressIndex ? s.toUpperCase() : s.toLowerCase()))
      .join('-');
    const humanOrder = stressIndex + 1;
    const oneLineCoachTip = syllables.length > 1
      ? `Nhấn mạnh âm tiết thứ ${humanOrder}: ${formattedSyllables} (${articulationTip})`
      : `Bật rõ khẩu hình từ: ${primaryToken.toUpperCase()} (${articulationTip})`;

    const result = {
      word: primaryToken,
      syllables,
      stressIndex,
      formattedSyllables,
      articulationTip,
      oneLineCoachTip
    };

    if (!this.phoneticCoachCache) this.phoneticCoachCache = {};
    this.phoneticCoachCache[primaryToken] = result;
    this.savePhoneticCoachCache();
    return result;
  }

  async fetchAIPhoneticCoachTip(q, mispronouncedWord, spokenText, onUpdate) {
    const cleanWord = String(mispronouncedWord || (q && (q.voiceTargetWord || q.target_word)) || 'sustainable').trim();
    const key = cleanWord.toLowerCase();
    try {
      if (typeof fetch !== 'function') return null;
      const res = await fetch('/api/phonetic-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord: cleanWord,
          targetPhrase: (q && q.voicePhrase) || cleanWord,
          phonetic: (q && q.phonetic) || '',
          spokenText: String(spokenText || '')
        })
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      if (data && data.oneLineCoachTip && data.formattedSyllables) {
        const enriched = {
          word: key,
          syllables: Array.isArray(data.syllables) ? data.syllables : [key],
          stressIndex: typeof data.stressIndex === 'number' ? data.stressIndex : 0,
          formattedSyllables: data.formattedSyllables,
          articulationTip: data.articulationTip || '',
          oneLineCoachTip: data.oneLineCoachTip
        };
        if (!this.phoneticCoachCache) this.phoneticCoachCache = {};
        this.phoneticCoachCache[key] = enriched;
        this.savePhoneticCoachCache();
        if (typeof onUpdate === 'function') {
          onUpdate(enriched);
        }
        return enriched;
      }
    } catch (e) {}
    return null;
  }

  loadCustomExamBank() {
    try {
      const saved = localStorage.getItem('ielts_custom_exam_bank');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.slice(0, 60) : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomExamBank() {
    try {
      const capped = Array.isArray(this.customExamBank) ? this.customExamBank.slice(0, 60) : [];
      this.customExamBank = capped;
      localStorage.setItem('ielts_custom_exam_bank', JSON.stringify(capped));
    } catch (e) {}
  }

  loadSavedExamsHistory() {
    try {
      const saved = localStorage.getItem('ielts_saved_exams_meta_v1');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  saveSavedExamsHistory() {
    try {
      const list = Array.isArray(this.savedExamsHistory) ? this.savedExamsHistory.slice(0, 15) : [];
      this.savedExamsHistory = list;
      localStorage.setItem('ielts_saved_exams_meta_v1', JSON.stringify(list));
    } catch (e) {}
  }

  loadSavedExamPhotos() {
    try {
      const saved = localStorage.getItem('ielts_saved_exam_photos_v1');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  saveSavedExamPhotos() {
    if (!Array.isArray(this.savedExamPhotos)) {
      this.savedExamPhotos = [];
    }
    // Giữ tối đa 12 ảnh gần nhất và tự động giảm bớt nếu vượt bộ nhớ localStorage
    while (this.savedExamPhotos.length > 12) {
      this.savedExamPhotos.shift();
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        localStorage.setItem('ielts_saved_exam_photos_v1', JSON.stringify(this.savedExamPhotos));
        return;
      } catch (quotaErr) {
        if (this.savedExamPhotos.length > 1) {
          this.savedExamPhotos.shift();
        } else {
          break;
        }
      }
    }
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

  getDefaultDailyQuests() {
    return [
      {
        id: 'quest_correct_5',
        icon: '🎯',
        title: 'Khởi động chuẩn xác',
        desc: 'Trả lời đúng 5 câu hỏi bất kỳ',
        target: 5,
        progress: 0,
        rewardXP: 150,
        claimed: false,
        actionFilter: 'all'
      },
      {
        id: 'quest_minigame_3',
        icon: '🧩',
        title: 'Chinh phục Kho Trò Chơi',
        desc: 'Hoàn thành 3 câu Xếp câu, Nghe hoặc Phát âm',
        target: 3,
        progress: 0,
        rewardXP: 200,
        claimed: false,
        actionFilter: 'voice_check'
      },
      {
        id: 'quest_combo_3',
        icon: '⚡',
        title: 'Chuỗi phản xạ thần tốc',
        desc: 'Đạt chuỗi Combo 3x trở lên trong ngày',
        target: 3,
        progress: 0,
        rewardXP: 250,
        claimed: false,
        actionFilter: 'part5_speed'
      }
    ];
  }

  loadDailyTracker() {
    const todayKey = this.getTodayDateKey();
    const defaultTracker = {
      dateKey: todayKey,
      todayCount: 0,
      dailyGoal: 30,
      streakDays: 1,
      lastActiveDate: todayKey,
      activeDaysHistory: [todayKey],
      quests: this.getDefaultDailyQuests()
    };
    try {
      const saved = localStorage.getItem('ielts_daily_tracker');
      if (!saved) return defaultTracker;
      const parsed = JSON.parse(saved);
      const dailyGoal = Number(parsed.dailyGoal) || 30;
      let streakDays = Math.max(1, Number(parsed.streakDays) || 1);
      let todayCount = Number(parsed.todayCount) || 0;
      let activeDaysHistory = Array.isArray(parsed.activeDaysHistory) ? [...parsed.activeDaysHistory] : [todayKey];
      let quests = Array.isArray(parsed.quests) && parsed.quests.length === 3
        ? parsed.quests
        : this.getDefaultDailyQuests();

      if (parsed.dateKey !== todayKey) {
        if (parsed.dateKey === this.getYesterdayDateKey() && todayCount > 0) {
          streakDays += 1;
        } else if (parsed.dateKey !== this.getYesterdayDateKey()) {
          streakDays = 1;
        }
        todayCount = 0;
        quests = this.getDefaultDailyQuests();
      }

      if (!activeDaysHistory.includes(todayKey)) {
        activeDaysHistory.push(todayKey);
      }
      if (activeDaysHistory.length > 14) {
        activeDaysHistory = activeDaysHistory.slice(-14);
      }

      return {
        dateKey: todayKey,
        todayCount,
        dailyGoal,
        streakDays,
        lastActiveDate: todayKey,
        activeDaysHistory,
        quests
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

  recordDailyAnswer(explicitIsCorrect) {
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
      this.dailyTracker.quests = this.getDefaultDailyQuests();
    }
    this.dailyTracker.todayCount += 1;

    if (!Array.isArray(this.dailyTracker.activeDaysHistory)) {
      this.dailyTracker.activeDaysHistory = [];
    }
    if (!this.dailyTracker.activeDaysHistory.includes(todayKey)) {
      this.dailyTracker.activeDaysHistory.push(todayKey);
    }

    const isCorrect = typeof explicitIsCorrect === 'boolean'
      ? explicitIsCorrect
      : (this.roundResults.length > 0 ? Boolean(this.roundResults[this.roundResults.length - 1]) : false);

    const currentQ = this.questions && this.questions[this.currentIndex];
    const isMiniGame = Boolean(
      (currentQ && (currentQ.mode === 'sentence_order' || currentQ.mode === 'voice_check' || currentQ.isAudioQuiz || currentQ.isVoiceCheck)) ||
      ['sentence_order', 'audio', 'voice_check'].includes(this.currentGradeFilter)
    );

    if (!Array.isArray(this.dailyTracker.quests) || this.dailyTracker.quests.length === 0) {
      this.dailyTracker.quests = this.getDefaultDailyQuests();
    }

    this.dailyTracker.quests.forEach(quest => {
      if (!quest) return;
      if (quest.id === 'quest_correct_5' && isCorrect) {
        quest.progress = Math.min(quest.target, (quest.progress || 0) + 1);
      } else if (quest.id === 'quest_minigame_3' && isMiniGame && isCorrect) {
        quest.progress = Math.min(quest.target, (quest.progress || 0) + 1);
      } else if (quest.id === 'quest_combo_3') {
        const bestCombo = Math.max(this.streak || 0, this.maxStreak || 0);
        quest.progress = Math.min(quest.target, Math.max(quest.progress || 0, bestCombo));
      }
    });

    this.saveDailyTracker();
    this.updateDailyTrackerUI();
  }

  claimDailyQuest(questId) {
    if (!this.dailyTracker || !Array.isArray(this.dailyTracker.quests)) return 0;
    const quest = this.dailyTracker.quests.find(q => q && q.id === questId);
    if (!quest || quest.claimed || (quest.progress || 0) < quest.target) return 0;

    quest.claimed = true;
    const reward = Number(quest.rewardXP) || 150;
    this.score += reward;
    this.updateScoreUI();
    this.saveDailyTracker();
    this.updateDailyTrackerUI();
    this.renderDailyQuestModal();

    if (typeof soundEngine !== 'undefined' && typeof soundEngine.playQuestClaim === 'function') {
      soundEngine.playQuestClaim();
    } else if (typeof soundEngine !== 'undefined') {
      soundEngine.playVictory();
    }
    this.triggerHaptic('success');
    this.launchConfetti();
    return reward;
  }

  openDailyQuestModal() {
    this.closeSettingsMenu();
    this.closeMiniGamesMenu();
    this.updateDailyTrackerUI();
    this.renderDailyQuestModal();
    if (this.dailyQuestModalOverlay && this.dailyQuestModalOverlay.classList) {
      this.dailyQuestModalOverlay.classList.add('active');
    }
  }

  closeDailyQuestModal() {
    if (this.dailyQuestModalOverlay && this.dailyQuestModalOverlay.classList) {
      this.dailyQuestModalOverlay.classList.remove('active');
    }
  }

  renderDailyQuestModal() {
    if (!this.dailyTracker) this.dailyTracker = this.loadDailyTracker();
    const { streakDays, todayCount, activeDaysHistory, quests } = this.dailyTracker;

    if (this.questModalStreakTitle) {
      this.questModalStreakTitle.textContent = `Chuỗi ${streakDays} ngày liên tiếp`;
    }
    if (this.questModalStreakSub) {
      this.questModalStreakSub.textContent = `Hôm nay đã luyện ${todayCount} câu • Hoàn thành nhiệm vụ để nhận thưởng XP!`;
    }

    // Render 7-day calendar strip (T2 -> CN)
    if (this.streakWeekStrip) {
      const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
      const now = new Date();
      const jsDay = now.getDay(); // 0 = Sun, 1 = Mon ...
      const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
      const activeSet = new Set(Array.isArray(activeDaysHistory) ? activeDaysHistory : []);
      const todayKey = this.getTodayDateKey();

      let weekHtml = '';
      for (let i = 0; i < 7; i++) {
        const d = new Date(now.getTime() + (mondayOffset + i) * 86400000);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const dKey = `${y}-${m}-${dayNum}`;
        const isToday = dKey === todayKey;
        const isActive = activeSet.has(dKey) || (isToday && todayCount > 0);
        weekHtml += `
          <div class="week-day-pill${isActive ? ' active-day' : ''}${isToday ? ' is-today' : ''}">
            <span>${dayLabels[i]}</span>
            <span class="week-day-icon">${isActive ? '🔥' : '⚪'}</span>
          </div>
        `;
      }
      this.streakWeekStrip.innerHTML = weekHtml;
    }

    const questList = Array.isArray(quests) ? quests : this.getDefaultDailyQuests();
    const completedCount = questList.filter(q => (q.progress || 0) >= q.target).length;
    if (this.questCompletedCounter) {
      this.questCompletedCounter.textContent = `${completedCount}/${questList.length} hoàn thành`;
    }

    if (this.dailyQuestsList) {
      this.dailyQuestsList.innerHTML = '';
      questList.forEach(quest => {
        const prog = Math.min(quest.target, quest.progress || 0);
        const isDone = prog >= quest.target;
        const isClaimed = Boolean(quest.claimed);
        const pct = Math.min(100, Math.round((prog / Math.max(1, quest.target)) * 100));

        const card = document.createElement('div');
        card.className = `quest-item-card${isDone && !isClaimed ? ' quest-ready' : ''}${isClaimed ? ' quest-claimed' : ''}`;

        let btnText = 'Làm ngay ➔';
        let btnClass = 'btn-quest-action';
        if (isClaimed) {
          btnText = '✓ Đã nhận';
          btnClass = 'btn-quest-action claimed';
        } else if (isDone) {
          btnText = `🎁 Nhận +${quest.rewardXP} XP`;
          btnClass = 'btn-quest-action claimable';
        }

        card.innerHTML = `
          <div class="quest-item-top">
            <div class="quest-item-left">
              <div class="quest-item-icon">${quest.icon || '🎯'}</div>
              <div class="quest-item-texts">
                <div class="quest-item-title">${quest.title}</div>
                <div class="quest-item-desc">${quest.desc}</div>
              </div>
            </div>
            <span class="quest-reward-tag">+${quest.rewardXP} XP</span>
          </div>
          <div class="quest-item-bottom">
            <div class="quest-bar-wrap">
              <div class="quest-bar-track">
                <div class="quest-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <span class="quest-bar-num">${prog}/${quest.target}</span>
            </div>
            <button type="button" class="${btnClass}" data-quest-id="${quest.id}">${btnText}</button>
          </div>
        `;

        const actionBtn = card.querySelector ? card.querySelector('.btn-quest-action') : null;
        if (actionBtn) {
          actionBtn.addEventListener('click', () => {
            if (isClaimed) return;
            if (isDone) {
              this.claimDailyQuest(quest.id);
            } else {
              this.triggerHaptic('light');
              this.closeDailyQuestModal();
              if (quest.actionFilter && quest.actionFilter !== this.currentGradeFilter) {
                this.setGradeFilter(quest.actionFilter);
              }
            }
          });
        }

        this.dailyQuestsList.appendChild(card);
      });
    }
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
    const { todayCount, dailyGoal, streakDays, quests } = this.dailyTracker;
    if (this.headerStreakDaysEl) {
      this.headerStreakDaysEl.textContent = String(streakDays || 1);
    }
    const hasClaimable = Array.isArray(quests) && quests.some(q => q && !q.claimed && (q.progress || 0) >= q.target);
    if (this.headerQuestNotifyDot) {
      this.headerQuestNotifyDot.style.display = hasClaimable ? 'block' : 'none';
    }
    if (this.btnDailyStreakHeader && this.btnDailyStreakHeader.classList) {
      this.btnDailyStreakHeader.classList.toggle('has-claimable', Boolean(hasClaimable));
    }
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
    this.triggerHaptic('light');
    this.updateAutoNextUI();
    if (!this.autoNextEnabled && this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    } else if (
      this.autoNextEnabled &&
      this.feedbackDrawer &&
      this.feedbackDrawer.classList &&
      this.feedbackDrawer.classList.contains('active') &&
      this.feedbackDrawer.classList.contains('correct-state') &&
      this.hearts > 0 &&
      this.currentIndex < this.questions.length - 1
    ) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = setTimeout(() => {
        if (this.feedbackDrawer && this.feedbackDrawer.classList.contains('active')) {
          this.nextQuestion();
        }
      }, 900);
    }
  }

  updateAutoNextUI() {
    if (!this.btnAutoNextToggle) return;
    if (this.btnAutoNextToggle.classList) {
      this.btnAutoNextToggle.classList.toggle('active', this.autoNextEnabled);
    }
    this.btnAutoNextToggle.innerHTML = `<span>Auto Next</span>`;
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

    // Audio Quiz Panel & Phân loại theo lớp cho Luyện Nghe
    this.audioQuizPanel = document.getElementById('audio-quiz-panel');
    this.audioGradeFilterBar = document.getElementById('audio-grade-filter-bar');
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
    this.btnSentenceOrderMode = document.getElementById('btn-sentence-order-mode');
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

    // AI Exam Importer Modal, Camera Capture & Haptic Switch
    this.btnExamImport = document.getElementById('btn-exam-import');
    this.examImportModalOverlay = document.getElementById('exam-import-modal-overlay');
    this.btnExamImportClose = document.getElementById('btn-exam-import-close');
    this.btnOpenExamCamera = document.getElementById('btn-open-exam-camera');
    this.inputExamCamera = document.getElementById('input-exam-camera');
    this.examCameraPanel = document.getElementById('exam-camera-panel');
    this.examCameraVideo = document.getElementById('exam-camera-video');
    this.cameraVideoWrapper = document.getElementById('camera-video-wrapper');
    this.cameraLensSelector = document.getElementById('camera-lens-selector');
    this.cameraHardwareDevicesBar = document.getElementById('camera-hardware-devices-bar');
    this.cameraActiveLensBadge = document.getElementById('camera-active-lens-badge');
    this.btnCameraTorch = document.getElementById('btn-camera-torch');
    this.btnOpenNativeCamFallback = document.getElementById('btn-open-native-cam-fallback');
    this.cameraFocusReticle = document.getElementById('camera-focus-reticle');
    this.cameraShutterFlash = document.getElementById('camera-shutter-flash');
    this.cameraHintToast = document.getElementById('camera-hint-toast');
    this.btnSwitchCamera = document.getElementById('btn-switch-camera');
    this.btnSnapExamPhoto = document.getElementById('btn-snap-exam-photo');
    this.btnCloseCamera = document.getElementById('btn-close-camera');
    this.cameraStream = null;
    this.cameraFacingMode = 'environment';
    this.cameraDevices = [];
    this.currentCameraDeviceId = null;
    this.currentCameraLens = 'wide';
    this.digitalCropZoom = 1.0;
    this.cameraTorchOn = false;
    this.examDropzone = document.getElementById('exam-dropzone');
    this.inputExamFile = document.getElementById('input-exam-file');
    this.examSelectedFilePill = document.getElementById('exam-selected-file-pill');
    this.examSelectedFileName = document.getElementById('exam-selected-file-name');
    this.btnClearExamFile = document.getElementById('btn-clear-exam-file');
    this.examPhotoGallerySection = document.getElementById('exam-photo-gallery-section');
    this.examPhotoCountBadge = document.getElementById('exam-photo-count-badge');
    this.examPhotoGalleryList = document.getElementById('exam-photo-gallery-list');
    this.btnAddMorePhoto = document.getElementById('btn-add-more-photo');
    this.btnClearSavedPhotos = document.getElementById('btn-clear-saved-photos');
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

    // Mini Games Menu (Gom Sắp xếp câu, Luyện nghe, Luyện phát âm & các game mới sau này)
    this.miniGamesMenuWrapper = document.getElementById('mini-games-menu-wrapper');
    this.btnMiniGamesToggle = document.getElementById('btn-mini-games-toggle');
    this.miniGamesDropdownMenu = document.getElementById('mini-games-dropdown-menu');
    this.btnVoiceCheckMode = document.getElementById('btn-voice-check-mode');
    this.badgeGameSentenceOrder = document.getElementById('badge-game-sentence-order');
    this.badgeGameAudioQuiz = document.getElementById('badge-game-audio-quiz');
    this.badgeGameVoiceCheck = document.getElementById('badge-game-voice-check');

    // Daily Quests & Streak Header + Modal
    this.btnDailyStreakHeader = document.getElementById('btn-daily-streak-header');
    this.headerStreakDaysEl = document.getElementById('header-streak-days');
    this.headerQuestNotifyDot = document.getElementById('header-quest-notify-dot');
    this.dailyQuestModalOverlay = document.getElementById('daily-quest-modal-overlay');
    this.btnDailyQuestClose = document.getElementById('btn-daily-quest-close');
    this.questModalStreakTitle = document.getElementById('quest-modal-streak-title');
    this.questModalStreakSub = document.getElementById('quest-modal-streak-sub');
    this.streakWeekStrip = document.getElementById('streak-week-strip');
    this.questCompletedCounter = document.getElementById('quest-completed-counter');
    this.dailyQuestsList = document.getElementById('daily-quests-list');
    this.btnQuestContinue = document.getElementById('btn-quest-continue');

    // Header actions & Settings Menu
    this.settingsMenuWrapper = document.getElementById('settings-menu-wrapper');
    this.btnSettingsToggle = document.getElementById('btn-settings-toggle');
    this.settingsDropdownMenu = document.getElementById('settings-dropdown-menu');
    this.settingsSoundBadge = document.getElementById('settings-sound-badge');
    this.settingsHapticBadge = document.getElementById('settings-haptic-badge');
    this.settingsThemeBadge = document.getElementById('settings-theme-badge');
    this.btnThemeToggle = document.getElementById('btn-theme-toggle');
    this.themeIconSvg = document.getElementById('theme-icon-svg');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIconSvg = document.getElementById('sound-icon-svg');
    this.btnHapticToggle = document.getElementById('btn-haptic-toggle');
    this.hapticIconSvg = document.getElementById('haptic-icon-svg');
    this.btnViewToggle = document.getElementById('btn-view-toggle');
  }

  bindEvents() {
    if (this.btnDailyStreakHeader) {
      this.btnDailyStreakHeader.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.openDailyQuestModal();
      });
    }
    if (this.btnDailyQuestClose) {
      this.btnDailyQuestClose.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.closeDailyQuestModal();
      });
    }
    if (this.btnQuestContinue) {
      this.btnQuestContinue.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.closeDailyQuestModal();
      });
    }
    if (this.dailyQuestModalOverlay) {
      this.dailyQuestModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.dailyQuestModalOverlay) this.closeDailyQuestModal();
      });
    }
    if (this.btnMiniGamesToggle) {
      this.btnMiniGamesToggle.addEventListener('click', (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.triggerHaptic('light');
        this.closeSettingsMenu();
        this.toggleMiniGamesMenu();
      });
    }
    if (this.btnSettingsToggle) {
      this.btnSettingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerHaptic('light');
        this.closeMiniGamesMenu();
        this.toggleSettingsMenu();
      });
    }
    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('click', (e) => {
        if (this.settingsMenuWrapper && this.settingsDropdownMenu && this.settingsDropdownMenu.classList && this.settingsDropdownMenu.classList.contains('open')) {
          if (typeof this.settingsMenuWrapper.contains === 'function' && !this.settingsMenuWrapper.contains(e.target)) {
            this.closeSettingsMenu();
          }
        }
        if (this.miniGamesMenuWrapper && this.miniGamesDropdownMenu && this.miniGamesDropdownMenu.classList && this.miniGamesDropdownMenu.classList.contains('open')) {
          if (typeof this.miniGamesMenuWrapper.contains === 'function' && !this.miniGamesMenuWrapper.contains(e.target)) {
            this.closeMiniGamesMenu();
          }
        }
      });
    }
    this.btnThemeToggle.addEventListener('click', (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      this.triggerHaptic('light');
      this.toggleTheme();
    });
    this.btnSoundToggle.addEventListener('click', (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      this.triggerHaptic('light');
      this.toggleSound();
    });
    if (this.btnHapticToggle) {
      this.btnHapticToggle.addEventListener('click', (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.toggleHaptic();
      });
    }
    if (this.btnViewToggle) {
      this.btnViewToggle.addEventListener('click', () => this.toggleViewMode());
    }
    if (this.btnSentenceOrderMode) {
      this.btnSentenceOrderMode.addEventListener('click', (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.triggerHaptic('light');
        this.closeMiniGamesMenu();
        this.toggleSentenceOrderMode();
      });
    }
    if (this.btnAudioQuizMode) {
      this.btnAudioQuizMode.addEventListener('click', (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.triggerHaptic('light');
        this.closeMiniGamesMenu();
        this.toggleAudioQuizMode();
      });
    }
    if (this.btnVoiceCheckMode) {
      this.btnVoiceCheckMode.addEventListener('click', (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.triggerHaptic('light');
        this.closeMiniGamesMenu();
        this.toggleVoiceCheckMode();
      });
    }
    if (this.btnMasteryStats) {
      this.btnMasteryStats.addEventListener('click', () => {
        this.closeSettingsMenu();
        this.openMasteryModal();
      });
    }
    if (this.dailyGoalPill) {
      this.dailyGoalPill.addEventListener('click', () => this.openDailyQuestModal());
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

    if (this.audioGradeFilterBar && this.audioGradeFilterBar.querySelectorAll) {
      const audioChips = this.audioGradeFilterBar.querySelectorAll('.audio-grade-chip');
      audioChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          this.triggerHaptic('light');
          const gKey = (chip && typeof chip.getAttribute === 'function') ? (chip.getAttribute('data-audio-grade') || 'all') : 'all';
          this.setAudioGradeFilter(gKey);
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

    // Mở khóa Web Audio Context & Kênh Media Playback (phát tiếng ngay cả khi gạt nút Tắt chuông điện thoại)
    const unlockAudio = () => {
      soundEngine.init();
      if (typeof soundEngine.unlockMediaChannel === 'function') {
        soundEngine.unlockMediaChannel();
      }
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    document.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
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

        if (q.mode === 'sentence_order' && !q.isAudioQuiz) {
          if (e.key === 'Backspace') {
            const undoBtn = document.getElementById('btn-sentence-undo');
            if (undoBtn && undoBtn.click) undoBtn.click();
            return;
          }
          if (e.key === 'Escape') {
            const clearBtn = document.getElementById('btn-sentence-clear');
            if (clearBtn && clearBtn.click) clearBtn.click();
            return;
          }
          const numIdx = parseInt(e.key, 10) - 1;
          if (!isNaN(numIdx) && numIdx >= 0 && numIdx < 8 && this.answersContainer && this.answersContainer.querySelectorAll) {
            const tiles = Array.from(this.answersContainer.querySelectorAll('.word-order-tile-btn'));
            if (tiles[numIdx] && !tiles[numIdx].disabled && (!tiles[numIdx].classList || !tiles[numIdx].classList.contains('used'))) {
              if (tiles[numIdx].click) tiles[numIdx].click();
            }
          }
          return;
        }

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

  toggleMiniGamesMenu() {
    if (!this.miniGamesDropdownMenu || !this.miniGamesDropdownMenu.classList) return;
    const isOpen = this.miniGamesDropdownMenu.classList.toggle('open');
    if (this.btnMiniGamesToggle && this.btnMiniGamesToggle.classList) {
      this.btnMiniGamesToggle.classList.toggle('active-gear', isOpen);
      if (typeof this.btnMiniGamesToggle.setAttribute === 'function') {
        this.btnMiniGamesToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    }
    if (typeof this.miniGamesDropdownMenu.setAttribute === 'function') {
      this.miniGamesDropdownMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
  }

  closeMiniGamesMenu() {
    if (!this.miniGamesDropdownMenu || !this.miniGamesDropdownMenu.classList) return;
    this.miniGamesDropdownMenu.classList.remove('open');
    if (typeof this.miniGamesDropdownMenu.setAttribute === 'function') {
      this.miniGamesDropdownMenu.setAttribute('aria-hidden', 'true');
    }
    if (this.btnMiniGamesToggle && this.btnMiniGamesToggle.classList) {
      this.btnMiniGamesToggle.classList.remove('active-gear');
      if (typeof this.btnMiniGamesToggle.setAttribute === 'function') {
        this.btnMiniGamesToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  toggleSettingsMenu() {
    if (!this.settingsDropdownMenu || !this.settingsDropdownMenu.classList) return;
    const isOpen = this.settingsDropdownMenu.classList.toggle('open');
    if (this.btnSettingsToggle && this.btnSettingsToggle.classList) {
      this.btnSettingsToggle.classList.toggle('active-gear', isOpen);
      if (typeof this.btnSettingsToggle.setAttribute === 'function') {
        this.btnSettingsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    }
    if (typeof this.settingsDropdownMenu.setAttribute === 'function') {
      this.settingsDropdownMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
  }

  closeSettingsMenu() {
    if (!this.settingsDropdownMenu || !this.settingsDropdownMenu.classList) return;
    this.settingsDropdownMenu.classList.remove('open');
    if (typeof this.settingsDropdownMenu.setAttribute === 'function') {
      this.settingsDropdownMenu.setAttribute('aria-hidden', 'true');
    }
    if (this.btnSettingsToggle && this.btnSettingsToggle.classList) {
      this.btnSettingsToggle.classList.remove('active-gear');
      if (typeof this.btnSettingsToggle.setAttribute === 'function') {
        this.btnSettingsToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  updateThemeIcon(isLight) {
    if (this.settingsThemeBadge) {
      this.settingsThemeBadge.textContent = isLight ? 'Sáng ☀️' : 'Tối 🌙';
    }
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
    if (this.settingsSoundBadge) {
      this.settingsSoundBadge.textContent = isMuted ? 'Tắt 🔇' : 'Bật 🔊';
    }
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
    if (!this.currentGradeFilter || this.currentGradeFilter === 'all') {
      return [...IELTS_VOCAB_BANK];
    }
    // Phần Luyện Nghe có phân loại theo Lớp (Lớp 6 -> Lớp 12, TOEIC, IELTS 7+)
    if (this.currentGradeFilter === 'audio') {
      const subFilter = this.audioGradeFilter || 'all';
      if (subFilter === 'all') {
        return [...IELTS_VOCAB_BANK];
      }
      let audioPool = [];
      if (subFilter.startsWith('g')) {
        const gNum = parseInt(subFilter.replace('g', ''), 10);
        audioPool = IELTS_VOCAB_BANK.filter(q => q.grade === gNum);
      } else if (subFilter === 'toeic') {
        audioPool = IELTS_VOCAB_BANK.filter(q => q.category === 'toeic' || q.topic_category === 'toeic' || (q.id && q.id.startsWith('toeic_')));
      } else if (['toeic400', 'toeic500', 'toeic600', 'toeic700'].includes(subFilter)) {
        audioPool = IELTS_VOCAB_BANK.filter(q => q.toeic_tier === subFilter);
      } else if (subFilter === 'band7') {
        audioPool = IELTS_VOCAB_BANK.filter(q => parseFloat(q.band) >= 7.0);
      } else if (subFilter === 'ielts') {
        audioPool = IELTS_VOCAB_BANK.filter(q => q.category !== 'toeic' && q.topic_category !== 'toeic' && (!q.id || !q.id.startsWith('toeic_')));
      }
      return audioPool.length > 0 ? audioPool : [...IELTS_VOCAB_BANK];
    }
    if (this.currentGradeFilter === 'custom_exam') {
      if (this.customExamBank && this.customExamBank.length > 0) {
        return this.customExamBank.slice(0, 60).map((q, idx) => {
          const normalizedMode = (q.mode === 'letter_fill' && q.sentence) ? 'sentence_cloze' : (q.mode || 'sentence_cloze');
          const base = {
            ...q,
            category: 'custom_exam',
            is_custom_exam: true,
            exam_verbatim: true,
            mode: normalizedMode
          };
          if (normalizedMode === 'sentence_order' && (!Array.isArray(base.wordChunks) || base.wordChunks.length === 0)) {
            return this.buildSentenceOrderVariant(base, idx);
          }
          return base;
        });
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

  buildSentenceOrderVariant(baseQ, idx) {
    const correctOpt = (baseQ.options && baseQ.options[baseQ.correct]) || baseQ.target_word || '';
    const targetWord = String(baseQ.target_word || correctOpt || 'vocabulary').trim();
    const cleanTarget = targetWord.replace(/^to\s+/i, '').trim();
    let rawSentence = '';

    if (baseQ.sentence && /_{2,}/.test(baseQ.sentence)) {
      rawSentence = String(baseQ.sentence).replace(/_{2,}/g, correctOpt).trim();
    } else if (baseQ.real_exam_sentence) {
      rawSentence = String(baseQ.real_exam_sentence).trim();
    } else if (baseQ.sentence) {
      rawSentence = String(baseQ.sentence).trim();
    } else {
      rawSentence = `We should practice ${cleanTarget} every day.`;
    }

    // Dọn dẹp khoảng trắng thừa & ngoặc kép
    rawSentence = rawSentence.replace(/^["'“”]+|["'“”]+$/g, '').replace(/\s+/g, ' ').trim();

    // Tách dấu câu cuối cùng (., !, ?)
    let sentencePunctuation = '.';
    const punctMatch = rawSentence.match(/([.!?]+)$/);
    if (punctMatch) {
      sentencePunctuation = punctMatch[1].charAt(0);
      rawSentence = rawSentence.slice(0, -punctMatch[0].length).trim();
    }

    // Giảm độ khó câu: Nếu câu gốc dài (> 8 từ) và không phải đề thi nguyên bản, rút gọn về mệnh đề ngắn (4-8 từ) hoặc câu mẫu ngắn gọn dễ ghép
    const targetLower = cleanTarget.toLowerCase();
    let words = rawSentence.split(/\s+/).filter(Boolean);

    if (words.length > 8 && /[,;]/.test(rawSentence)) {
      const clauses = rawSentence.split(/[,;]/).map(c => c.trim()).filter(Boolean);
      const shortClause = clauses.find(c => {
        const wLen = c.split(/\s+/).length;
        return targetLower && c.toLowerCase().includes(targetLower) && wLen >= 4 && wLen <= 8;
      });
      if (shortClause) {
        rawSentence = shortClause.charAt(0).toUpperCase() + shortClause.slice(1);
        words = rawSentence.split(/\s+/).filter(Boolean);
      }
    }

    let chunks = [];
    // Nếu câu vẫn dài hơn 8 từ (câu học thuật phức tạp), tạo câu ngắn 4 cụm từ cực dễ hiểu xoay quanh từ mục tiêu
    if (words.length > 8 && !baseQ.is_custom_exam && baseQ.category !== 'custom_exam') {
      const pos = this.getWordPOS(cleanTarget, baseQ);
      if (pos === '(v)' || pos === '(v.phr)') {
        chunks = ['We should', cleanTarget.toLowerCase(), 'this important task', 'every day'];
      } else if (pos === '(adj)') {
        chunks = ['This is', `a very ${cleanTarget.toLowerCase()}`, 'solution for', 'our team'];
      } else if (pos === '(adv)') {
        chunks = ['Our team', 'completed the work', cleanTarget.toLowerCase(), 'yesterday'];
      } else if (pos === '(prep)') {
        const tIdx = words.findIndex(w => w.toLowerCase().replace(/[^a-z]/g, '') === targetLower);
        if (tIdx >= 0) {
          const start = Math.max(0, Math.min(words.length - 6, tIdx - 2));
          const subWords = words.slice(start, start + 6);
          if (subWords.length > 0) {
            subWords[0] = subWords[0].charAt(0).toUpperCase() + subWords[0].slice(1);
            words = subWords;
          }
        }
      } else {
        chunks = ['Our team', 'Always needs', cleanTarget.toLowerCase(), 'for success'];
        chunks[1] = 'always needs';
      }
    }

    // Nếu chưa có chunks cố định, gom các từ trong câu thành TỐI ĐA 4 MẢNH GHÉP (4 chunks) ngắn gọn, dễ nhìn
    if (chunks.length === 0) {
      chunks = [...words];
      while (chunks.length > 4) {
        let minPairIdx = 0;
        let minLen = Infinity;
        for (let j = 0; j < chunks.length - 1; j++) {
          const combinedLen = chunks[j].length + chunks[j + 1].length;
          if (combinedLen < minLen) {
            minLen = combinedLen;
            minPairIdx = j;
          }
        }
        chunks.splice(minPairIdx, 2, `${chunks[minPairIdx]} ${chunks[minPairIdx + 1]}`);
      }
    }

    let shuffledChunks = shuffleArray([...chunks]);
    if (chunks.length > 1 && shuffledChunks.join(' ') === chunks.join(' ')) {
      shuffledChunks = [...chunks.slice(1), chunks[0]];
    }

    return {
      ...baseQ,
      isSentenceOrder: true,
      mode: 'sentence_order',
      targetSentence: `${chunks.join(' ')}${sentencePunctuation}`,
      sentencePunctuation,
      wordChunks: chunks,
      shuffledChunks,
      prompt: '🧩 Chạm các cụm từ để ghép thành câu tiếng Anh hoàn chỉnh:'
    };
  }

  buildVoiceCheckVariant(baseQ, idx) {
    const correctOpt = (baseQ.options && baseQ.options[baseQ.correct]) || baseQ.target_word || '';
    const targetWord = String(baseQ.target_word || correctOpt || 'vocabulary').trim();
    const cleanTarget = targetWord.replace(/^to\s+/i, '').trim();
    const pos = this.getWordPOS(cleanTarget, baseQ);

    let voicePhrase = '';
    if (pos === '(v)' || pos === '(v.phr)') {
      voicePhrase = `We should ${cleanTarget.toLowerCase()} every day`;
    } else if (pos === '(adj)') {
      voicePhrase = `This is a ${cleanTarget.toLowerCase()} solution`;
    } else if (pos === '(adv)') {
      voicePhrase = `They work ${cleanTarget.toLowerCase()} together`;
    } else {
      voicePhrase = `We need ${cleanTarget.toLowerCase()} for success`;
    }

    const voiceTokens = voicePhrase.split(/\s+/).filter(Boolean);
    const coachMeta = this.analyzeWordSyllablesAndTip(cleanTarget, baseQ.phonetic || '');

    return {
      ...baseQ,
      isVoiceCheck: true,
      mode: 'voice_check',
      voiceTargetWord: cleanTarget,
      voicePhrase,
      voiceTokens,
      voiceSyllables: coachMeta.syllables,
      voiceStressIndex: coachMeta.stressIndex,
      voiceFormattedSyllables: coachMeta.formattedSyllables,
      voiceCoachTip: coachMeta.oneLineCoachTip,
      prompt: '🎙️ Phát âm chuẩn từ vựng hoặc cụm từ ngắn dưới đây:'
    };
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

    // Nếu người học đang làm "Đề Thi Tự Nhập" (custom_exam):
    // Bê nguyên câu trong đề thành game (tối đa 60 câu/đề) + kết hợp thuật toán Adaptive ưu tiên các câu học sinh từng làm sai!
    if (this.currentGradeFilter === 'custom_exam' && this.customExamBank && this.customExamBank.length > 0) {
      const weakSet = new Set(this.weakWordIds || []);
      const adaptiveMissed = [];
      const regularOrder = [];

      workingPool.forEach(q => {
        const prof = this.getWordProfile(q);
        const srs = this.srsMatrix && this.srsMatrix[q.id];
        const hasFailedBefore = weakSet.has(q.id) || (prof && prof.failCount > 0) || (srs && srs.failCount > 0) || (q.adaptiveFailCount && q.adaptiveFailCount > 0);
        if (hasFailedBefore) {
          adaptiveMissed.push(q);
        } else {
          regularOrder.push(q);
        }
      });

      adaptiveMissed.sort((a, b) => this.calculatePriorityScore(b) - this.calculatePriorityScore(a));
      const combinedExamQueue = [...adaptiveMissed, ...regularOrder].slice(0, Math.min(workingPool.length, this.maxQuestionsPerExam || 60));
      combinedExamQueue.forEach(q => this.usedQuestionIds.add(q.id));
      this.saveUsedQuestionIds();
      return combinedExamQueue;
    }

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

    // Nếu người học đang chọn Game Sắp Xếp Từ Thành Câu (Sentence Builder)
    if (this.currentGradeFilter === 'sentence_order') {
      return selected.map((q, idx) => this.buildSentenceOrderVariant(q, idx));
    }

    // Nếu người học đang chọn Game Luyện Phát Âm Chấm Điểm Giọng Nói (Voice Check)
    if (this.currentGradeFilter === 'voice_check') {
      return selected.map((q, idx) => this.buildVoiceCheckVariant(q, idx));
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
    if (this.dailyQuestModalOverlay) this.dailyQuestModalOverlay.classList.remove('active');

    this.activeRoundTimeLimit = this.currentGradeFilter === 'part5_speed'
      ? 12.0
      : ((this.currentGradeFilter === 'sentence_order' || this.currentGradeFilter === 'voice_check') ? 30.0 : this.maxTimeSeconds);

    const pool = this.getFilteredBank();
    this.questions = this.generateAdaptiveQueue(pool);
    this.preloadUpcomingQuestions(0, 5);

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
    const qMeta = this.getOrPrecomputeQuestionMeta(q);
    this.preloadUpcomingQuestions(index + 1, 4);

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
      sentence_cloze: '✍️ Điền vào câu',
      sentence_order: '🧩 Sắp xếp câu',
      voice_check: '🎙️ Luyện phát âm'
    };
    
    if (q.isAudioQuiz) {
      this.modeBadge.innerHTML = `🎧 Luyện Nghe AI`;
      this.modeBadge.style.background = `rgba(56, 189, 248, 0.22)`;
      this.modeBadge.style.color = `#38bdf8`;
    } else if (q.mode === 'voice_check' || q.isVoiceCheck) {
      this.modeBadge.innerHTML = `🎙️ Luyện Phát Âm`;
      this.modeBadge.style.background = `rgba(16, 185, 129, 0.22)`;
      this.modeBadge.style.color = `#34d399`;
    } else if (q.isRecallVariant) {
      this.modeBadge.innerHTML = `🔁 Active Recall`;
      this.modeBadge.style.background = `rgba(236, 72, 153, 0.25)`;
      this.modeBadge.style.color = `#f472b6`;
    } else if (q.category === 'custom_exam' || q.is_custom_exam) {
      this.modeBadge.innerHTML = `📄 Câu Hỏi Đề Thi`;
      this.modeBadge.style.background = `rgba(16, 185, 129, 0.22)`;
      this.modeBadge.style.color = `#34d399`;
    } else {
      this.modeBadge.textContent = modeLabels[q.mode] || 'IELTS Quiz';
      this.modeBadge.style.background = `var(--bg-pill-glass)`;
      this.modeBadge.style.color = `var(--text-secondary)`;
    }

    // Hiển thị hình ảnh minh họa chì (đã được Preload & Decode sẵn từ bộ nhớ đệm)
    let hasVisibleVocabImage = false;
    if (this.vocabImageContainer && this.vocabImg) {
      const imgUrl = (qMeta && qMeta.imgUrl) || this.resolveQuestionImageUrl(q);
      if (imgUrl && q.mode !== 'voice_check') {
        if (this.vocabImg.src !== imgUrl) {
          this.vocabImg.src = imgUrl;
        }
        this.vocabImg.alt = q.target_word || 'Minh họa từ vựng';
        this.vocabImageContainer.style.display = 'flex';
        hasVisibleVocabImage = true;
      } else {
        this.vocabImageContainer.style.display = 'none';
        this.vocabImg.src = '';
      }
    }

    if (this.questionCard && this.questionCard.classList) {
      if (hasVisibleVocabImage) {
        this.questionCard.classList.add('has-image');
      } else {
        this.questionCard.classList.remove('has-image');
      }
      if (!q.isAudioQuiz && q.mode === 'letter_fill') {
        this.questionCard.classList.add('is-letter-fill');
      } else {
        this.questionCard.classList.remove('is-letter-fill');
      }
      if (!q.isAudioQuiz && q.mode === 'sentence_order') {
        this.questionCard.classList.add('is-sentence-order');
      } else {
        this.questionCard.classList.remove('is-sentence-order');
      }
      if (!q.isAudioQuiz && q.mode === 'voice_check') {
        this.questionCard.classList.add('is-voice-check');
      } else {
        this.questionCard.classList.remove('is-voice-check');
      }
    }

    if (this.letterBoxContainer && this.letterBoxContainer.classList) {
      if (!q.isAudioQuiz && q.mode === 'sentence_order') {
        this.letterBoxContainer.classList.add('sentence-order-tray');
      } else {
        this.letterBoxContainer.classList.remove('sentence-order-tray');
      }
      if (!q.isAudioQuiz && q.mode === 'voice_check') {
        this.letterBoxContainer.classList.add('voice-phrase-tray');
      } else {
        this.letterBoxContainer.classList.remove('voice-phrase-tray');
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
    } else if (q.mode === 'voice_check') {
      this.promptText.textContent = q.prompt || '🎙️ Phát âm chuẩn từ vựng hoặc cụm từ dưới đây:';
      this.letterBoxContainer.style.display = 'flex';
      const targetWord = q.voiceTargetWord || q.target_word || 'vocabulary';
      const phoneticStr = q.phonetic ? `<span class="voice-ipa-line">${q.phonetic}</span>` : '';
      this.questionMainText.innerHTML = `
        <span class="voice-word-hero">${targetWord}</span>
        ${phoneticStr}
        <span class="voice-vn-line">💡 “${q.vietnamese}”</span>
      `;
      this.renderInteractiveVoiceCheck(q);
    } else if (q.mode === 'sentence_order') {
      this.promptText.textContent = q.prompt || '🧩 Chạm các cụm từ để ghép thành câu đúng:';
      this.letterBoxContainer.style.display = 'flex';
      const targetWordHint = q.target_word ? `<strong class="sentence-hint-target">${q.target_word}</strong>: ` : '';
      this.questionMainText.innerHTML = `<span class="sentence-order-meaning-cue">💡 ${targetWordHint}“${q.vietnamese}”</span>`;
      this.renderInteractiveSentenceOrder(q);
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
      const highlightedSentence = (qMeta && qMeta.highlightedSentence) || q.sentence.replace(/_{2,}/g, '<span class="blank-slot">____</span>');
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
      } else if (q.mode === 'voice_check') {
        this.academicHintPill.innerHTML = `🎙️ Đạt ≥ 65% độ chuẩn để qua màn`;
      } else if (q.mode === 'sentence_order') {
        const chunkLen = Array.isArray(q.wordChunks) ? q.wordChunks.length : 5;
        this.academicHintPill.innerHTML = `🧩 Ghép ${chunkLen} cụm từ thành câu`;
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

    if (q.isAudioQuiz || q.mode === 'sentence_order' || q.mode === 'voice_check') {
      this.questionMainText.classList.add('text-scale-sm');
      return;
    }

    const rawText = (q.mode === 'letter_fill' || q.mode === 'meaning_match')
      ? String(q.vietnamese || '')
      : String(q.sentence || q.prompt || '');
    const len = rawText.length;

    if (hasImage) {
      if (len > 95) {
        this.questionMainText.classList.add('text-scale-xs');
      } else if (len > 55) {
        this.questionMainText.classList.add('text-scale-sm');
      } else {
        this.questionMainText.classList.add('text-scale-md');
      }
      return;
    }

    if (len > 125) {
      this.questionMainText.classList.add('text-scale-xs');
    } else if (len > 85) {
      this.questionMainText.classList.add('text-scale-sm');
    } else if (len > 42) {
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
      const letterBtns = Array.from(this.answersContainer.querySelectorAll('.letter-tile-btn') || []);
      const wordBtns = Array.from(this.answersContainer.querySelectorAll('.word-order-tile-btn') || []);
      const all = [...letterBtns, ...wordBtns];
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
      this.triggerHaptic('success');

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

      this.triggerHaptic('error');
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

  renderInteractiveSentenceOrder(q) {
    this.answersContainer.innerHTML = '';
    this.letterBoxContainer.innerHTML = '';

    const chunks = Array.isArray(q.wordChunks) && q.wordChunks.length > 0
      ? q.wordChunks
      : ['Students', 'should', 'practice', q.target_word || 'vocabulary', 'daily'];
    const shuffled = Array.isArray(q.shuffledChunks) && q.shuffledChunks.length === chunks.length
      ? q.shuffledChunks
      : shuffleArray([...chunks]);

    if (this.letterBoxContainer && this.letterBoxContainer.classList) {
      this.letterBoxContainer.classList.remove('word-len-short', 'word-len-medium', 'word-len-long', 'word-len-xlong');
      this.letterBoxContainer.classList.add('sentence-order-tray');
    }

    const slotBoxes = [];
    const updateActiveSlotHighlight = () => {
      let foundFirstEmpty = false;
      slotBoxes.forEach(s => {
        if (!s.classList) return;
        if (!foundFirstEmpty && s.classList.contains('empty')) {
          s.classList.add('active-next-slot');
          foundFirstEmpty = true;
        } else {
          s.classList.remove('active-next-slot');
        }
      });
    };

    chunks.forEach((chunkText, idx) => {
      const slot = document.createElement('div');
      slot.className = 'sentence-slot-box empty';
      slot.textContent = '___';
      if (!slot.dataset) slot.dataset = {};
      slot.dataset.slotIndex = String(idx);
      slot.dataset.placeholder = '___';
      slotBoxes.push(slot);

      slot.addEventListener('click', () => {
        if (this.isAnsweringLocked) return;
        if (slot.classList.contains('filled')) {
          this.triggerHaptic('light');
          const tileId = slot.dataset.tileId;
          slot.textContent = slot.dataset.placeholder || '___';
          slot.className = 'sentence-slot-box empty';
          delete slot.dataset.tileId;
          delete slot.dataset.chunkText;

          if (tileId) {
            const tileBtn = this.findTileButton(tileId);
            if (tileBtn) {
              tileBtn.classList.remove('used');
              tileBtn.disabled = false;
            }
          }
          updateActiveSlotHighlight();
          soundEngine.playTick(false);
        }
      });

      this.letterBoxContainer.appendChild(slot);
    });

    if (q.sentencePunctuation) {
      const punctEl = document.createElement('span');
      punctEl.className = 'sentence-punct-end';
      punctEl.textContent = q.sentencePunctuation;
      this.letterBoxContainer.appendChild(punctEl);
    }

    updateActiveSlotHighlight();

    const tilesContainer = document.createElement('div');
    tilesContainer.className = 'word-order-tiles-container';

    const tilesGrid = document.createElement('div');
    tilesGrid.className = 'word-order-tiles-grid';

    shuffled.forEach((chunkStr, idx) => {
      const tileBtn = document.createElement('button');
      tileBtn.type = 'button';
      tileBtn.className = 'word-order-tile-btn';
      tileBtn.innerHTML = `<span class="word-tile-text">${chunkStr}</span>`;
      if (!tileBtn.dataset) tileBtn.dataset = {};
      tileBtn.dataset.tileId = `word-tile-${idx}`;
      tileBtn.dataset.chunk = chunkStr;

      tileBtn.addEventListener('click', () => {
        if (this.isAnsweringLocked) return;
        const emptySlot = slotBoxes.find(s => s.classList.contains('empty'));
        if (!emptySlot) return;

        this.triggerHaptic('light');
        emptySlot.textContent = chunkStr;
        emptySlot.classList.remove('empty', 'active-next-slot');
        emptySlot.classList.add('filled');
        emptySlot.dataset.tileId = tileBtn.dataset.tileId;
        emptySlot.dataset.chunkText = chunkStr;

        tileBtn.classList.add('used');
        tileBtn.disabled = true;
        updateActiveSlotHighlight();
        soundEngine.playTick(false);

        const allFilled = slotBoxes.every(s => s.classList.contains('filled'));
        if (allFilled) {
          this.evaluateSentenceOrder(q, slotBoxes);
        }
      });

      this.attachTactileHaptics(tileBtn, 'light');
      tilesGrid.appendChild(tileBtn);
    });

    tilesContainer.appendChild(tilesGrid);

    // 2 Nút thao tác nhanh: Xóa từ vừa đặt (Undo) & Xóa hết (Clear)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'letter-fill-actions sentence-order-actions';

    const btnUndo = document.createElement('button');
    btnUndo.type = 'button';
    btnUndo.className = 'letter-action-btn';
    btnUndo.id = 'btn-sentence-undo';
    btnUndo.innerHTML = '⌫ Xóa từ';
    btnUndo.addEventListener('click', () => {
      if (this.isAnsweringLocked) return;
      this.triggerHaptic('light');
      const filledSlots = slotBoxes.filter(s => s.classList.contains('filled'));
      if (filledSlots.length === 0) return;
      const lastSlot = filledSlots[filledSlots.length - 1];
      const tileId = lastSlot.dataset.tileId;
      lastSlot.textContent = lastSlot.dataset.placeholder || '___';
      lastSlot.className = 'sentence-slot-box empty';
      delete lastSlot.dataset.tileId;
      delete lastSlot.dataset.chunkText;

      if (tileId) {
        const tileBtn = this.findTileButton(tileId);
        if (tileBtn) {
          tileBtn.classList.remove('used');
          tileBtn.disabled = false;
        }
      }
      updateActiveSlotHighlight();
      soundEngine.playTick(false);
    });

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'letter-action-btn';
    btnClear.id = 'btn-sentence-clear';
    btnClear.innerHTML = '🔄 Xóa hết';
    btnClear.addEventListener('click', () => {
      if (this.isAnsweringLocked) return;
      this.triggerHaptic('light');
      slotBoxes.forEach((s) => {
        if (s.classList.contains('filled')) {
          const tileId = s.dataset.tileId;
          s.textContent = s.dataset.placeholder || '___';
          s.className = 'sentence-slot-box empty';
          delete s.dataset.tileId;
          delete s.dataset.chunkText;
          if (tileId) {
            const tileBtn = this.findTileButton(tileId);
            if (tileBtn) {
              tileBtn.classList.remove('used');
              tileBtn.disabled = false;
            }
          }
        }
      });
      updateActiveSlotHighlight();
      soundEngine.playTick(false);
    });

    actionsDiv.appendChild(btnUndo);
    actionsDiv.appendChild(btnClear);
    tilesContainer.appendChild(actionsDiv);

    this.answersContainer.appendChild(tilesContainer);
  }

  evaluateSentenceOrder(q, slotBoxes) {
    const normalizeSentence = (arr) => arr.map(s => String(s || '').trim().toLowerCase()).join(' ').replace(/\s+/g, ' ').trim();
    const userChunks = slotBoxes.map(s => (s.dataset && s.dataset.chunkText) || s.textContent.trim());
    const targetChunks = Array.isArray(q.wordChunks) ? q.wordChunks : [];
    const isCorrect = normalizeSentence(userChunks) === normalizeSentence(targetChunks);

    this.isAnsweringLocked = true;
    clearInterval(this.timerInterval);

    if (isCorrect) {
      slotBoxes.forEach(s => {
        s.classList.remove('wrong-word');
        s.classList.add('correct-word');
      });
      this.triggerHaptic('success');

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
      // Hiển thị trật tự câu đúng ngay trên khay để học sinh nhìn rõ câu chuẩn ngữ pháp
      slotBoxes.forEach((s, i) => {
        s.textContent = targetChunks[i] || '';
        s.classList.remove('empty', 'active-next-slot');
        s.classList.add('filled', 'wrong-word');
      });
      this.triggerHaptic('error');
      this.handleWrongAnswer(false);

      const timeTaken = (Date.now() - this.questionStartTime) / 1000;
      this.responseTimes.push(timeTaken);
      const retentionRate = this.updateWordRetention(q.id, false);
      this.updateMemoryProfile(q, false, timeTaken);
      this.roundResults.push(false);
      this.recordDailyAnswer();
      this.renderSegmentedRoundBar();
      this.showFeedbackDrawer(false, q, false, retentionRate);
    }
  }

  renderInteractiveVoiceCheck(q) {
    this.answersContainer.innerHTML = '';
    this.letterBoxContainer.innerHTML = '';

    const targetWord = q.voiceTargetWord || q.target_word || 'sustainable';
    const coachMeta = this.analyzeWordSyllablesAndTip(targetWord, q.phonetic || '');

    const tokens = Array.isArray(q.voiceTokens) && q.voiceTokens.length > 0
      ? q.voiceTokens
      : ['We', 'practice', targetWord, 'today'];

    const tokenEls = [];
    tokens.forEach((wordStr, idx) => {
      const span = document.createElement('span');
      span.className = 'voice-word-token';
      span.textContent = wordStr;
      if (!span.dataset) span.dataset = {};
      span.dataset.tokenIndex = String(idx);
      span.dataset.word = wordStr.toLowerCase().replace(/[^a-z]/g, '');
      span.title = `Chạm để nghe phát âm từ "${wordStr}"`;
      span.addEventListener('click', () => {
        this.triggerHaptic('light');
        if (typeof speechEngine !== 'undefined') {
          speechEngine.speakWord(wordStr, 0.86);
        }
      });
      tokenEls.push(span);
      this.letterBoxContainer.appendChild(span);
    });
    this.currentVoiceTokenEls = tokenEls;

    const arena = document.createElement('div');
    arena.className = 'voice-check-arena';

    // Dải tách âm tiết & trọng âm trực quan (Syllable Breakdown Bar: ví dụ sus - TAIN - a - ble)
    const syllableStrip = document.createElement('div');
    syllableStrip.className = 'voice-syllable-strip';
    syllableStrip.id = 'voice-syllable-strip';
    const sylLabel = document.createElement('span');
    sylLabel.className = 'voice-syllable-label';
    sylLabel.textContent = 'Âm tiết & Trọng âm:';
    syllableStrip.appendChild(sylLabel);

    const syllableEls = [];
    (coachMeta.syllables || [targetWord]).forEach((syl, sIdx) => {
      if (sIdx > 0) {
        const sep = document.createElement('span');
        sep.className = 'voice-syllable-sep';
        sep.textContent = '•';
        syllableStrip.appendChild(sep);
      }
      const sylChip = document.createElement('button');
      sylChip.type = 'button';
      const isStressed = sIdx === coachMeta.stressIndex;
      sylChip.className = `voice-syllable-chip${isStressed ? ' stressed-syllable' : ''}`;
      sylChip.textContent = isStressed ? syl.toUpperCase() : syl.toLowerCase();
      sylChip.title = isStressed
        ? `Âm tiết thứ ${sIdx + 1} nhấn trọng âm chính (${syl.toUpperCase()}) - Chạm để nghe chậm`
        : `Âm tiết thứ ${sIdx + 1} (${syl}) - Chạm để nghe chậm`;
      sylChip.addEventListener('click', () => {
        this.triggerHaptic('light');
        if (typeof speechEngine !== 'undefined') {
          speechEngine.speakWord(targetWord, 0.75);
        }
      });
      syllableEls.push(sylChip);
      syllableStrip.appendChild(sylChip);
    });
    this.currentVoiceSyllableEls = syllableEls;

    const statusLine = document.createElement('div');
    statusLine.className = 'voice-status-line';
    statusLine.id = 'voice-status-line';
    statusLine.innerHTML = `<span>🎙️ Chạm Micro để đọc (Nhấn rõ: <strong>${coachMeta.formattedSyllables}</strong>)</span>`;

    // Hộp AI Phonetic Coach 1 dòng (Hiển thị cách đặt lưỡi / trọng âm + nút phát lại đúng từ bị đọc lệch)
    const aiCoachBanner = document.createElement('div');
    aiCoachBanner.className = 'voice-ai-coach-banner';
    aiCoachBanner.id = 'voice-ai-coach-banner';
    aiCoachBanner.style.display = 'none';
    this.currentVoiceCoachBanner = aiCoachBanner;

    const micBtn = document.createElement('button');
    micBtn.type = 'button';
    micBtn.className = 'btn-voice-mic-main';
    micBtn.id = 'btn-voice-record';
    micBtn.innerHTML = `
      <span class="voice-mic-icon-ring">🎙️</span>
      <span class="voice-mic-label">Chạm để phát âm</span>
    `;
    this.attachTactileHaptics(micBtn, 'medium');
    micBtn.addEventListener('click', () => {
      if (this.isAnsweringLocked) return;
      this.startVoiceRecognition(q, micBtn, statusLine);
    });

    const quickActions = document.createElement('div');
    quickActions.className = 'voice-quick-actions';

    const btnListen = document.createElement('button');
    btnListen.type = 'button';
    btnListen.className = 'btn-voice-secondary';
    btnListen.id = 'btn-voice-listen-sample';
    btnListen.innerHTML = '🔊 Nghe mẫu';
    btnListen.addEventListener('click', () => {
      this.triggerHaptic('light');
      const phraseToSpeak = q.voicePhrase || q.voiceTargetWord || q.target_word || '';
      if (typeof speechEngine !== 'undefined' && phraseToSpeak) {
        speechEngine.speakWord(phraseToSpeak, 0.92);
      }
    });

    const btnSimSpeak = document.createElement('button');
    btnSimSpeak.type = 'button';
    btnSimSpeak.className = 'btn-voice-secondary';
    btnSimSpeak.id = 'btn-voice-sim-speak';
    btnSimSpeak.innerHTML = '✨ Đọc chuẩn mẫu';
    btnSimSpeak.addEventListener('click', () => {
      if (this.isAnsweringLocked) return;
      this.triggerHaptic('light');
      if (typeof soundEngine !== 'undefined' && soundEngine.playMicCue) {
        soundEngine.playMicCue(true);
      }
      const sampleSpoken = q.voicePhrase || q.voiceTargetWord || q.target_word || '';
      this.evaluateVoicePronunciation(q, sampleSpoken, statusLine);
    });

    const btnSimMispronounce = document.createElement('button');
    btnSimMispronounce.type = 'button';
    btnSimMispronounce.className = 'btn-voice-secondary btn-voice-coach-test';
    btnSimMispronounce.id = 'btn-voice-sim-mispronounce';
    btnSimMispronounce.innerHTML = '🎯 Thử AI sửa lỗi';
    btnSimMispronounce.title = 'Giả lập đọc lệch từ khóa để xem AI Phonetic Coach chỉ cách đặt lưỡi & phát lại từ sai';
    btnSimMispronounce.addEventListener('click', () => {
      if (this.isAnsweringLocked) return;
      this.triggerHaptic('light');
      const misSpoken = tokens
        .map(t => (t.toLowerCase().replace(/[^a-z]/g, '') === targetWord.toLowerCase().replace(/[^a-z]/g, '') ? 'wrongsound' : t))
        .join(' ');
      this.evaluateVoicePronunciation(q, misSpoken, statusLine);
    });

    quickActions.appendChild(btnListen);
    quickActions.appendChild(btnSimSpeak);
    quickActions.appendChild(btnSimMispronounce);

    arena.appendChild(syllableStrip);
    arena.appendChild(statusLine);
    arena.appendChild(aiCoachBanner);
    arena.appendChild(micBtn);
    arena.appendChild(quickActions);

    this.answersContainer.appendChild(arena);

    // Tự động phát âm mẫu khi vào câu hỏi
    setTimeout(() => {
      if (typeof speechEngine !== 'undefined' && targetWord && !this.isAnsweringLocked) {
        speechEngine.speakWord(targetWord, 0.92);
      }
    }, 160);
  }

  computeTextSimilarity(strA, strB) {
    const a = String(strA || '').toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const b = String(strB || '').toLowerCase().replace(/[^a-z\s]/g, '').trim();
    if (!a || !b) return 0;
    if (a === b) return 1;
    const minLen = Math.min(a.length, b.length);
    const maxLen = Math.max(a.length, b.length);
    if (minLen >= 4 && minLen / maxLen >= 0.7 && (a.includes(b) || b.includes(a))) {
      return 0.92;
    }

    const lenA = a.length;
    const lenB = b.length;
    const dp = Array.from({ length: lenA + 1 }, () => Array(lenB + 1).fill(0));
    for (let i = 0; i <= lenA; i++) dp[i][0] = i;
    for (let j = 0; j <= lenB; j++) dp[0][j] = j;

    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return maxLen > 0 ? Math.max(0, 1 - dp[lenA][lenB] / maxLen) : 0;
  }

  startVoiceRecognition(q, micBtn, statusLine) {
    if (this.isAnsweringLocked) return;

    if (typeof soundEngine !== 'undefined' && soundEngine.playMicCue) {
      soundEngine.playMicCue(true);
    }
    this.triggerHaptic('medium');

    const SpeechRecognitionAPI = (typeof window !== 'undefined')
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    if (micBtn && micBtn.classList) {
      micBtn.classList.add('listening');
    }
    if (statusLine) {
      statusLine.innerHTML = `<span style="color:#34d399;">🎙️ Đang lắng nghe từng âm tiết của bạn...</span>`;
    }

    if (!SpeechRecognitionAPI) {
      // Fallback thông minh trên trình duyệt/môi trường không hỗ trợ Web Speech API trực tiếp
      setTimeout(() => {
        if (this.isAnsweringLocked) return;
        if (micBtn && micBtn.classList) micBtn.classList.remove('listening');
        if (typeof soundEngine !== 'undefined' && soundEngine.playMicCue) {
          soundEngine.playMicCue(false);
        }
        const simulatedTranscript = q.voicePhrase || q.voiceTargetWord || q.target_word || '';
        this.evaluateVoicePronunciation(q, simulatedTranscript, statusLine);
      }, 650);
      return;
    }

    try {
      if (this.activeSpeechRecognition) {
        try { this.activeSpeechRecognition.abort(); } catch (e) {}
      }
      const recognition = new SpeechRecognitionAPI();
      this.activeSpeechRecognition = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      let handled = false;
      recognition.onresult = (event) => {
        if (handled || this.isAnsweringLocked) return;
        handled = true;
        if (micBtn && micBtn.classList) micBtn.classList.remove('listening');
        if (typeof soundEngine !== 'undefined' && soundEngine.playMicCue) {
          soundEngine.playMicCue(false);
        }
        let bestTranscript = '';
        if (event.results && event.results[0]) {
          for (let i = 0; i < event.results[0].length; i++) {
            const candidate = event.results[0][i].transcript || '';
            if (!bestTranscript) bestTranscript = candidate;
            const targetCheck = (q.voiceTargetWord || q.target_word || '').toLowerCase();
            if (candidate.toLowerCase().includes(targetCheck)) {
              bestTranscript = candidate;
              break;
            }
          }
        }
        this.evaluateVoicePronunciation(q, bestTranscript, statusLine);
      };

      recognition.onerror = () => {
        if (handled || this.isAnsweringLocked) return;
        handled = true;
        if (micBtn && micBtn.classList) micBtn.classList.remove('listening');
        if (statusLine) {
          statusLine.innerHTML = `<span style="color:#fbbf24;">💡 Không nghe rõ mic — Chạm "✨ Đọc chuẩn mẫu" hoặc "🎯 Thử AI sửa lỗi"</span>`;
        }
      };

      recognition.onend = () => {
        if (micBtn && micBtn.classList) micBtn.classList.remove('listening');
      };

      recognition.start();
    } catch (err) {
      if (micBtn && micBtn.classList) micBtn.classList.remove('listening');
      const fallbackTranscript = q.voicePhrase || q.voiceTargetWord || q.target_word || '';
      this.evaluateVoicePronunciation(q, fallbackTranscript, statusLine);
    }
  }

  evaluateVoicePronunciation(q, spokenText, statusLineEl = null) {
    if (this.isAnsweringLocked) return;

    const cleanSpoken = String(spokenText || '').trim();
    const targetWord = String(q.voiceTargetWord || q.target_word || 'sustainable').trim();
    const cleanTargetAlpha = targetWord.toLowerCase().replace(/[^a-z]/g, '');
    const targetPhrase = String(q.voicePhrase || targetWord).trim();

    const spokenWords = cleanSpoken.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    const tokens = Array.isArray(q.voiceTokens) && q.voiceTokens.length > 0
      ? q.voiceTokens
      : [targetWord];

    let matchedCount = 0;
    let targetWordMatched = false;
    const missedWords = [];
    const tokenEls = this.currentVoiceTokenEls || [];

    tokens.forEach((tok, idx) => {
      const cleanTok = tok.toLowerCase().replace(/[^a-z]/g, '');
      const isMatched = spokenWords.some(sw => this.computeTextSimilarity(sw, cleanTok) >= 0.72)
        || (spokenWords.length === 1 && this.computeTextSimilarity(cleanSpoken, cleanTok) >= 0.76);
      if (isMatched) {
        matchedCount++;
        if (cleanTok === cleanTargetAlpha) targetWordMatched = true;
      } else {
        missedWords.push(tok);
      }
      const el = tokenEls[idx];
      if (el && el.classList) {
        el.classList.remove('spoken-match', 'spoken-miss', 'shake-miss');
        el.classList.add(isMatched ? 'spoken-match' : 'spoken-miss');
        if (!isMatched) {
          el.classList.add('shake-miss');
        }
      }
    });

    const simWord = spokenWords.length > 0
      ? Math.max(...spokenWords.map(sw => this.computeTextSimilarity(sw, cleanTargetAlpha)), this.computeTextSimilarity(cleanSpoken, targetWord))
      : 0;
    if (simWord >= 0.75) {
      targetWordMatched = true;
    }

    const simPhrase = this.computeTextSimilarity(cleanSpoken, targetPhrase);
    const tokenRatio = tokens.length > 0 ? matchedCount / tokens.length : 0;

    // Nếu từ khóa mục tiêu chính bị đọc sai (targetWordMatched === false) thì tính điểm nghiêm ngặt để kích hoạt AI Phonetic Coach sửa lỗi
    const rawScore = targetWordMatched
      ? Math.max(simWord, simPhrase, tokenRatio)
      : Math.min(0.58, (tokenRatio * 0.5) + (simWord * 0.3));
    const accuracyPct = Math.min(100, Math.max(0, Math.round(rawScore * 100)));
    const isCorrect = accuracyPct >= 65 && targetWordMatched;

    // Xác định chính xác từ bị đọc lệch (ưu tiên từ mục tiêu nếu đọc sai từ mục tiêu)
    const mispronouncedWord = !targetWordMatched
      ? targetWord
      : (missedWords[0] || targetWord);
    const coachData = this.analyzeWordSyllablesAndTip(mispronouncedWord, q.phonetic || '', cleanSpoken);

    q.lastMispronouncedWord = isCorrect && missedWords.length === 0 ? '' : mispronouncedWord;
    q.lastVoiceCoachTip = coachData.oneLineCoachTip;
    q.lastFormattedSyllables = coachData.formattedSyllables;
    this.lastMispronouncedWord = q.lastMispronouncedWord;
    this.lastPhoneticCoachTip = coachData.oneLineCoachTip;

    // Cập nhật dải âm tiết & trọng âm nếu từ bị lệch có tách âm tiết
    if (Array.isArray(this.currentVoiceSyllableEls) && this.currentVoiceSyllableEls.length > 0) {
      this.currentVoiceSyllableEls.forEach((chipEl, sIdx) => {
        if (!chipEl || !chipEl.classList) return;
        chipEl.classList.remove('stress-error-pulse', 'stress-match-glow');
        if (isCorrect) {
          chipEl.classList.add('stress-match-glow');
        } else if (sIdx === coachData.stressIndex) {
          chipEl.classList.add('stress-error-pulse');
        }
      });
    }

    const statusLine = statusLineEl || (this.answersContainer && this.answersContainer.querySelector
      ? this.answersContainer.querySelector('#voice-status-line')
      : null);
    if (statusLine) {
      statusLine.innerHTML = `
        <span>🎙️ Bạn đọc: <strong>“${cleanSpoken || '...'}”</strong></span>
        <span class="voice-score-pill">${accuracyPct}%</span>
      `;
    }

    // Hiển thị 1 dòng hướng dẫn AI Phonetic Coach ngay trên màn hình Luyện Phát Âm
    const coachBanner = this.currentVoiceCoachBanner || (this.answersContainer && this.answersContainer.querySelector
      ? this.answersContainer.querySelector('#voice-ai-coach-banner')
      : null);
    if (coachBanner) {
      coachBanner.style.display = 'flex';
      if (isCorrect && missedWords.length === 0) {
        coachBanner.className = 'voice-ai-coach-banner coach-pass';
        coachBanner.innerHTML = `
          <span class="coach-one-line-text">✨ Chuẩn trọng âm: <strong>${coachData.formattedSyllables}</strong></span>
        `;
      } else {
        coachBanner.className = 'voice-ai-coach-banner coach-fix';
        coachBanner.innerHTML = `
          <span class="coach-one-line-text">🎙️ ${coachData.oneLineCoachTip}</span>
          <button type="button" class="btn-coach-replay-word" id="btn-coach-replay-word" title="Phát lại từ bị đọc lệch">🔊 ${mispronouncedWord}</button>
        `;
        const replayMisBtn = coachBanner.querySelector ? coachBanner.querySelector('#btn-coach-replay-word') : null;
        if (replayMisBtn && typeof replayMisBtn.addEventListener === 'function') {
          replayMisBtn.addEventListener('click', (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            this.triggerHaptic('light');
            if (typeof speechEngine !== 'undefined') {
              speechEngine.speakWord(mispronouncedWord, 0.8);
            }
          });
        }
      }
    }

    this.isAnsweringLocked = true;
    clearInterval(this.timerInterval);

    const timeTaken = (Date.now() - this.questionStartTime) / 1000;
    this.responseTimes.push(timeTaken);
    const retentionRate = this.updateWordRetention(q.id, isCorrect);
    this.updateMemoryProfile(q, isCorrect, timeTaken);

    if (isCorrect) {
      tokenEls.forEach(el => {
        if (el && el.classList) {
          el.classList.remove('spoken-miss', 'shake-miss');
          el.classList.add('spoken-match');
        }
      });
      this.triggerHaptic('success');
      this.handleCorrectAnswer(timeTaken);
      this.roundResults.push(true);
      this.recordDailyAnswer(true);
      this.renderSegmentedRoundBar();
      this.showFeedbackDrawer(true, q, false, retentionRate);
    } else {
      // KÍCH HOẠT PHẢN HỒI RUNG CẢNH BÁO + PHÁT LẠI ĐÚNG TỪ BỊ ĐỌC LỆCH + GỌI AI COACH
      this.triggerHaptic('error');
      this.handleWrongAnswer(false);
      this.roundResults.push(false);
      this.recordDailyAnswer(false);
      this.renderSegmentedRoundBar();
      this.showFeedbackDrawer(false, q, false, retentionRate);

      // Tự động phát lại đúng từ bị đọc lệch với tốc độ rõ từng âm tiết (0.82x)
      if (typeof speechEngine !== 'undefined' && mispronouncedWord) {
        speechEngine.speakWord(mispronouncedWord, 0.82);
      }

      // Đồng bộ thêm với AI Gemini Phonetic Coach trên server (lưu LocalStorage để 0ms cho các lần sau)
      this.fetchAIPhoneticCoachTip(q, mispronouncedWord, cleanSpoken, (aiCoach) => {
        if (!aiCoach || !aiCoach.oneLineCoachTip) return;
        q.lastVoiceCoachTip = aiCoach.oneLineCoachTip;
        q.lastFormattedSyllables = aiCoach.formattedSyllables;
        this.lastPhoneticCoachTip = aiCoach.oneLineCoachTip;
        if (coachBanner && coachBanner.querySelector) {
          const textEl = coachBanner.querySelector('.coach-one-line-text');
          if (textEl) textEl.textContent = `🎙️ ${aiCoach.oneLineCoachTip}`;
        }
        if (this.feedbackExplanation && this.questions[this.currentIndex] === q) {
          this.feedbackExplanation.textContent = `🎙️ AI Coach: ${aiCoach.oneLineCoachTip}`;
        }
      });
    }
    return {
      isCorrect,
      accuracyPct,
      mispronouncedWord,
      formattedSyllables: coachData.formattedSyllables,
      coachTip: coachData.oneLineCoachTip
    };
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

  revealHiddenOptionPosTags() {
    if (!this.answersContainer || !this.answersContainer.querySelectorAll) return;
    const hiddenTags = this.answersContainer.querySelectorAll('.pos-hidden-until-answer');
    if (hiddenTags && hiddenTags.forEach) {
      hiddenTags.forEach(el => {
        if (el && el.classList && el.classList.remove) {
          el.classList.remove('pos-hidden-until-answer');
        }
      });
    }
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
    const currentQ = this.questions && this.questions[this.currentIndex];
    const roundLimit = (currentQ && (currentQ.mode === 'sentence_order' || currentQ.mode === 'voice_check') && !currentQ.isAudioQuiz)
      ? 30.0
      : (this.activeRoundTimeLimit || this.maxTimeSeconds);
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

    // Hỗ trợ hiển thị trực quan cho dạng Sentence Order hoặc Letter Fill khi gọi trực tiếp từ test/phím
    if (q.mode === 'sentence_order' && Array.isArray(q.wordChunks) && this.letterBoxContainer && this.letterBoxContainer.querySelectorAll) {
      const slots = this.letterBoxContainer.querySelectorAll('.sentence-slot-box');
      if (slots && slots.forEach) {
        slots.forEach((s, i) => {
          s.textContent = q.wordChunks[i] || '';
          if (s.classList && s.classList.add) {
            s.classList.remove('empty', 'active-next-slot');
            s.classList.add('filled', isCorrect ? 'correct-word' : 'wrong-word');
          }
        });
      }
    } else if (q.mode === 'letter_fill' && q.missing && this.letterBoxContainer && this.letterBoxContainer.querySelectorAll) {
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

    this.revealHiddenOptionPosTags();
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

    if (q.mode === 'sentence_order' && Array.isArray(q.wordChunks) && this.letterBoxContainer && this.letterBoxContainer.querySelectorAll) {
      const slots = this.letterBoxContainer.querySelectorAll('.sentence-slot-box');
      if (slots && slots.forEach) {
        slots.forEach((s, i) => {
          s.textContent = q.wordChunks[i] || '';
          if (s.classList && s.classList.add) {
            s.classList.remove('empty', 'active-next-slot');
            s.classList.add('filled', 'wrong-word');
          }
        });
      }
      const tileBtns = this.answersContainer.querySelectorAll ? this.answersContainer.querySelectorAll('.word-order-tile-btn') : [];
      if (tileBtns && tileBtns.forEach) tileBtns.forEach(btn => { btn.disabled = true; });
    } else if (q.mode === 'letter_fill' && q.missing && this.letterBoxContainer && this.letterBoxContainer.querySelectorAll) {
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

    this.revealHiddenOptionPosTags();
    const retentionRate = this.updateWordRetention(q.id, false);
    this.updateMemoryProfile(q, false, this.maxTimeSeconds);
    this.triggerHaptic('timeout');
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
      // Nếu là câu hỏi từ đề thi AI tạo, lưu vết Adaptive trực tiếp vào customExamBank trong LocalStorage
      if ((q.is_custom_exam || q.category === 'custom_exam') && Array.isArray(this.customExamBank)) {
        const baseId = String(q.id || '').replace(/_recall_\d+$/, '');
        const bankItem = this.customExamBank.find(item => item && item.id === baseId);
        if (bankItem) {
          bankItem.adaptiveFailCount = (bankItem.adaptiveFailCount || 0) + 1;
          bankItem.lastFailedAt = Date.now();
          this.saveCustomExamBank();
        }
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

    // Nếu học sinh làm sai câu hỏi trong Đề Thi AI (custom_exam):
    // Áp dụng thuật toán Adaptive tái kiểm tra lại chính câu/kiến thức vừa sai với thứ tự đáp án đảo mới cách đó 2-3 câu
    if (wrongQ.is_custom_exam || wrongQ.category === 'custom_exam') {
      const baseOptions = Array.isArray(wrongQ.options) && wrongQ.options.length > 0
        ? [...wrongQ.options]
        : [wrongQ.target_word || 'academic', 'sustainable', 'comprehensive', 'mandatory'];
      const correctAnsText = baseOptions[wrongQ.correct] || wrongQ.target_word || baseOptions[0];
      const shuffledOpts = shuffleArray(baseOptions);
      const newCorrectIdx = Math.max(0, shuffledOpts.indexOf(correctAnsText));

      const adaptiveExamRetry = {
        ...wrongQ,
        id: `${wrongQ.id}_recall_${Date.now()}`,
        isRecallVariant: true,
        isAdaptiveExamRetry: true,
        prompt: `🔁 [ADAPTIVE ÔN LẠI CÂU SAI] ${wrongQ.prompt || 'Chọn đáp án đúng cho câu trong đề:'}`,
        options: shuffledOpts,
        correct: newCorrectIdx
      };
      const insertIdx = Math.min(this.questions.length, this.currentIndex + 2);
      this.questions.splice(insertIdx, 0, adaptiveExamRetry);
      this.getOrPrecomputeQuestionMeta(adaptiveExamRetry);
      this.renderSegmentedRoundBar();
      return;
    }

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
    this.getOrPrecomputeQuestionMeta(recallVariant);
  }

  getShortBandTag(q) {
    if (!q) return 'TOEIC 400-450';
    const gl = String(q.grade_label || '').trim();
    if (/^TOEIC/i.test(gl)) {
      return gl;
    }
    const bandStr = String(q.band || '').trim();
    if (/^TOEIC/i.test(bandStr)) {
      return bandStr;
    }
    if (bandStr) {
      return `IELTS ${bandStr}`;
    }
    return gl || 'TOEIC 400-450';
  }

  getConfusableNote(q) {
    if (!q) return '';
    const key = String(q.target_word || '').trim().toLowerCase();
    if (CONFUSABLE_WORDS_DB[key]) {
      return CONFUSABLE_WORDS_DB[key].replace(/Bẫy phòng thi/gi, 'Bẫy');
    }
    if (q.common_mistake) {
      const cleanedMistake = String(q.common_mistake).replace(/^Bẫy phòng thi\s*:\s*/i, '').trim();
      return `⚠️ Bẫy: ${cleanedMistake}`;
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

    const displayWord = (q.mode === 'word_class' && q.options && q.options[q.correct])
      ? q.options[q.correct]
      : (q.target_word || (q.options && q.options[q.correct]) || '');
    const posTag = this.getWordPOS(displayWord, q);

    this.feedbackVietnamese.innerHTML = `
      <div class="feedback-word-info">
        <span class="feedback-vn-text">${displayWord ? `<strong style="color:var(--accent-primary);margin-right:4px;">${displayWord}</strong>${posTag ? `<span class="pos-tag-badge">${posTag}</span>` : ''}<strong style="color:var(--accent-primary);margin-right:4px;">:</strong>` : ''}${q.vietnamese}</span>
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
        const word = (q.mode === 'sentence_order' && q.targetSentence)
          ? q.targetSentence
          : ((q.mode === 'voice_check' && q.lastMispronouncedWord)
              ? q.lastMispronouncedWord
              : (q.target_word || (q.options && q.options[q.correct]) || ''));
        if (typeof speechEngine !== 'undefined') speechEngine.speakWord(word, q.mode === 'voice_check' ? 0.84 : 0.92);
      });
    }

    if (this.feedbackExplanation) {
      if ((q.mode === 'voice_check' || q.isVoiceCheck) && (q.lastVoiceCoachTip || q.voiceCoachTip)) {
        const tipStr = q.lastVoiceCoachTip || q.voiceCoachTip;
        this.feedbackExplanation.textContent = isCorrect
          ? `🎙️ Chuẩn âm tiết (${q.lastFormattedSyllables || q.voiceFormattedSyllables || q.target_word}) • ${tipStr}`
          : `🎙️ AI Coach: ${tipStr}`;
      } else if ((q.category === 'custom_exam' || q.is_custom_exam) && q.explanation) {
        this.feedbackExplanation.textContent = `🤖 AI Giải thích: ${q.explanation}`;
      } else if (q.mode === 'sentence_order' && q.targetSentence) {
        const shortExp = q.explanation ? ` • 💡 ${q.explanation}` : '';
        this.feedbackExplanation.textContent = `"${q.targetSentence}"${shortExp}`;
      } else if (q.explanation) {
        this.feedbackExplanation.textContent = `${this.getShortBandTag(q)} • 💡 ${q.explanation}`;
      } else {
        this.feedbackExplanation.textContent = this.getShortBandTag(q);
      }
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

    if (q.mode === 'sentence_order' && Array.isArray(q.wordChunks)) {
      const slots = this.letterBoxContainer && this.letterBoxContainer.querySelectorAll
        ? Array.from(this.letterBoxContainer.querySelectorAll('.sentence-slot-box'))
        : [];
      const tileBtns = this.answersContainer && this.answersContainer.querySelectorAll
        ? Array.from(this.answersContainer.querySelectorAll('.word-order-tile-btn'))
        : [];

      let autoPlaced = 0;
      for (let i = 0; i < slots.length && autoPlaced < 2; i++) {
        // Giữ lại ít nhất 1 ô cuối để học sinh tự bấm hoàn thành câu
        const remainingEmpty = slots.filter(s => s.classList && s.classList.contains('empty')).length;
        if (remainingEmpty <= 1 && autoPlaced >= 1) break;

        const slot = slots[i];
        const expectedChunk = q.wordChunks[i];
        const currentChunk = (slot.dataset && slot.dataset.chunkText) || '';

        if (slot.classList.contains('empty') || currentChunk.toLowerCase() !== expectedChunk.toLowerCase()) {
          // Nếu ô đang chứa từ sai, trả từ sai đó về kho trước
          if (slot.classList.contains('filled') && slot.dataset && slot.dataset.tileId) {
            const oldTile = this.findTileButton(slot.dataset.tileId);
            if (oldTile) {
              oldTile.classList.remove('used');
              oldTile.disabled = false;
            }
            slot.textContent = slot.dataset.placeholder || String(i + 1);
            slot.className = 'sentence-slot-box empty';
            delete slot.dataset.tileId;
            delete slot.dataset.chunkText;
          }

          // Tìm phím có cụm từ đúng chưa dùng
          const matchTile = tileBtns.find(btn => {
            const c = (btn.dataset && btn.dataset.chunk) || btn.textContent.trim();
            return !btn.disabled && (!btn.classList || !btn.classList.contains('used')) && c.toLowerCase() === expectedChunk.toLowerCase();
          });

          if (matchTile && matchTile.click) {
            matchTile.click();
            autoPlaced++;
          }
        }
      }
      this.flashDynamicIsland('⚡ 50:50 ĐÃ GHÉP SẴN CỤM TỪ ĐÚNG');
      return;
    }

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
    if (q && q.mode === 'sentence_order' && Array.isArray(q.wordChunks)) {
      const firstTwo = q.wordChunks.slice(0, 2).join(' ');
      if (this.questionMainText) {
        this.questionMainText.innerHTML = `<span class="sentence-order-meaning-cue">💡 Mở đầu câu: <strong class="sentence-hint-target">“${firstTwo} ...”</strong> (${q.vietnamese})</span>`;
      }
      this.flashDynamicIsland(`💡 GỢI Ý MỞ ĐẦU: "${firstTwo}..."`);
      return;
    }
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
      const posTag = this.getWordPOS(word, v);
      const gradeText = v.grade_label || (v.grade ? `Lớp ${v.grade}` : 'IELTS');

      card.innerHTML = `
        <div class="vault-item-top">
          <span class="vault-word-title">
            ${word} ${posTag ? `<span class="pos-tag-badge">${posTag}</span>` : ''}
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

  toggleSentenceOrderMode() {
    if (this.currentGradeFilter === 'sentence_order') {
      this.setGradeFilter('all');
    } else {
      this.setGradeFilter('sentence_order');
    }
  }

  toggleAudioQuizMode() {
    if (this.currentGradeFilter === 'audio') {
      this.setGradeFilter('all');
    } else {
      // Nếu học sinh đang ở sẵn một Lớp (Lớp 6 - 12, TOEIC, Band 7), đồng bộ luôn phân loại lớp đó vào phần Luyện Nghe
      if (['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'toeic', 'band7'].includes(this.currentGradeFilter)) {
        this.audioGradeFilter = this.currentGradeFilter;
        this.saveAudioGradeFilter();
      }
      this.updateAudioGradeFilterUI();
      this.setGradeFilter('audio');
    }
  }

  toggleVoiceCheckMode() {
    if (this.currentGradeFilter === 'voice_check') {
      this.setGradeFilter('all');
    } else {
      this.setGradeFilter('voice_check');
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
    this.updateAudioGradeFilterUI();
    this.closeGradeModal();
    this.startNewRound();
    if (this.currentFilterPillLabel) {
      this.flashDynamicIsland(`🎓 Đã chuyển: ${this.currentFilterPillLabel.textContent}`);
    }
  }

  updateGradeFilterUI() {
    const audioGradeNames = {
      all: '',
      g6: ' • Lớp 6',
      g7: ' • Lớp 7',
      g8: ' • Lớp 8',
      g9: ' • Lớp 9',
      g10: ' • Lớp 10',
      g11: ' • Lớp 11',
      g12: ' • Lớp 12',
      toeic: ' • TOEIC',
      band7: ' • Band 7+'
    };
    const audioSubSuffix = audioGradeNames[this.audioGradeFilter || 'all'] || '';
    const filterLabels = {
      all: 'Adaptive',
      sentence_order: '🧩 Xếp câu',
      audio: `🎧 Nghe AI${audioSubSuffix}`,
      voice_check: '🎙️ Phát âm',
      weak: '🔥 Từ Yếu',
      custom_exam: '📄 Tạo câu hỏi từ đề thi',
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
    const isMiniGameActive = this.currentGradeFilter === 'sentence_order'
      || this.currentGradeFilter === 'audio'
      || this.currentGradeFilter === 'voice_check';
    if (this.btnMiniGamesToggle && this.btnMiniGamesToggle.classList) {
      this.btnMiniGamesToggle.classList.toggle('active-mode', isMiniGameActive);
    }
    if (this.btnSentenceOrderMode && this.btnSentenceOrderMode.classList) {
      this.btnSentenceOrderMode.classList.toggle('active-mode', this.currentGradeFilter === 'sentence_order');
    }
    if (this.btnAudioQuizMode && this.btnAudioQuizMode.classList) {
      this.btnAudioQuizMode.classList.toggle('active-mode', this.currentGradeFilter === 'audio');
    }
    if (this.btnVoiceCheckMode && this.btnVoiceCheckMode.classList) {
      this.btnVoiceCheckMode.classList.toggle('active-mode', this.currentGradeFilter === 'voice_check');
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
        this.closeSettingsMenu();
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
    // Bấm nút Chụp Ảnh mở trực tiếp giao diện Camera gốc của máy để chụp nhanh, rõ nét
    if (this.btnOpenExamCamera) {
      this.btnOpenExamCamera.addEventListener('click', () => {
        this.triggerHaptic('medium');
        this.openNativeExamCamera();
      });
    }
    if (this.btnAddMorePhoto) {
      this.btnAddMorePhoto.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.openNativeExamCamera();
      });
    }
    if (this.btnClearSavedPhotos) {
      this.btnClearSavedPhotos.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.clearAllSavedExamPhotos();
      });
    }
    if (this.inputExamCamera) {
      this.inputExamCamera.addEventListener('change', (e) => {
        const files = e.target && e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
          this.stopExamCamera();
          this.addCapturedExamPhotos(files);
        }
        e.target.value = '';
      });
    }
    if (this.btnOpenNativeCamFallback) {
      this.btnOpenNativeCamFallback.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.openNativeExamCamera();
      });
    }
    if (this.cameraLensSelector && this.cameraLensSelector.querySelectorAll) {
      const lensBtns = this.cameraLensSelector.querySelectorAll('.cam-lens-btn');
      lensBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.triggerHaptic('light');
          const lens = (btn && typeof btn.getAttribute === 'function') ? btn.getAttribute('data-lens') : 'wide';
          this.selectCameraLens(lens || 'wide');
        });
      });
    }
    if (this.btnCameraTorch) {
      this.btnCameraTorch.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.toggleCameraTorch();
      });
    }
    if (this.cameraVideoWrapper) {
      this.cameraVideoWrapper.addEventListener('click', (e) => {
        this.handleCameraTapToFocus(e);
      });
    }
    if (this.btnSwitchCamera) {
      this.btnSwitchCamera.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.switchCameraFacingMode();
      });
    }
    if (this.btnSnapExamPhoto) {
      this.btnSnapExamPhoto.addEventListener('click', () => {
        this.triggerHaptic('success');
        this.snapExamPhoto();
      });
    }
    if (this.btnCloseCamera) {
      this.btnCloseCamera.addEventListener('click', () => {
        this.triggerHaptic('light');
        this.stopExamCamera();
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
        const files = e.dataTransfer && e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
        if (files.length > 0) this.handleExamFilesListSelected(files);
      });
      this.inputExamFile.addEventListener('change', (e) => {
        const files = e.target && e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) this.handleExamFilesListSelected(files);
        e.target.value = '';
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
A. instead of   B. prior to   C. except for   D. regardless of
2. The accounting department found a significant ____ between the estimated budget and actual expenses.
A. itinerary   B. warranty   C. discrepancy   D. vacancy
3. The contract renewal is ____ upon completing the mandatory safety certification.
A. contingent   B. complimentary   C. tentative   D. lucrative
4. Please submit all original travel receipts so we can ____ your accommodation expenses promptly.
A. postpone   B. reimburse   C. supervise   D. terminate
5. Following the merger, the board implemented ____ quality control standards across all factories.
A. eligible   B. confidential   C. prospective   D. stringent`;
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
    this.closeSettingsMenu();
    this.renderSavedExamPhotosGallery();
    this.renderCustomExamPreview();
    if (this.examImportModalOverlay) {
      this.examImportModalOverlay.classList.add('active');
    }
  }

  closeExamImportModal() {
    this.stopExamCamera();
    if (this.examImportModalOverlay) {
      this.examImportModalOverlay.classList.remove('active');
    }
  }

  openNativeExamCamera() {
    if (this.inputExamCamera && typeof this.inputExamCamera.click === 'function') {
      this.inputExamCamera.click();
    }
  }

  async openExamCamera(options = {}) {
    const isSwitching = Boolean(options && options.isSwitching);
    const requestedDeviceId = (options && options.deviceId) !== undefined ? options.deviceId : this.currentCameraDeviceId;
    const requestedLens = (options && options.lens) || this.currentCameraLens || 'wide';
    this.currentCameraLens = requestedLens;

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      try {
        // Hiệu ứng mờ nhẹ (iOS lens blur transition) khi chuyển ống kính hoặc đổi camera
        if (isSwitching && this.examCameraVideo && this.examCameraVideo.classList) {
          this.examCameraVideo.classList.add('switching-lens');
        }

        this.stopCameraTracksOnly();

        const videoConstraints = {
          width: { ideal: 2560 },
          height: { ideal: 1440 }
        };

        if (requestedDeviceId) {
          videoConstraints.deviceId = { exact: requestedDeviceId };
        } else {
          videoConstraints.facingMode = { ideal: this.cameraFacingMode || 'environment' };
        }

        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: false
          });
        } catch (firstErr) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: this.cameraFacingMode || 'environment' } },
              audio: false
            });
          } catch (secondErr) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          }
        }

        this.cameraStream = stream;
        if (this.examCameraVideo) {
          this.examCameraVideo.srcObject = stream;
          if (typeof this.examCameraVideo.play === 'function') {
            this.examCameraVideo.play().catch(() => {});
          }
        }

        // Mở giao diện Full-Screen Camera với animation mượt mà
        if (this.examCameraPanel) {
          this.examCameraPanel.style.display = 'flex';
          this.examCameraPanel.setAttribute('aria-hidden', 'false');
          if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => {
              if (this.examCameraPanel && this.examCameraPanel.classList) {
                this.examCameraPanel.classList.add('active');
              }
            });
          } else if (this.examCameraPanel.classList) {
            this.examCameraPanel.classList.add('active');
          }
        }

        // Liệt kê tất cả các camera vật lý trên máy (Cam chính, Cam góc rộng 0.5x, Cam Macro/Tele, Cam trước)
        await this.discoverCameraDevices(stream);

        // Áp dụng cấu hình ống kính (0.5x, 1x, 2x, Macro) & lấy nét liên tục
        await this.applyLensConstraintsToTrack(this.currentCameraLens);

        if (isSwitching && this.examCameraVideo && this.examCameraVideo.classList) {
          setTimeout(() => {
            if (this.examCameraVideo && this.examCameraVideo.classList) {
              this.examCameraVideo.classList.remove('switching-lens');
            }
          }, 220);
        }

        return;
      } catch (camErr) {
        // Fallback sang camera gốc nếu trình duyệt chặn quyền WebRTC
      }
    }
    if (this.inputExamCamera && typeof this.inputExamCamera.click === 'function') {
      this.inputExamCamera.click();
    }
  }

  async discoverCameraDevices(stream) {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
      return;
    }
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter(d => d && d.kind === 'videoinput');
      this.cameraDevices = videoInputs.map((d, idx) => {
        const rawLabel = String(d.label || '').trim();
        const lower = rawLabel.toLowerCase();
        let shortName = `Cam ${idx + 1}`;
        let lensKind = 'wide';
        let isFront = /front|user|trước|facetime/i.test(lower);

        if (/ultra\s*wide|0\.5|góc\s*rộng|wide-angle/i.test(lower)) {
          shortName = '0.5x Góc rộng';
          lensKind = 'ultrawide';
        } else if (/macro|cận/i.test(lower)) {
          shortName = '🌷 Macro';
          lensKind = 'macro';
        } else if (/tele|2x|3x|zoom/i.test(lower)) {
          shortName = '2x Tele';
          lensKind = 'tele';
        } else if (/dual|triple|back|rear|environment|sau/i.test(lower)) {
          shortName = isFront ? 'Cam Trước' : `Cam Sau ${idx + 1}`;
          lensKind = 'wide';
        } else if (isFront) {
          shortName = 'Cam Trước';
          lensKind = 'front';
        } else if (rawLabel) {
          shortName = rawLabel.length > 18 ? `${rawLabel.slice(0, 16)}…` : rawLabel;
        }

        return {
          deviceId: d.deviceId,
          label: rawLabel || `Camera ${idx + 1}`,
          shortName,
          lensKind,
          isFront
        };
      });

      const activeTrack = stream && typeof stream.getVideoTracks === 'function' ? stream.getVideoTracks()[0] : null;
      const settings = activeTrack && typeof activeTrack.getSettings === 'function' ? activeTrack.getSettings() : {};
      if (settings && settings.deviceId) {
        this.currentCameraDeviceId = settings.deviceId;
      }

      this.renderHardwareCameraDevicesBar();
    } catch (e) {}
  }

  renderHardwareCameraDevicesBar() {
    if (!this.cameraHardwareDevicesBar) return;
    if (!Array.isArray(this.cameraDevices) || this.cameraDevices.length <= 1) {
      this.cameraHardwareDevicesBar.style.display = 'none';
      this.cameraHardwareDevicesBar.innerHTML = '';
      return;
    }

    this.cameraHardwareDevicesBar.style.display = 'flex';
    this.cameraHardwareDevicesBar.innerHTML = this.cameraDevices.map(dev => {
      const isActive = dev.deviceId && dev.deviceId === this.currentCameraDeviceId;
      return `<button type="button" class="cam-hw-pill${isActive ? ' active' : ''}" data-device-id="${dev.deviceId}">${dev.shortName}</button>`;
    }).join('');

    if (this.cameraHardwareDevicesBar.querySelectorAll) {
      const pills = this.cameraHardwareDevicesBar.querySelectorAll('.cam-hw-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          this.triggerHaptic('light');
          const devId = pill.getAttribute('data-device-id');
          if (devId && devId !== this.currentCameraDeviceId) {
            this.currentCameraDeviceId = devId;
            const matched = this.cameraDevices.find(d => d.deviceId === devId);
            if (matched) {
              this.cameraFacingMode = matched.isFront ? 'user' : 'environment';
              if (matched.lensKind && matched.lensKind !== 'front') {
                this.currentCameraLens = matched.lensKind;
              }
            }
            this.openExamCamera({ deviceId: devId, lens: this.currentCameraLens, isSwitching: true });
          }
        });
      });
    }
  }

  async selectCameraLens(lensMode = 'wide') {
    this.currentCameraLens = lensMode;
    this.updateCameraLensUI(lensMode);

    // Kiểm tra xem trên máy có ống kính vật lý chuyên biệt cho chế độ này không (ví dụ ống kính Ultra-Wide 0.5x hoặc Macro/Tele)
    if (Array.isArray(this.cameraDevices) && this.cameraDevices.length > 1) {
      let targetDevice = null;
      if (lensMode === 'ultrawide') {
        targetDevice = this.cameraDevices.find(d => d.lensKind === 'ultrawide' && !d.isFront);
      } else if (lensMode === 'macro') {
        targetDevice = this.cameraDevices.find(d => (d.lensKind === 'macro' || d.lensKind === 'ultrawide') && !d.isFront);
      } else if (lensMode === 'tele') {
        targetDevice = this.cameraDevices.find(d => d.lensKind === 'tele' && !d.isFront);
      } else if (lensMode === 'wide') {
        targetDevice = this.cameraDevices.find(d => d.lensKind === 'wide' && !d.isFront);
      }

      if (targetDevice && targetDevice.deviceId && targetDevice.deviceId !== this.currentCameraDeviceId) {
        this.currentCameraDeviceId = targetDevice.deviceId;
        await this.openExamCamera({ deviceId: targetDevice.deviceId, lens: lensMode, isSwitching: true });
        return;
      }
    }

    // Hiệu ứng chuyển tiêu cự mượt mà trên ống kính hiện tại
    if (this.examCameraVideo && this.examCameraVideo.classList) {
      this.examCameraVideo.classList.add('switching-lens');
      setTimeout(() => {
        if (this.examCameraVideo && this.examCameraVideo.classList) {
          this.examCameraVideo.classList.remove('switching-lens');
        }
      }, 190);
    }

    await this.applyLensConstraintsToTrack(lensMode);
  }

  async applyLensConstraintsToTrack(lensMode = 'wide') {
    this.updateCameraLensUI(lensMode);
    this.digitalCropZoom = 1.0;

    const track = this.cameraStream && typeof this.cameraStream.getVideoTracks === 'function'
      ? this.cameraStream.getVideoTracks()[0]
      : null;
    const capabilities = (track && typeof track.getCapabilities === 'function')
      ? (track.getCapabilities() || {})
      : {};

    const advancedConstraints = {};
    let appliedHardwareZoom = false;

    // 1. Lấy nét liên tục hoặc lấy nét cận cảnh Macro
    if (Array.isArray(capabilities.focusMode)) {
      if (lensMode === 'macro' && capabilities.focusMode.includes('continuous')) {
        advancedConstraints.focusMode = 'continuous';
      } else if (capabilities.focusMode.includes('continuous')) {
        advancedConstraints.focusMode = 'continuous';
      }
    }
    if (lensMode === 'macro' && capabilities.focusDistance && typeof capabilities.focusDistance.min === 'number') {
      const minFocus = capabilities.focusDistance.min;
      const maxFocus = capabilities.focusDistance.max || 1;
      advancedConstraints.focusDistance = Math.min(maxFocus, minFocus + 0.06);
    }

    // 2. Điều chỉnh tiêu cự Zoom phần cứng (nếu trình duyệt/camera hỗ trợ)
    if (capabilities.zoom && typeof capabilities.zoom.min === 'number' && typeof capabilities.zoom.max === 'number') {
      const zMin = capabilities.zoom.min;
      const zMax = capabilities.zoom.max;
      let desiredZoom = 1.0;
      if (lensMode === 'ultrawide') {
        desiredZoom = zMin < 1.0 ? zMin : 1.0;
      } else if (lensMode === 'wide') {
        desiredZoom = Math.min(zMax, Math.max(zMin, 1.0));
      } else if (lensMode === 'tele') {
        desiredZoom = Math.min(zMax, Math.max(zMin, 2.0));
      } else if (lensMode === 'macro') {
        desiredZoom = Math.min(zMax, Math.max(zMin, 1.6));
      }
      advancedConstraints.zoom = desiredZoom;
      appliedHardwareZoom = true;
    }

    if (track && typeof track.applyConstraints === 'function' && Object.keys(advancedConstraints).length > 0) {
      try {
        await track.applyConstraints({ advanced: [advancedConstraints] });
      } catch (e) {}
    }

    // 3. Nếu thiết bị không hỗ trợ zoom phần cứng trực tiếp qua WebRTC, áp dụng Optical-Grade Preview Scale & Crop
    if (this.examCameraVideo && this.examCameraVideo.style) {
      if (lensMode === 'ultrawide') {
        this.digitalCropZoom = 1.0;
        this.examCameraVideo.style.objectFit = 'contain';
        this.examCameraVideo.style.transform = 'scale(1)';
      } else if (lensMode === 'tele' && !appliedHardwareZoom) {
        this.digitalCropZoom = 1.85;
        this.examCameraVideo.style.objectFit = 'cover';
        this.examCameraVideo.style.transform = 'scale(1.85)';
      } else if (lensMode === 'macro' && !appliedHardwareZoom) {
        this.digitalCropZoom = 1.45;
        this.examCameraVideo.style.objectFit = 'cover';
        this.examCameraVideo.style.transform = 'scale(1.45)';
      } else {
        this.digitalCropZoom = 1.0;
        this.examCameraVideo.style.objectFit = 'cover';
        this.examCameraVideo.style.transform = 'scale(1)';
      }
    }
  }

  updateCameraLensUI(lensMode = 'wide') {
    const badgeLabels = {
      ultrawide: '🌐 Góc Rộng 0.5x • Chụp cả trang đề',
      wide: '📷 Cam Chính 1x • Sắc nét chuẩn',
      tele: '🔍 Phóng To 2x • Rõ chữ ở xa',
      macro: '🌷 Chế Độ Macro • Chụp sát chữ nhỏ'
    };
    if (this.cameraActiveLensBadge) {
      this.cameraActiveLensBadge.textContent = badgeLabels[lensMode] || badgeLabels.wide;
    }
    if (this.cameraLensSelector && this.cameraLensSelector.querySelectorAll) {
      const btns = this.cameraLensSelector.querySelectorAll('.cam-lens-btn');
      btns.forEach(btn => {
        if (btn && btn.classList && typeof btn.getAttribute === 'function') {
          btn.classList.toggle('active', btn.getAttribute('data-lens') === lensMode);
        }
      });
    }
  }

  async toggleCameraTorch() {
    this.cameraTorchOn = !this.cameraTorchOn;
    const track = this.cameraStream && typeof this.cameraStream.getVideoTracks === 'function'
      ? this.cameraStream.getVideoTracks()[0]
      : null;
    let hardwareTorchApplied = false;
    if (track && typeof track.getCapabilities === 'function' && typeof track.applyConstraints === 'function') {
      const caps = track.getCapabilities() || {};
      if (caps.torch) {
        try {
          await track.applyConstraints({ advanced: [{ torch: this.cameraTorchOn }] });
          hardwareTorchApplied = true;
        } catch (e) {}
      }
    }
    if (this.btnCameraTorch && this.btnCameraTorch.classList) {
      this.btnCameraTorch.classList.toggle('torch-on', this.cameraTorchOn);
    }
    if (this.cameraHintToast) {
      this.cameraHintToast.textContent = this.cameraTorchOn
        ? (hardwareTorchApplied ? '⚡ Đã bật đèn Flash hỗ trợ chụp đề rõ nét' : '💡 Đã bật tăng sáng khung ngắm')
        : '⚡ Đã tắt đèn Flash';
    }
    if (this.examCameraVideo && this.examCameraVideo.classList) {
      this.examCameraVideo.classList.toggle('video-bright-boost', this.cameraTorchOn && !hardwareTorchApplied);
    }
  }

  handleCameraTapToFocus(e) {
    if (!this.cameraVideoWrapper || !this.cameraFocusReticle) return;
    const rect = this.cameraVideoWrapper.getBoundingClientRect
      ? this.cameraVideoWrapper.getBoundingClientRect()
      : { left: 0, top: 0, width: 360, height: 640 };
    const clientX = (e && typeof e.clientX === 'number') ? e.clientX : rect.left + rect.width / 2;
    const clientY = (e && typeof e.clientY === 'number') ? e.clientY : rect.top + rect.height / 2;
    const x = Math.max(36, Math.min(rect.width - 36, clientX - rect.left));
    const y = Math.max(36, Math.min(rect.height - 36, clientY - rect.top));

    this.triggerHaptic('light');
    this.cameraFocusReticle.style.left = `${x}px`;
    this.cameraFocusReticle.style.top = `${y}px`;
    this.cameraFocusReticle.classList.remove('focus-anim');
    if (this.cameraFocusReticle.offsetWidth !== undefined) {
      void this.cameraFocusReticle.offsetWidth;
    }
    this.cameraFocusReticle.classList.add('focus-anim');

    // Kích hoạt lấy nét lại trên ống kính
    const track = this.cameraStream && typeof this.cameraStream.getVideoTracks === 'function'
      ? this.cameraStream.getVideoTracks()[0]
      : null;
    if (track && typeof track.applyConstraints === 'function') {
      try {
        track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {});
      } catch (err) {}
    }
  }

  async switchCameraFacingMode() {
    if (Array.isArray(this.cameraDevices) && this.cameraDevices.length > 1) {
      const currentIdx = this.cameraDevices.findIndex(d => d.deviceId === this.currentCameraDeviceId);
      const nextIdx = (currentIdx + 1) % this.cameraDevices.length;
      const nextDev = this.cameraDevices[nextIdx];
      if (nextDev && nextDev.deviceId) {
        this.currentCameraDeviceId = nextDev.deviceId;
        this.cameraFacingMode = nextDev.isFront ? 'user' : 'environment';
        if (nextDev.lensKind && nextDev.lensKind !== 'front') {
          this.currentCameraLens = nextDev.lensKind;
        }
        await this.openExamCamera({ deviceId: nextDev.deviceId, lens: this.currentCameraLens, isSwitching: true });
        return;
      }
    }
    this.currentCameraDeviceId = null;
    this.cameraFacingMode = this.cameraFacingMode === 'environment' ? 'user' : 'environment';
    await this.openExamCamera({ isSwitching: true });
  }

  stopCameraTracksOnly() {
    if (this.cameraStream && typeof this.cameraStream.getTracks === 'function') {
      this.cameraStream.getTracks().forEach(track => {
        if (track && typeof track.stop === 'function') track.stop();
      });
    }
    this.cameraStream = null;
    this.cameraTorchOn = false;
    if (this.btnCameraTorch && this.btnCameraTorch.classList) {
      this.btnCameraTorch.classList.remove('torch-on');
    }
  }

  stopExamCamera() {
    this.stopCameraTracksOnly();
    if (this.examCameraVideo) {
      this.examCameraVideo.srcObject = null;
      if (this.examCameraVideo.style) {
        this.examCameraVideo.style.transform = 'scale(1)';
      }
      if (this.examCameraVideo.classList) {
        this.examCameraVideo.classList.remove('switching-lens', 'video-bright-boost');
      }
    }
    if (this.examCameraPanel) {
      if (this.examCameraPanel.classList) {
        this.examCameraPanel.classList.remove('active');
      }
      this.examCameraPanel.setAttribute('aria-hidden', 'true');
      this.examCameraPanel.style.display = 'none';
    }
  }

  snapExamPhoto() {
    if (!this.examCameraVideo) return;
    const video = this.examCameraVideo;
    const rawW = video.videoWidth || 1920;
    const rawH = video.videoHeight || 1080;
    const cropFactor = Math.max(1.0, this.digitalCropZoom || 1.0);

    const srcW = Math.round(rawW / cropFactor);
    const srcH = Math.round(rawH / cropFactor);
    const srcX = Math.round((rawW - srcW) / 2);
    const srcY = Math.round((rawH - srcH) / 2);

    const canvas = document.createElement('canvas');
    canvas.width = rawW;
    canvas.height = rawH;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, rawW, rawH);
    }
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const commaIdx = dataUrl.indexOf(',');
    const base64Str = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
    const byteSize = Math.round((base64Str.length * 3) / 4);
    const fileName = `chup-de-thi-${new Date().toISOString().slice(11, 19).replace(/:/g, '')}.jpg`;

    // Lưu trực tiếp ảnh vừa chụp vào selectedExamFile (hỗ trợ cả base64 trực tiếp)
    this.selectedExamFile = {
      name: fileName,
      type: 'image/jpeg',
      size: byteSize,
      precomputedBase64: base64Str
    };

    // Hiệu ứng chớp màn trập (Shutter Flash) mượt mà trước khi đóng Camera
    if (this.cameraShutterFlash && this.cameraShutterFlash.classList) {
      this.cameraShutterFlash.classList.add('flash-active');
    }
    soundEngine.playCorrect(1);

    if (this.examSelectedFilePill) {
      this.examSelectedFilePill.style.display = 'inline-flex';
    }
    if (this.examSelectedFileName) {
      const sizeKB = Math.max(1, Math.round(byteSize / 1024));
      this.examSelectedFileName.textContent = `📸 ${fileName} (${sizeKB} KB)`;
    }
    if (this.examImportStatus) {
      this.examImportStatus.style.display = 'block';
      this.examImportStatus.textContent = '📸 Đã chụp ảnh đề thi sắc nét! Bấm nút "Tạo Câu Hỏi" bên dưới.';
    }

    setTimeout(() => {
      if (this.cameraShutterFlash && this.cameraShutterFlash.classList) {
        this.cameraShutterFlash.classList.remove('flash-active');
      }
    }, 160);
    this.stopExamCamera();
  }

  async compressImageFileForStorage(file) {
    const rawDataUrl = await new Promise((resolve, reject) => {
      if (typeof FileReader === 'undefined') {
        reject(new Error('Trình duyệt không hỗ trợ FileReader'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => resolve(String((e.target && e.target.result) || ''));
      reader.onerror = () => reject(new Error('Không thể đọc ảnh'));
      reader.readAsDataURL(file);
    });

    // Nén ảnh qua Canvas để lưu được nhiều ảnh vào LocalStorage mà vẫn sắc nét cho AI đọc chữ
    if (typeof Image !== 'undefined' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
      try {
        const compressedDataUrl = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            try {
              const maxDim = 1280;
              let w = img.naturalWidth || img.width || 1000;
              let h = img.naturalHeight || img.height || 750;
              if (w > maxDim || h > maxDim) {
                if (w >= h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext && canvas.getContext('2d');
              if (ctx && typeof ctx.drawImage === 'function' && typeof canvas.toDataURL === 'function') {
                ctx.drawImage(img, 0, 0, w, h);
                const out = canvas.toDataURL('image/jpeg', 0.8);
                if (out && out.startsWith('data:image/')) {
                  resolve(out);
                  return;
                }
              }
            } catch (e) {}
            resolve(rawDataUrl);
          };
          img.onerror = () => resolve(rawDataUrl);
          img.src = rawDataUrl;
        });
        return compressedDataUrl;
      } catch (e) {}
    }
    return rawDataUrl;
  }

  async addCapturedExamPhotos(filesList) {
    const validFiles = Array.from(filesList || []).filter(Boolean);
    if (validFiles.length === 0) return;

    if (!Array.isArray(this.savedExamPhotos)) {
      this.savedExamPhotos = [];
    }

    let addedCount = 0;
    for (const file of validFiles) {
      try {
        const dataUrl = await this.compressImageFileForStorage(file);
        const commaIdx = dataUrl.indexOf(',');
        const base64Data = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const photoItem = {
          id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: file.name || `anh-de-${timeStr.replace(':', '')}.jpg`,
          mimeType: 'image/jpeg',
          dataUrl: dataUrl.startsWith('data:') ? dataUrl : `data:image/jpeg;base64,${base64Data}`,
          base64Data,
          timeLabel: timeStr
        };
        this.savedExamPhotos.push(photoItem);
        addedCount++;
      } catch (err) {}
    }

    if (addedCount > 0) {
      this.saveSavedExamPhotos();
      this.renderSavedExamPhotosGallery();
      soundEngine.playCorrect(1);
      this.triggerHaptic('success');

      if (this.examImportStatus) {
        this.examImportStatus.style.display = 'block';
        this.examImportStatus.textContent = `📸 Đã lưu ${this.savedExamPhotos.length} ảnh đề thi trên máy! Bạn có thể bấm "➕ Chụp thêm" để chụp nhiều trang hoặc bấm "Tạo Câu Hỏi".`;
      }
    }
  }

  removeSavedExamPhoto(photoId) {
    if (!Array.isArray(this.savedExamPhotos)) return;
    this.savedExamPhotos = this.savedExamPhotos.filter(p => p && p.id !== photoId);
    this.saveSavedExamPhotos();
    this.renderSavedExamPhotosGallery();
  }

  clearAllSavedExamPhotos() {
    this.savedExamPhotos = [];
    this.saveSavedExamPhotos();
    this.renderSavedExamPhotosGallery();
    if (this.examImportStatus) {
      this.examImportStatus.style.display = 'block';
      this.examImportStatus.textContent = '🗑️ Đã xóa toàn bộ ảnh đề thi đã lưu trên máy.';
    }
  }

  renderSavedExamPhotosGallery() {
    const photos = Array.isArray(this.savedExamPhotos) ? this.savedExamPhotos : [];
    if (this.examPhotoGallerySection) {
      this.examPhotoGallerySection.style.display = photos.length > 0 ? 'flex' : 'none';
    }
    if (this.examPhotoCountBadge) {
      this.examPhotoCountBadge.textContent = `🖼️ Ảnh đề đã lưu trên máy (${photos.length} ảnh)`;
    }
    if (!this.examPhotoGalleryList) return;

    this.examPhotoGalleryList.innerHTML = '';
    photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'exam-photo-card';
      card.innerHTML = `
        <img class="exam-photo-thumb" src="${photo.dataUrl}" alt="Ảnh đề #${idx + 1}" loading="lazy">
        <span class="exam-photo-badge">Ảnh #${idx + 1}${photo.timeLabel ? ` • ${photo.timeLabel}` : ''}</span>
        <button type="button" class="btn-remove-photo" title="Xóa ảnh này" aria-label="Xóa ảnh #${idx + 1}">✕</button>
      `;
      const removeBtn = card.querySelector ? card.querySelector('.btn-remove-photo') : null;
      if (removeBtn && typeof removeBtn.addEventListener === 'function') {
        removeBtn.addEventListener('click', (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          this.triggerHaptic('light');
          this.removeSavedExamPhoto(photo.id);
        });
      }
      this.examPhotoGalleryList.appendChild(card);
    });
  }

  handleExamFilesListSelected(files) {
    const list = Array.from(files || []).filter(Boolean);
    if (list.length === 0) return;

    const imageFiles = list.filter(f => {
      const t = String(f.type || '').toLowerCase();
      const n = String(f.name || '').toLowerCase();
      return t.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(n);
    });
    const docFiles = list.filter(f => !imageFiles.includes(f));

    if (imageFiles.length > 0) {
      this.addCapturedExamPhotos(imageFiles);
    }
    if (docFiles.length > 0) {
      this.handleExamFileSelected(docFiles[0]);
    }
  }

  handleExamFileSelected(file) {
    if (!file) return;
    const fType = String(file.type || '').toLowerCase();
    const fName = String(file.name || '').toLowerCase();
    if (!file.precomputedBase64 && (fType.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(fName))) {
      this.addCapturedExamPhotos([file]);
      return;
    }
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
    if (file && file.precomputedBase64) {
      return Promise.resolve(file.precomputedBase64);
    }
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

  cancelBackgroundExamGeneration() {
    this.backgroundExamJobId = (this.backgroundExamJobId || 0) + 1;
    this.isGeneratingExamInBackground = false;
  }

  async convertExamFileToQuestions() {
    const rawText = this.examRawTextInput ? String(this.examRawTextInput.value || '').trim() : '';
    const savedPhotos = Array.isArray(this.savedExamPhotos) ? this.savedExamPhotos : [];

    if (savedPhotos.length === 0 && !this.selectedExamFile && !rawText) {
      if (this.examImportStatus) {
        this.examImportStatus.style.display = 'block';
        this.examImportStatus.textContent = '⚠️ Vui lòng chụp ảnh đề thi, chọn file (Ảnh, PDF, Word) hoặc dán nội dung đề thi vào ô văn bản!';
      }
      this.triggerHaptic('error');
      return;
    }

    this.cancelBackgroundExamGeneration();
    const currentJobId = this.backgroundExamJobId;

    if (this.btnRunExamConvert) {
      this.btnRunExamConvert.disabled = true;
      this.btnRunExamConvert.innerHTML = '<span>⏳ Đang tạo nhanh 5 câu đầu...</span>';
    }
    if (this.examImportStatus) {
      this.examImportStatus.style.display = 'block';
      const photoInfo = savedPhotos.length > 0 ? `${savedPhotos.length} ảnh đề thi` : 'tài liệu đề thi';
      this.examImportStatus.textContent = `🤖 AI đang tạo trước 5 câu hỏi đầu tiên từ ${photoInfo} để bạn vào làm ngay (sau đó sẽ tự động tạo tiếp tối đa 60 câu)...`;
    }

    try {
      let base64Data = '';
      let fileName = '';
      let mimeType = '';

      if (this.selectedExamFile) {
        fileName = this.selectedExamFile.name || 'exam-file';
        mimeType = this.selectedExamFile.type || '';
        base64Data = await this.readFileAsBase64(this.selectedExamFile);
      } else if (savedPhotos.length > 0) {
        fileName = savedPhotos[0].name || 'captured-exam.jpg';
        mimeType = savedPhotos[0].mimeType || 'image/jpeg';
        base64Data = savedPhotos[0].base64Data || '';
      }

      const imagesPayload = savedPhotos.map((p, idx) => ({
        fileName: p.name || `exam-page-${idx + 1}.jpg`,
        mimeType: p.mimeType || 'image/jpeg',
        base64Data: p.base64Data || ''
      })).filter(item => Boolean(item.base64Data));

      // BƯỚC 1: Chỉ tạo trước ĐÚNG 5 CÂU HỎI ĐẦU TIÊN để học sinh vào làm bài ngay lập tức!
      const initialBatchSize = this.initialExamBatchSize || 5;
      const response = await fetch('/api/exam-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          mimeType,
          base64Data,
          images: imagesPayload,
          rawText,
          offset: 0,
          questionCount: initialBatchSize,
          questionTypeMode: this.examQuestionTypeMode || 'mcq_only'
        })
      });

      const data = await response.json();
      if (!response.ok || !data || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error((data && data.error) || 'Không trích xuất được câu hỏi từ tài liệu.');
      }

      const firstBatch = data.questions.slice(0, initialBatchSize);
      this.customExamBank = [...firstBatch];
      this.saveCustomExamBank();

      // Lưu thông tin đề thi vào lịch sử LocalStorage trên thiết bị
      this.savedExamsHistory = [
        {
          id: `exam_${Date.now()}`,
          title: fileName || (rawText ? `Đề văn bản (${rawText.slice(0, 24)}...)` : 'Đề thi AI'),
          createdAt: new Date().toISOString(),
          questionCount: this.customExamBank.length
        },
        ...(this.savedExamsHistory || [])
      ].slice(0, 15);
      this.saveSavedExamsHistory();

      this.renderCustomExamPreview();
      this.updateGradeFilterUI();
      soundEngine.playVictory();
      this.triggerHaptic('success');

      const hasMoreToGenerate = Boolean(data.hasMore) && this.customExamBank.length < (this.maxQuestionsPerExam || 60);

      if (this.examImportStatus) {
        this.examImportStatus.style.display = 'block';
        this.examImportStatus.textContent = hasMoreToGenerate
          ? `🎉 Đã tạo xong ${firstBatch.length} câu đầu tiên! Hệ thống đang tiếp tục tạo ngầm các câu tiếp theo (tối đa 60 câu) trong lúc bạn làm bài.`
          : `🎉 Đã tạo xong ${firstBatch.length} câu từ đề thi vào bộ nhớ máy! Bấm nút bên dưới để làm bài ngay.`;
      }

      // Tự động đưa học sinh vào làm ngay 5 câu đầu tiên vừa tạo!
      this.closeExamImportModal();
      this.setGradeFilter('custom_exam');

      // BƯỚC 2: Trong lúc học sinh đang làm 5 câu đầu, tiếp tục tạo ngầm các câu tiếp theo (tối đa 60 câu cho 1 đề)
      if (hasMoreToGenerate) {
        this.continueBackgroundExamGeneration({
          jobId: currentJobId,
          fileName,
          mimeType,
          base64Data,
          images: imagesPayload,
          rawText,
          questionTypeMode: this.examQuestionTypeMode || 'mcq_only',
          startOffset: firstBatch.length
        });
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
        this.btnRunExamConvert.innerHTML = '<span>Tạo Câu Hỏi</span>';
      }
    }
  }

  async continueBackgroundExamGeneration(ctx) {
    if (!ctx || ctx.jobId !== this.backgroundExamJobId) return;
    this.isGeneratingExamInBackground = true;
    const maxCap = this.maxQuestionsPerExam || 60;
    const batchStep = 10;
    let currentOffset = Number(ctx.startOffset) || 5;

    try {
      while (currentOffset < maxCap && ctx.jobId === this.backgroundExamJobId) {
        const remaining = maxCap - currentOffset;
        const countToFetch = Math.min(batchStep, remaining);
        if (countToFetch <= 0) break;

        const existingSentences = (this.customExamBank || []).map(q => q.sentence).filter(Boolean);
        const res = await fetch('/api/exam-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: ctx.fileName,
            mimeType: ctx.mimeType,
            base64Data: ctx.base64Data,
            images: ctx.images,
            rawText: ctx.rawText,
            offset: currentOffset,
            questionCount: countToFetch,
            excludeSentences: existingSentences,
            questionTypeMode: ctx.questionTypeMode || 'mcq_only'
          })
        });

        if (!res.ok || ctx.jobId !== this.backgroundExamJobId) break;
        const data = await res.json();
        const nextQuestions = (data && Array.isArray(data.questions)) ? data.questions : [];
        if (nextQuestions.length === 0) break;

        // Lọc trùng lặp câu hỏi và giới hạn tối đa 60 câu cho 1 đề
        const existingSet = new Set((this.customExamBank || []).map(q => `${q.sentence}__${q.target_word}`));
        const uniqueNew = nextQuestions.filter(q => {
          const key = `${q.sentence}__${q.target_word}`;
          if (existingSet.has(key)) return false;
          existingSet.add(key);
          return true;
        });

        if (uniqueNew.length > 0) {
          this.customExamBank = [...(this.customExamBank || []), ...uniqueNew].slice(0, maxCap);
          this.saveCustomExamBank();
          this.renderCustomExamPreview();
          this.updateGradeFilterUI();

          // Nếu học sinh đang làm chính bộ đề này, nối mượt các câu mới vào hàng đợi (tối đa 60 câu) mà không làm gián đoạn câu hiện tại
          if (this.currentGradeFilter === 'custom_exam' && Array.isArray(this.questions)) {
            uniqueNew.forEach((nq, idx) => {
              if (this.questions.length < maxCap && !this.questions.some(eq => eq.id === nq.id)) {
                const normalizedMode = (nq.mode === 'letter_fill' && nq.sentence) ? 'sentence_cloze' : (nq.mode || 'sentence_cloze');
                const formattedQ = {
                  ...nq,
                  category: 'custom_exam',
                  is_custom_exam: true,
                  exam_verbatim: true,
                  mode: normalizedMode
                };
                this.questions.push(formattedQ);
                this.usedQuestionIds.add(formattedQ.id);
              }
            });
            this.saveUsedQuestionIds();
            if (this.progressText && this.questions.length > 0) {
              this.progressText.textContent = `Câu ${this.currentIndex + 1}/${this.questions.length}`;
            }
            this.renderSegmentedRoundBar();
            this.preloadUpcomingQuestions(this.currentIndex + 1, 3);
          }
        }

        currentOffset += nextQuestions.length;
        if (!data.hasMore || this.customExamBank.length >= maxCap) {
          break;
        }
      }
    } catch (bgErr) {
      // Giữ nguyên các câu đã tạo trong LocalStorage nếu mạng gián đoạn
    } finally {
      if (ctx.jobId === this.backgroundExamJobId) {
        this.isGeneratingExamInBackground = false;
        this.renderCustomExamPreview();
      }
    }
  }

  renderCustomExamPreview() {
    const bank = (this.customExamBank || []).slice(0, 60);
    const readyBar = document.getElementById('exam-ready-bar');
    if (readyBar) {
      readyBar.style.display = bank.length > 0 ? 'flex' : 'none';
    }
    if (this.examPreviewCountLabel) {
      const bgTag = this.isGeneratingExamInBackground ? ' (⏳ đang tạo tiếp tối đa 60 câu...)' : '';
      this.examPreviewCountLabel.textContent = `📚 Đã lưu trên máy: ${bank.length}/60 câu hỏi${bgTag}`;
    }
    if (this.btnClearCustomBank) {
      this.btnClearCustomBank.style.display = bank.length > 0 ? 'inline-block' : 'none';
    }
    if (this.btnStartCustomExam) {
      this.btnStartCustomExam.style.display = bank.length > 0 ? 'block' : 'none';
    }
    if (this.examPreviewList) {
      this.examPreviewList.innerHTML = '';
      this.examPreviewList.style.display = 'none';
    }
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
      const posTag = this.getWordPOS(item.word, item);
      row.innerHTML = `
        <div class="mw-left">
          <div class="mw-title-line">
            <span class="mw-word">${item.word}</span>
            ${posTag ? `<span class="pos-tag-badge">${posTag}</span>` : ''}
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
        version: '3.3.0',
        exportedAt: new Date().toISOString(),
        memoryProfiles: this.memoryProfiles || {},
        srsMatrix: this.srsMatrix || {},
        weakWordIds: this.weakWordIds || [],
        dailyTracker: this.dailyTracker || {},
        customExamBank: (this.customExamBank || []).slice(0, 60),
        savedExamsHistory: this.savedExamsHistory || [],
        audioGradeFilter: this.audioGradeFilter || 'all',
        phoneticCoachCache: this.phoneticCoachCache || {}
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
        if (Array.isArray(parsed.customExamBank)) {
          this.customExamBank = parsed.customExamBank.slice(0, 60);
          this.saveCustomExamBank();
          this.renderCustomExamPreview();
        }
        if (typeof parsed.audioGradeFilter === 'string') {
          this.audioGradeFilter = parsed.audioGradeFilter;
          this.saveAudioGradeFilter();
          this.updateAudioGradeFilterUI();
        }
        if (parsed.phoneticCoachCache && typeof parsed.phoneticCoachCache === 'object') {
          this.phoneticCoachCache = { ...(this.phoneticCoachCache || {}), ...parsed.phoneticCoachCache };
          this.savePhoneticCoachCache();
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
