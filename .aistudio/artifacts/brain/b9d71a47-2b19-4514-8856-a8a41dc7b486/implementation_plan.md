# Nâng Cấp Toàn Bộ Hình Ảnh Tĩnh Thành Hình Ảnh Chuyển Động Dạng GIF Sống Động

Chuyển đổi toàn bộ 58 hình ảnh minh họa tĩnh hiện có sang khung hình chuyển động dạng GIF 2D sống động, đồng thời bổ sung cảnh chuyển động GIF trực quan cho 100% từ vựng trong toàn bộ kho câu hỏi IELTS, SGK Lớp 6–12 và TOEIC 400–700+, tích hợp tương tác chạm phát âm và phản ứng cảm xúc theo kết quả trả lời Đúng/Sai trên một màn hình duy nhất.

## User Review & Critical Decisions

> [!IMPORTANT]
> Kế hoạch dưới đây được thiết kế dựa trên 3 quyết định bạn đã xác nhận:
> 1. **Phạm vi bao phủ 100% từ vựng**: Nâng cấp toàn bộ 58 hình ảnh minh họa hiện có thành ảnh chuyển động dạng GIF và tự động dựng cảnh chuyển động 2D theo chủ đề/ngữ cảnh cho tất cả các từ vựng còn lại trong ngân hàng câu hỏi.
> 2. **Phong cách chuyển động 2D sống động**: Áp dụng chuyển động vòng lặp mượt mà (GIF Loop 60fps) kết hợp hệ thống hạt nổi (floating particles), tia sáng lấp lánh và chuyển động nhịp thở 2D cho từng bức hình mà không làm nặng bộ nhớ thiết bị.
> 3. **Tương tác đa giác quan (Âm thanh + Hình ảnh + Xúc giác)**: Chạm trực tiếp vào khung hình GIF để nghe phát âm chuẩn kèm sóng âm và hiệu ứng nảy; khi trả lời **Đúng** hoặc **Sai**, khung hình GIF lập tức chuyển sang trạng thái ăn mừng hoặc rung cảnh báo đồng bộ với âm thanh và nhịp rung Haptic.

---

### 1. Overview & Core Concept

- **Trải nghiệm người dùng (What It Does)**:
  - Thay vì chỉ nhìn một bức ảnh tĩnh hoặc chỉ đọc chữ khô khan, mỗi câu hỏi từ vựng giờ đây sở hữu một **Khung Hình Động GIF Tương Tác (Interactive Animated GIF Stage)** ngay trung tâm thẻ câu hỏi.
  - Với 58 từ vựng đã có tranh minh họa nét chì: hệ thống biến bức tranh tĩnh thành hoạt cảnh GIF chuyển động liên tục (hiệu ứng lắc lư sống động theo ngữ nghĩa, ánh sáng quét qua nét vẽ, các hạt năng lượng và ký hiệu chủ đề bay lượn xung quanh trên nền Canvas/SVG đa lớp).
  - Với hơn 700 câu hỏi từ vựng còn lại (SGK Lớp 6–12, IELTS và TOEIC): hệ thống tự động sinh hoạt cảnh GIF 2D động theo chủ đề và từ khóa (ví dụ: *Environment* có lá xanh xoay nhẹ và giọt sương lấp lánh; *Business/TOEIC* có biểu đồ tăng trưởng chuyển động và tia sáng vàng; *Technology* có xung mạch điện tử phát sáng...).
- **Đối tượng sử dụng (Target Audience)**: Học sinh THCS/THPT (Lớp 6–12) và người luyện thi IELTS/TOEIC trên điện thoại và máy tính bảng cần ghi nhớ từ vựng bằng trí nhớ hình ảnh chuyển động (Visual-Kinetic Memory).
- **Giá trị cốt lõi (Key Value)**: Tăng khả năng ghi nhớ từ vựng gấp nhiều lần nhờ kích thích đồng thời thị giác chuyển động, thính giác và xúc giác trên đúng 1 màn hình không cần cuộn trang.

---

### 2. User Experience & Visual Design

