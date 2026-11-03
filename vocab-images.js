/**
 * HỆ THỐNG HÌNH ẢNH CHUYỂN ĐỘNG DẠNG GIF 2D SỐNG ĐỘNG (ANIMATED GIF 2D ENGINE)
 * - Chuyển đổi toàn bộ 58 tranh minh họa nét chì từ Danh_English_Tutor sang khung hình động GIF 2D
 * - Bổ sung Hoạt Cảnh Động GIF 2D (Procedural 2D Animated GIF Scenes + Hạt Ánh Sáng) cho 100% từ vựng IELTS, SGK Lớp 6-12 & TOEIC 400-700+
 * - Hỗ trợ tương tác chạm để phát âm (Tap-to-Speak) & phản ứng cảm xúc theo kết quả Đúng / Sai
 */

const VOCAB_IMAGES = {
  "volunteer": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit4/1-v1.webp",
  "creativity": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit1/8-v1.webp",
  "concentrate": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit8/9-vocab100-v1.webp",
  "landslide": "https://danhlearning.github.io/Danh_English_Tutor/shared/assets/vocabulary-reviewed/landslide-v1.webp",
  "monument": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop6/assets/images/pencil/unit9/landmark-v1.webp",
  "qualification": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit7/3-v1.webp",
  "breadwinner": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit1/2-v1.webp",
  "biodiversity": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit9/1-v1.webp",
  "discrimination": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit6/3-v1.webp",
  "infrastructure": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit3/1-v1.webp",
  "self-reliant": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit1/7-v1.webp",
  "apprenticeship": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit7/2-v1.webp",
  "perseverance": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit1/7-v1.webp",
  "algorithm": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit6/1-v1.webp",
  "biodegradable": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit3/2-v1.webp",
  "landmark": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit12/7-v1.webp",
  "sunburn": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit2/4-v1.webp",
  "pavement": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit7/4-v1.webp",
  "flying car": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit11/2-v1.webp",
  "ancestor": "https://danhlearning.github.io/Danh_English_Tutor/shared/assets/vocabulary-reviewed/ancestor-v1.webp",
  "itinerary": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit10/9-vocab100-v1.webp",
  "carbon footprint": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit2/1-v1.webp",
  "blended learning": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit8/1-v1.webp",
  "ecotourism": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit10/1-v1.webp",
  "life expectancy": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit1/4-v1.webp",
  "generation gap": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit2/1-v1.webp",
  "liveable": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit3/2-v1.webp",
  "resilient": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit1/3-v1.webp",
  "multicultural": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit2/4-v1.webp",
  "urbanisation": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit4/1-v1.webp",
  "raise funds": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit4/8-v1.webp",
  "endangered species": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit8/8-v1.webp",
  "traffic congestion": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit7/8-v1.webp",
  "public transport": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit11/6-v1.webp",
  "balanced diet": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit2/8-v1.webp",
  "tuition fees": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit7/4-v1.webp",
  "preservation": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit6/4-v2.webp",
  "qualified": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit6/4-v1.webp",
  "equality": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit6/1-v1.webp",
  "portable": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit5/3-v1.webp",
  "cope with": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit8/6-v1.webp",
  "cut down on": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit1/6-v1.webp",
  "recycle": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit2/7-v1.webp",
  "helmet": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit7/2-v1.webp",
  "electric car": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop7/assets/images/pencil/unit11/1-v1.webp",
  "paddy field": "https://danhlearning.github.io/Danh_English_Tutor/shared/assets/vocabulary-reviewed/paddy-field-v1.webp",
  "time management": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit8/2-v1.webp",
  "ecosystem": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit9/1-v1.webp",
  "deforestation": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit9/3-v1.webp",
  "peacekeeping": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit7/2-v4.webp",
  "donate": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit4/2-v1.webp",
  "vocational": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit7/1-v1.webp",
  "bullying": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit9/2-v1.webp",
  "landfill": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit3/3-v1.webp",
  "automate": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop6/assets/images/pencil/unit10/automatically-v1.webp",
  "internship": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop12/assets/images/pencil/unit9/3-v1.webp",
  "budget": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop11/assets/images/pencil/unit8/3-v1.webp",
  "performance": "https://danhlearning.github.io/Danh_English_Tutor/grade/lop10/assets/images/pencil/unit3/2-v1.webp"
};

