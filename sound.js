/**
 * IELTS BLITZ ARENA - SOUND & SPEECH SYNTHESIZER ENGINE (Web Audio API & Web Speech API)
 * Pure synthesis: 0 bytes external audio files, 0ms latency, 100% offline.
 * Bổ sung hệ thống phát âm từ vựng chuẩn Cambridge/Oxford, tone trung - cao, phát âm rõ từng âm tiết.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('ielts_sound_muted') === 'true';
    this.goodVariation = 0;
    this.mediaChannelUnlocked = false;
    this.silentMediaAudioEl = null;
  }

  // Ép kênh âm thanh của trình duyệt điện thoại / máy tính bảng sang kênh MEDIA (Playback)
  // giúp khi điện thoại bật chế độ Im lặng / Tắt chuông (Silent Mode) nhưng âm lượng Media còn mở thì âm thanh game vẫn phát bình thường
  unlockMediaChannel() {
    try {
      // 1. Chuẩn W3C / Safari iOS 16.4+ / iOS 17+ / iOS 18+ AudioSession API:
      // 'playback' bỏ qua công tắc Im lặng vật lý (Ring/Silent switch) và phát trực tiếp qua kênh Media Volume
      if (typeof navigator !== 'undefined' && navigator.audioSession) {
        try {
          if (navigator.audioSession.type !== 'playback') {
            navigator.audioSession.type = 'playback';
          }
        } catch (e) {}
      }

      // 2. Mở khóa kênh HTML5 Media Element cho mọi phiên bản iOS WebKit & Android Chrome:
      // Phát 1 mẫu âm thanh PCM siêu ngắn qua thẻ <audio> để hệ điều hành chuyển Category từ SoloAmbient sang Media Playback
      if (!this.silentMediaAudioEl && typeof document !== 'undefined' && typeof document.createElement === 'function') {
        const audio = document.createElement('audio');
        if (typeof audio.setAttribute === 'function') {
          audio.setAttribute('playsinline', 'true');
          audio.setAttribute('webkit-playsinline', 'true');
        }
        audio.preload = 'auto';
        audio.volume = 0.01;
        // File WAV 44-byte 1 mẫu trắng hợp lệ
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        this.silentMediaAudioEl = audio;
      }

      if (this.silentMediaAudioEl && !this.mediaChannelUnlocked && typeof this.silentMediaAudioEl.play === 'function') {
        const playPromise = this.silentMediaAudioEl.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => {
            this.mediaChannelUnlocked = true;
          }).catch(() => {});
        } else {
          this.mediaChannelUnlocked = true;
        }
      } else {
        this.mediaChannelUnlocked = true;
      }
    } catch (e) {}
    return this.mediaChannelUnlocked;
  }

  // Khởi tạo và mở khóa AudioContext + Kênh Media (Bắt buộc với iOS Safari & Android)
  init() {
    this.unlockMediaChannel();
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx({ latencyHint: 'interactive' });
        } catch (e) {
          this.ctx = new AudioCtx();
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('ielts_sound_muted', this.isMuted);
    speechEngine.isMuted = this.isMuted;
    return this.isMuted;
  }

  // 0. Xung cộng hưởng xúc giác trầm (Sub-Bass Tactile Haptic Impulse) bổ trợ cho Haptic API
  playHapticPulse(style = 'light') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      if (style === 'success' || style === 'correct' || style === 'fever') {
        // Nhịp đập đôi săn chắc, nảy gọn (65Hz -> 108Hz) tạo cảm giác "Click-Pop" chiến thắng trên lòng bàn tay
        const pulses = style === 'fever'
          ? [{ offset: 0, startF: 68, endF: 112, dur: 0.032, gain: 0.09 }, { offset: 0.052, startF: 85, endF: 132, dur: 0.04, gain: 0.11 }]
          : [{ offset: 0, startF: 64, endF: 98, dur: 0.028, gain: 0.08 }, { offset: 0.048, startF: 82, endF: 118, dur: 0.035, gain: 0.095 }];

        pulses.forEach(p => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const at = now + p.offset;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(p.startF, at);
          if (osc.frequency.exponentialRampToValueAtTime) {
            osc.frequency.exponentialRampToValueAtTime(p.endF, at + p.dur);
          }
          gain.gain.setValueAtTime(0.0001, at);
          if (gain.gain.linearRampToValueAtTime) {
            gain.gain.linearRampToValueAtTime(p.gain, at + 0.004);
          }
          if (gain.gain.exponentialRampToValueAtTime) {
            gain.gain.exponentialRampToValueAtTime(0.0001, at + p.dur);
          }
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(at);
          osc.stop(at + p.dur + 0.005);
        });
      } else if (style === 'error' || style === 'wrong' || style === 'timeout') {
        // Nhịp rung trầm kép (88Hz -> 44Hz) mô phỏng lực khựng vật lý khi trả lời sai hoặc hết giờ
        const thuds = style === 'timeout'
          ? [{ offset: 0, startF: 92, endF: 44, dur: 0.06, gain: 0.12 }, { offset: 0.085, startF: 76, endF: 38, dur: 0.08, gain: 0.13 }]
          : [{ offset: 0, startF: 86, endF: 46, dur: 0.05, gain: 0.11 }, { offset: 0.072, startF: 72, endF: 40, dur: 0.068, gain: 0.12 }];

        thuds.forEach(t => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const at = now + t.offset;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(t.startF, at);
          if (osc.frequency.exponentialRampToValueAtTime) {
            osc.frequency.exponentialRampToValueAtTime(t.endF, at + t.dur);
          }
          gain.gain.setValueAtTime(0.0001, at);
          if (gain.gain.linearRampToValueAtTime) {
            gain.gain.linearRampToValueAtTime(t.gain, at + 0.005);
          }
          if (gain.gain.exponentialRampToValueAtTime) {
            gain.gain.exponentialRampToValueAtTime(0.0001, at + t.dur);
          }
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(at);
          osc.stop(at + t.dur + 0.006);
        });
      } else {
        // Xung chạm Taptic siêu ngắn (14ms) khi bấm phím
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = style === 'medium' ? 115 : 135;
        osc.frequency.setValueAtTime(startFreq, now);
        if (osc.frequency.exponentialRampToValueAtTime) {
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.014);
        }
        gain.gain.setValueAtTime(0.0001, now);
        if (gain.gain.linearRampToValueAtTime) {
          gain.gain.linearRampToValueAtTime(style === 'medium' ? 0.055 : 0.035, now + 0.002);
        }
        if (gain.gain.exponentialRampToValueAtTime) {
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
        }
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.018);
      }
    } catch (e) {}
  }

  // 1. Âm thanh Trả lời Đúng (Chuẩn Danh_English_Tutor luân phiên [523, 659, 784] và [587, 740, 880])
  playCorrect(streak = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = (this.goodVariation++ % 2) ? [587, 740, 880] : [523, 659, 784];
    const now = this.ctx.currentTime;
    const step = 0.065;

    notes.forEach((frequency, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const at = now + i * step;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, at);
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.08, at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);

      osc.start(at);
      osc.stop(at + 0.17);
    });
  }

  // 2. Âm thanh Trả lời Sai (Chuẩn Danh_English_Tutor [294, 247] sóng tam giác hạ dần)
  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [294, 247];
    const now = this.ctx.currentTime;
    const step = 0.065;

    notes.forEach((frequency, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const at = now + i * step;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, at);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.88, at + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.08, at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);

      osc.start(at);
      osc.stop(at + 0.17);
    });
  }

  // 3. Âm thanh Đồng hồ Tích tắc / Đếm ngược (Êm dịu, nhẹ nhàng, thanh thoát chuẩn iOS Marimba/Woodblock)
  playTick(isUrgent = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Dùng sóng Sine thuần khiết, êm ái tự nhiên, không dùng Square gây chói gắt
      osc.type = 'sine';
      
      // Tần số nhẹ dịu mô phỏng gõ gỗ êm tai (woodblock/soft haptic click)
      // Bình thường: 440Hz -> 360Hz. Khi khẩn cấp (<= 3s): 580Hz -> 480Hz
      const baseFreq = isUrgent ? 580 : 440;
      osc.frequency.setValueAtTime(baseFreq, now);
      if (osc.frequency.exponentialRampToValueAtTime) {
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.04);
      }

      // Âm lượng siêu nhẹ nhàng (0.02 - 0.035), êm ái không gây chói tai
      const peakGain = isUrgent ? 0.035 : 0.02;
      gain.gain.setValueAtTime(0.0001, now);
      if (gain.gain.linearRampToValueAtTime) {
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.004);
      }
      if (gain.gain.exponentialRampToValueAtTime) {
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  // 4. Âm thanh kích hoạt FEVER MODE & STREAK (Chuẩn Danh_English_Tutor ngũ âm cao trào)
  playFever() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523, 659, 784, 1047, 1319];
    const now = this.ctx.currentTime;
    const step = 0.085;

    notes.forEach((frequency, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const at = now + i * step;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, at);
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.09, at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.18);

      osc.start(at);
      osc.stop(at + 0.19);
    });
  }

  // 5. Âm thanh sử dụng Power-Up
  playPowerup() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    const now = this.ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0.18, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.24);
    });
  }

  // 6. Fanfare Chiến thắng
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const melody = [523.25, 659.25, 783.99, 1046.50, 1174.66, 1318.51];
    melody.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      }, idx * 110);
    });
  }

  // 7. Âm hiệu Bắt đầu / Kết thúc Thu âm Giọng nói (Tín hiệu kristal trong trẻo kiểu Siri / iOS Voice)
  playMicCue(isStart = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const tones = isStart ? [587.33, 880.0] : [880.0, 587.33];
      tones.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const at = now + idx * 0.055;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, at);
        gain.gain.setValueAtTime(0.0001, at);
        if (gain.gain.linearRampToValueAtTime) {
          gain.gain.linearRampToValueAtTime(0.085, at + 0.008);
        }
        if (gain.gain.exponentialRampToValueAtTime) {
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
        }
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(at);
        osc.stop(at + 0.14);
      });
    } catch (e) {}
  }

  // 8. Âm thanh Nhận thưởng Nhiệm vụ Ngày & Chuỗi Streak (Tiếng nổ xu pha lê cao trào)
  playQuestClaim() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 783.99, 987.77, 1174.66, 1567.98]; // D5, G5, B5, D6, G6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const at = now + idx * 0.055;
        osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, at);
        gain.gain.setValueAtTime(0.0001, at);
        if (gain.gain.linearRampToValueAtTime) {
          gain.gain.linearRampToValueAtTime(0.14, at + 0.008);
        }
        if (gain.gain.exponentialRampToValueAtTime) {
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
        }
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(at);
        osc.stop(at + 0.3);
      });
    } catch (e) {}
  }
}

/**
 * ==========================================================================
 * SPEECH SYNTHESIS ENGINE (HỆ THỐNG PHÁT ÂM TỪ VỰNG TỰ NHIÊN)
 * - Giọng đọc tiếng Anh bản xứ chuẩn quốc tế (Oxford / Cambridge / Apple / Google)
 * - Tone: Trung - Cao (Pitch: 1.18) tạo cảm giác trong trẻo, tự nhiên, lôi cuốn
 * - Tốc độ: 0.92 giúp người học nghe rõ từng phụ âm cuối (t, d, s, z, th...)
 * ==========================================================================
 */