- **Luồng trải nghiệm tương tác (Key User Flows)**:
  1. **Khi câu hỏi xuất hiện (Idle Looping GIF State)**:
     - Khung hình GIF tự động chạy vòng lặp chuyển động 2D mượt mà với huy hiệu `GIF • Chạm để nghe 🔊` nhỏ gọn ở góc khung hình.
     - Các hạt ánh sáng 2D và biểu tượng ngữ cảnh chuyển động nhẹ nhàng xung quanh chủ thể chính, thu hút ánh nhìn ngay lập tức.
  2. **Khi học sinh chạm vào khung hình GIF (Tap-to-Speak & Boost)**:
     - Khung hình bật nảy đàn hồi (`scale + spring bounce`), kích hoạt hiệu ứng sóng lan tỏa (ripple burst), phát âm từ vựng qua kênh Media Audio và rung nhẹ xúc giác.
  3. **Khi học sinh chọn đáp án Đúng (Victory Reaction Burst)**:
     - Khung hình GIF chuyển sang chế độ **Ăn mừng (Celebration Burst)**: chủ thể phóng nhẹ lên kèm hào quang xanh ngọc lục bảo (`#10B981`), mưa sao vàng 2D bắn tung tóe bên trong khung hình đồng bộ với tiếng chuông chiến thắng.
  4. **Khi học sinh chọn đáp án Sai (Alert Shake Reaction)**:
     - Khung hình GIF chuyển sang chế độ **Cảnh báo (Error Jolt)**: khung hình rung lắc ngang, viền chuyển sắc đỏ san hô (`#EF4444`) kèm hiệu ứng tia chớp nhắc nhở để học sinh tập trung nhìn lại từ khóa.

- **Ngôn ngữ thiết kế & Bố cục 1 màn hình (Visual Identity & Single-Screen Ergonomics)**:
  - **Tối ưu 100% trên 1 màn hình (Zero-Scroll Mobile & Tablet)**:
    - Chiều cao khung hình GIF tự động co giãn thông minh theo tỷ lệ màn hình (`clamp(105px, 16.5dvh, 165px)` trên điện thoại dọc và mở rộng cân đối ở cột trái trên máy tính bảng xoay ngang), luôn đảm bảo 4 nút đáp án phía dưới có khoảng hở lề đáy rộng rãi, dễ bấm bằng một ngón cái.
  - **Phân bổ màu sắc 60-30-10 & Tương phản Sáng/Tối**:
    - **60% Nền Canvas**: Giữ độ sâu hiện đại của giao diện Tối (`#0F172A`) và Sáng (`#F8FAFC`).
    - **30% Bề mặt Khung GIF**: Lớp kính mờ bảo vệ có viền ánh sáng dịu, tự động điều chỉnh độ tương phản cho tranh nét chì ở cả chế độ Sáng và Tối.
    - **10% Điểm nhấn Chuyển động**: Các hạt ánh sáng (Particles), tia lấp lánh và viền phản hồi trạng thái (`#38BDF8` khi đang phát âm, `#10B981` khi trả lời đúng, `#EF4444` khi trả lời sai).
  - **Hiệu năng mượt mà 60fps**: Chỉ sử dụng các thuộc tính tăng tốc phần cứng (`transform`, `opacity`) kết hợp Canvas/SVG 2D nhẹ, không gây nóng máy hay giật lag trên điện thoại cấu hình thấp.

---

### 3. Key Product Decisions & Trade-Offs

- **Quyết định 1: Kiến trúc Kết xuất Ảnh Động Đa Lớp (Hybrid Animated GIF Canvas + SVG Motion Engine)**
  - *Giải pháp lựa chọn*: Kết hợp luồng ảnh minh họa gốc (được làm sống động bằng hiệu ứng chuyển động 2D đa tầng + Canvas Particle Overlay + bộ tạo khung GIF động trực tiếp trên trình duyệt) cùng hệ thống Hoạt Cảnh Chủ Đề Động (Animated Topic Scenes) cho các từ chưa có ảnh riêng.
  - *Lý do*: Nếu tải hàng trăm tệp `.gif` nhị phân nặng (mỗi tệp 2MB–5MB), ứng dụng sẽ tốn hàng trăm MB dung lượng, gây trễ mạng khi chuyển câu. Kiến trúc Hybrid GIF Engine vừa tạo ra chuyển động GIF chân thực, sắc nét ở mọi độ phân giải màn hình Retina, vừa tải tức thì `0ms` và hoạt động hoàn toàn offline trên thiết bị.
  - *Phương án đã loại bỏ*: Tải tệp `.gif` tĩnh dung lượng lớn từ máy chủ bên ngoài (dễ vỡ hạt, nặng bộ nhớ và gây khựng khi chuyển câu hỏi nhanh).

- **Quyết định 2: Bộ Nhớ Đệm Hoạt Cảnh Tức Thì (Lookahead Motion Preloader)**
  - *Giải pháp lựa chọn*: Nâng cấp bộ nạp trước (Preloader) để chuẩn bị sẵn kịch bản chuyển động, màu sắc hạt ánh sáng và hình ảnh của 4 câu hỏi tiếp theo trong hàng đợi.
  - *Lý do*: Đảm bảo khi học sinh vừa bấm qua câu mới, hoạt cảnh GIF đã chạy mượt ngay từ mili-giây đầu tiên mà không có khung hình trắng.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Sơ đồ Kiến trúc Hệ thống Ảnh Động GIF (Architecture & Component Diagram)**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     KHO DỮ LIỆU & ÁNH XẠ HÌNH ẢNH                        │