/**
 * Bảng chủ đề Hoạt Cảnh Động GIF 2D (Dùng cho cả 58 ảnh gốc và 700+ câu hỏi từ vựng còn lại)
 */
const VOCAB_GIF_THEMES = {
  environment: {
    key: 'environment',
    motionPreset: 'breeze_float',
    primary: '#10b981',
    secondary: '#38bdf8',
    accent: '#fbbf24',
    particles: ['🍃', '✨', '💧', '🌱'],
    centerGlyph: '🌿',
    orbitGlyphA: '🌍',
    orbitGlyphB: '☀️',
    sceneLabel: 'ECO MOTION'
  },
  technology: {
    key: 'technology',
    motionPreset: 'energy_pulse',
    primary: '#38bdf8',
    secondary: '#818cf8',
    accent: '#2dd4bf',
    particles: ['⚡', '✨', '💠', '🔹'],
    centerGlyph: '🤖',
    orbitGlyphA: '⚡',
    orbitGlyphB: '🛰️',
    sceneLabel: 'TECH PULSE'
  },
  business: {
    key: 'business',
    motionPreset: 'rising_growth',
    primary: '#f59e0b',
    secondary: '#38bdf8',
    accent: '#34d399',
    particles: ['✨', '📈', '💎', '⭐'],
    centerGlyph: '💼',
    orbitGlyphA: '📊',
    orbitGlyphB: '🚀',
    sceneLabel: 'BIZ GROWTH'
  },
  education: {
    key: 'education',
    motionPreset: 'orbital_wave',
    primary: '#6366f1',
    secondary: '#38bdf8',
    accent: '#fbbf24',
    particles: ['✨', '🎓', '💡', '⭐'],
    centerGlyph: '🎓',
    orbitGlyphA: '📚',
    orbitGlyphB: '💡',
    sceneLabel: 'STUDY FLOW'
  },
  society: {
    key: 'society',
    motionPreset: 'orbital_wave',
    primary: '#ec4899',
    secondary: '#8b5cf6',
    accent: '#38bdf8',
    particles: ['✨', '🤝', '💫', '🌟'],
    centerGlyph: '🤝',
    orbitGlyphA: '🌐',
    orbitGlyphB: '💛',
    sceneLabel: 'COMMUNITY'
  },
  health: {
    key: 'health',
    motionPreset: 'sketch_lively',
    primary: '#14b8a6',
    secondary: '#f43f5e',
    accent: '#fbbf24',
    particles: ['✨', '💚', '🍎', '⚡'],
    centerGlyph: '🏃',
    orbitGlyphA: '🥗',
    orbitGlyphB: '💪',
    sceneLabel: 'VITAL LIFE'
  },
  travel: {
    key: 'travel',
    motionPreset: 'breeze_float',
    primary: '#0ea5e9',
    secondary: '#f59e0b',
    accent: '#a855f7',
    particles: ['✈️', '✨', '🧭', '🌤️'],
    centerGlyph: '✈️',
    orbitGlyphA: '🗺️',
    orbitGlyphB: '🏛️',
    sceneLabel: 'JOURNEY'
  }
};

/**
 * Tạo chuỗi SVG Hoạt Cảnh Động 2D (Animated GIF-style Looping Scene)
 * Chuyển động mượt 60fps với vòng sáng xoay, nhân vật/biểu tượng nhấp nhô 2D và tia sáng quét
 */