class SpeechEngine {
  constructor() {
    this.synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
    this.voice = null;
    this.isMuted = localStorage.getItem('ielts_sound_muted') === 'true';

    if (this.synth) {
      this.initVoice();
      if (typeof this.synth.onvoiceschanged !== 'undefined') {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Tìm giọng đọc tiếng Anh tự nhiên chất lượng cao nhất của hệ điều hành
    // Ưu tiên: Samantha, Victoria, Google US/UK, Karen, Zira, Natural English
    const priorityNames = ['Samantha', 'Victoria', 'Google US English', 'Google UK English Female', 'Karen', 'Moira', 'Tessa', 'Natural', 'Zira'];
    
    for (const name of priorityNames) {
      const match = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
      if (match) {
        this.voice = match;
        return;
      }
    }

    // Fallback: Tìm bất kỳ giọng nữ tiếng Anh nào hoặc giọng en-US/en-GB
    this.voice = voices.find(v => v.lang === 'en-GB' || v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];
  }

  // Phát âm từ vựng chính xác mỗi khi trả lời đúng hoặc trong chế độ Luyện Nghe
  speakWord(text, customRate = 0.92) {
    if (this.isMuted || !this.synth || !text) return;

    if (typeof soundEngine !== 'undefined' && soundEngine && typeof soundEngine.unlockMediaChannel === 'function') {
      soundEngine.unlockMediaChannel();
    }

    // Hủy các câu đọc dở trước đó
    this.synth.cancel();

    // Làm sạch chuỗi từ (bỏ dấu gạch dưới, khoảng trắng dư thừa)
    let cleanWord = text.replace(/_/g, '').replace(/\[.*?\]/g, '').trim();
    if (!cleanWord) return;

    const utter = new SpeechSynthesisUtterance(cleanWord);
    utter.lang = 'en-US';
    if (this.voice) {
      utter.voice = this.voice;
    }

    // Tone TRUNG - CAO (1.18) và TỐC ĐỘ RÕ RÀNG (mặc định 0.92)
    utter.pitch = 1.18;
    utter.rate = typeof customRate === 'number' ? customRate : 0.92;
    utter.volume = 1.0;

    this.synth.speak(utter);
  }

  // Phát âm tốc độ chậm (0.68x) rõ từng âm tiết cho Chế độ Luyện Nghe (Audio Quiz)
  speakSlow(text) {
    this.speakWord(text, 0.68);
  }
}

// Khởi tạo các singleton instance
const soundEngine = new SoundEngine();
const speechEngine = new SpeechEngine();