│  ┌──────────────────────────────┐   ┌────────────────────────────────┐  │
│  │ 58 Tranh Từ Vựng Hiện Có     │   │ Bộ Sinh Hoạt Cảnh Động 2D      │  │
│  │ (Pencil Art + Kịch bản GIF)  │   │ (Cho 100% Từ Vựng IELTS/TOEIC) │  │
│  └──────────────┬───────────────┘   └───────────────┬────────────────┘  │
└─────────────────┼───────────────────────────────────┼───────────────────┘
                  └─────────────────┬─────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               BỘ ĐIỀU PHỐI CHUYỂN ĐỘNG GIF (GIF MOTION ENGINE)           │
│  • Phân tích từ khóa, chủ đề (Topic) & loại từ để chọn kịch bản chuyển   │
│    động 2D (Float, Pulse, Wave, Orbit, Sketch-Jitter, Sparkle)          │
│  • Nạp trước (Preload) vào bộ nhớ đệm cho 4 câu hỏi kế tiếp             │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│          KHUNG HÌNH ĐỘNG TƯƠNG TÁC TRÊN THẺ CÂU HỎI (VIEWPORT)           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ [Lớp 1: Nền Khí Quyển Động theo Chủ Đề (Ambient Gradient Loop)]   │  │
│  │ [Lớp 2: Chủ Thể Minh Họa Chuyển Động 2D (Animated Subject Layer)] │  │
│  │ [Lớp 3: Hệ Thống Hạt & Ánh Sáng Canvas 60fps (Particle & Glow)]   │  │
│  │ [Lớp 4: Huy Hiệu GIF + Sóng Âm Tương Tác Chạm (Tap-to-Speak HUD)] │  │
│  └─────────┬──────────────────────┬───────────────────────┬──────────┘  │
└────────────┼──────────────────────┼───────────────────────┼─────────────┘
             │ Chạm vào ảnh         │ Trả lời ĐÚNG          │ Trả lời SAI
             ▼                      ▼                       ▼
     ┌───────────────┐      ┌───────────────┐       ┌───────────────┐
     │ Phát âm Media │      │ Hiệu ứng Pháo │       │ Hiệu ứng Rung │
     │ + Sóng lan tỏa│      │ Sao + Hào quang│      │ Cảnh báo Đỏ   │
     └───────────────┘      └───────────────┘       └───────────────┘
```

- **Mô hình Dữ liệu & Trạng thái Chuyển động (Data Model & State)**:
  - Mỗi câu hỏi khi đi qua bộ tiền xử lý sẽ được gắn cấu hình `gifMotionConfig` gồm:
    - `visualType`: `'illustrated_gif'` (với 58 từ có tranh minh họa gốc được chuyển thành GIF động) hoặc `'procedural_gif_scene'` (với các từ vựng còn lại trong ngân hàng 761 câu và đề thi AI).
    - `motionPreset`: Kiểu chuyển động 2D chủ đạo phù hợp với ngữ nghĩa từ vựng (`'breeze_float'`, `'energy_pulse'`, `'orbital_wave'`, `'sketch_lively'`, `'rising_growth'`).
    - `particleTheme`: Bảng màu hạt ánh sáng và biểu tượng phụ trợ theo chủ đề (Môi trường, Công nghệ, Kinh doanh TOEIC, Giáo dục, Sức khỏe, Du lịch, Xã hội...).
    - `reactionState`: Trạng thái hiện tại của khung hình (`'idle_loop'`, `'speaking_wave'`, `'correct_celebration'`, `'wrong_shake'`).

- **Ánh xạ Tương tác & Luồng Trạng thái (Interactive Component & State Mapping)**:
  - **Khởi tạo câu hỏi**: Hiển thị khung hình động ở mọi chế độ học (trừ chế độ Nghe chép chính tả cần ẩn chữ/hình gợi ý lộ đáp án nếu cần, hoặc hiển thị hoạt cảnh sóng âm GIF động không lộ chữ).
  - **Sự kiện chạm vào khung hình GIF**: Kích hoạt phát âm từ vựng qua kênh Media, đổi trạng thái khung hình sang `'speaking_wave'` trong `950ms` kèm hiệu ứng vòng sáng lan tỏa và phản hồi xúc giác nhẹ.
  - **Sự kiện chấm điểm Đúng / Sai**: Đồng bộ tức thì trạng thái `'correct_celebration'` (bắn hạt sao vàng + phóng nhẹ chủ thể) hoặc `'wrong_shake'` (rung khung hình + chớp viền cảnh báo) cùng lúc với ngăn kéo giải thích và âm thanh phản hồi.