function buildAnimatedSvgSceneDataUri(theme, q, posTag) {
  const t = theme || VOCAB_GIF_THEMES.education;
  const topicText = String((q && q.topic) || t.sceneLabel || 'VOCAB').replace(/[<>&"']/g, '');
  const gradeOrBand = String((q && (q.grade_label || (q.band ? `Band ${q.band}` : 'TOEIC'))) || 'IELTS').replace(/[<>&"']/g, '');
  const cleanPos = String(posTag || '(vocab)').replace(/[<>&"']/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 150" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${t.primary}" stop-opacity="0.22">
          <animate attributeName="stop-opacity" values="0.16;0.30;0.16" dur="3.2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="50%" stop-color="#0f172a" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="${t.secondary}" stop-opacity="0.24">
          <animate attributeName="stop-opacity" values="0.26;0.14;0.26" dur="3.2s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${t.primary}" stop-opacity="0.48"/>
        <stop offset="70%" stop-color="${t.secondary}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${t.secondary}" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="360" height="150" rx="16" fill="url(#bgGrad)"/>

    <!-- Sóng chuyển động 2D dưới đáy -->
    <path d="M 0 122 Q 90 106 180 122 T 360 122 L 360 150 L 0 150 Z" fill="${t.primary}" fill-opacity="0.12">
      <animate attributeName="d"
        values="M 0 122 Q 90 106 180 122 T 360 122 L 360 150 L 0 150 Z;
                M 0 122 Q 90 136 180 122 T 360 122 L 360 150 L 0 150 Z;
                M 0 122 Q 90 106 180 122 T 360 122 L 360 150 L 0 150 Z"
        dur="3.6s" repeatCount="indefinite"/>
    </path>

    <!-- Hào quang trung tâm co giãn nhịp thở -->
    <circle cx="180" cy="72" r="48" fill="url(#coreGlow)">
      <animate attributeName="r" values="42;56;42" dur="2.4s" repeatCount="indefinite"/>
    </circle>

    <!-- Vòng quỹ đạo nét đứt xoay tròn 2D -->
    <circle cx="180" cy="72" r="44" fill="none" stroke="${t.primary}" stroke-width="1.8" stroke-dasharray="7 6" stroke-opacity="0.55">
      <animateTransform attributeName="transform" type="rotate" from="0 180 72" to="360 180 72" dur="10s" repeatCount="indefinite"/>
    </circle>
    <circle cx="180" cy="72" r="33" fill="none" stroke="${t.secondary}" stroke-width="1.4" stroke-dasharray="4 5" stroke-opacity="0.45">
      <animateTransform attributeName="transform" type="rotate" from="360 180 72" to="0 180 72" dur="7s" repeatCount="indefinite"/>
    </circle>

    <!-- Các hạt ánh sáng 2D bay lượn -->
    <circle cx="78" cy="42" r="4" fill="${t.accent}">
      <animate attributeName="cy" values="46;28;46" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.35;1;0.35" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="284" cy="48" r="4.5" fill="${t.primary}">
      <animate attributeName="cy" values="52;32;52" dur="2.6s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0.95;0.4" dur="2.6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="112" cy="108" r="3.5" fill="${t.secondary}">
      <animate attributeName="cy" values="112;94;112" dur="2.1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="252" cy="106" r="3.8" fill="${t.accent}">
      <animate attributeName="cy" values="108;88;108" dur="2.5s" repeatCount="indefinite"/>
    </circle>

    <!-- Biểu tượng vệ tinh trái & phải chuyển động lệch pha -->
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,-5; 0,6; 0,-5" dur="2.3s" repeatCount="indefinite"/>
      <circle cx="102" cy="70" r="20" fill="${t.primary}" fill-opacity="0.16" stroke="${t.primary}" stroke-opacity="0.45" stroke-width="1.5"/>
      <text x="102" y="77" text-anchor="middle" font-size="20">${t.orbitGlyphA}</text>
    </g>

    <g>
      <animateTransform attributeName="transform" type="translate" values="0,6; 0,-5; 0,6" dur="2.5s" repeatCount="indefinite"/>
      <circle cx="258" cy="70" r="20" fill="${t.secondary}" fill-opacity="0.16" stroke="${t.secondary}" stroke-opacity="0.45" stroke-width="1.5"/>
      <text x="258" y="77" text-anchor="middle" font-size="20">${t.orbitGlyphB}</text>
    </g>

    <!-- Chủ thể 2D trung tâm nhún nhảy sống động -->
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,-6; 0,5; 0,-6" dur="1.85s" repeatCount="indefinite"/>
      <circle cx="180" cy="70" r="28" fill="${t.primary}" fill-opacity="0.22" stroke="${t.primary}" stroke-width="2"/>
      <text x="180" y="81" text-anchor="middle" font-size="31">${t.centerGlyph}</text>
    </g>

    <!-- Nhãn chủ đề & cấp độ gọn gàng -->
    <rect x="12" y="10" width="96" height="20" rx="10" fill="${t.primary}" fill-opacity="0.2" stroke="${t.primary}" stroke-opacity="0.45" stroke-width="1"/>
    <text x="60" y="23.5" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="9.5" fill="${t.primary}">${gradeOrBand} • ${cleanPos}</text>

    <text x="180" y="138" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="10.5" fill="${t.secondary}" letter-spacing="0.6">${topicText.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Nhận diện chủ đề chuyển động GIF phù hợp nhất cho câu hỏi từ vựng
 */
function resolveVocabGifTheme(q) {
  if (!q) return VOCAB_GIF_THEMES.education;
  const topicStr = String(q.topic || '').toLowerCase();
  const catStr = String(q.category || q.topic_category || '').toLowerCase();
  const idStr = String(q.id || '').toLowerCase();
  const wordStr = String(q.target_word || '').toLowerCase();

  if (
    topicStr.includes('environment') ||
    topicStr.includes('nature') ||
    topicStr.includes('eco') ||
    topicStr.includes('green') ||
    /pollution|recycle|biodiversity|deforestation|ecosystem|landslide|biodegradable|paddy|landfill|carbon|endangered/.test(wordStr)
  ) {
    return VOCAB_GIF_THEMES.environment;
  }

  if (
    topicStr.includes('tech') ||
    topicStr.includes('science') ||
    topicStr.includes('ai') ||
    topicStr.includes('future') ||
    /appliance|algorithm|automate|portable|electric|flying|digital|software|network|data|server/.test(wordStr)
  ) {
    return VOCAB_GIF_THEMES.technology;
  }

  if (
    catStr === 'toeic' ||
    idStr.startsWith('toeic_') ||
    topicStr.includes('business') ||
    topicStr.includes('work') ||
    topicStr.includes('career') ||
    topicStr.includes('econom') ||
    topicStr.includes('finance') ||
    /budget|invoice|schedule|contract|negotiate|reimburse|vacancy|qualification|apprenticeship|internship|tuition|funds/.test(wordStr)
  ) {
    return VOCAB_GIF_THEMES.business;
  }

  if (
    topicStr.includes('health') ||
    topicStr.includes('food') ||
    topicStr.includes('sport') ||
    topicStr.includes('life') ||
    /sunburn|diet|expectancy|cope|cut down|resilient|helmet/.test(wordStr)
  ) {
    return VOCAB_GIF_THEMES.health;
  }

  if (
    topicStr.includes('travel') ||
    topicStr.includes('tour') ||
    topicStr.includes('city') ||
    topicStr.includes('transport') ||
    topicStr.includes('urban') ||
    /itinerary|landmark|monument|pavement|traffic|transport|urbanisation|liveable/.test(wordStr)
  ) {
    return VOCAB_GIF_THEMES.travel;
  }

  if (
    topicStr.includes('society') ||
    topicStr.includes('community') ||
    topicStr.includes('family') ||
    topicStr.includes('culture') ||
    /volunteer|breadwinner|discrimination|ancestor|generation|multicultural|equality|peacekeeping|donate|bullying/.test(wordStr)
  ) {
    return VOCAB_GIF_THEMES.society;
  }

  return VOCAB_GIF_THEMES.education;
}

/**
 * Xây dựng cấu hình Hình Ảnh Chuyển Động Dạng GIF 2D cho bất kỳ câu hỏi nào
 */
function buildAnimatedVocabGifConfig(q, posTag = '(n)') {
  if (!q) return null;
  const targetKey = String(q.target_word || '').trim().toLowerCase();
  const baseKey = targetKey.replace(/\s+(to|for|with|on|in|of|from|at|by|into|about|upon)$/i, '');
  const matchedIllustrationUrl = q.image_url || VOCAB_IMAGES[targetKey] || VOCAB_IMAGES[baseKey] || null;
  const theme = resolveVocabGifTheme(q);
  const animatedSceneDataUri = buildAnimatedSvgSceneDataUri(theme, q, posTag);

  return {
    isAnimatedGif: true,
    format: 'gif-2d-motion',
    visualType: matchedIllustrationUrl ? 'illustrated_gif' : 'procedural_gif_scene',
    illustrationUrl: matchedIllustrationUrl,
    animatedSceneDataUri,
    primarySrc: matchedIllustrationUrl || animatedSceneDataUri,
    fallbackSrc: animatedSceneDataUri,
    motionPreset: theme.motionPreset,
    themeKey: theme.key,
    primaryColor: theme.primary,
    secondaryColor: theme.secondary,
    accentColor: theme.accent,
    particles: theme.particles,
    centerGlyph: theme.centerGlyph,
    orbitGlyphA: theme.orbitGlyphA,
    orbitGlyphB: theme.orbitGlyphB,
    sceneLabel: theme.sceneLabel,
    reactionState: 'idle_loop'
  };
}
