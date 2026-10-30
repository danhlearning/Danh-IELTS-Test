# Kế Hoạch Khởi Chạy Dev Server & Cải Tiến: Danh Học IELTS & TOEIC Arena

Bản kế hoạch này đặt **Ưu tiên số 1 là khắc phục ngay lỗi Dev Server không khởi chạy (`bun install failed` / thiếu cấu hình `package.json`)** để ứng dụng chạy ngay lập tức trên cổng `3000` (`0.0.0.0`), đồng thời bổ sung **Chế độ Nghe Phát Âm (Audio Quiz)**, **Bảng Thống Kê Tiến Độ Mastery (Lv.1 – Lv.5)** và **Sao Lưu / Khôi Phục Dữ Liệu JSON**.

## User Review & Critical Decisions

> [!IMPORTANT]
> Trong chế độ Lập Kế Hoạch (Planning Mode), hệ thống chỉ bắt đầu ghi file cấu hình và khởi chạy Dev Server sau khi bạn nhấn nút **Proceed (Tiếp tục / Phê duyệt)** trên bản kế hoạch này.

- **Ưu tiên Khẩn cấp — Khởi chạy Dev Server (Port 3000)**: Tạo ngay cấu hình dự án chuẩn hóa để chạy máy chủ tĩnh trên cổng `3000` (`0.0.0.0`), giải quyết triệt để lỗi `The dev server didn't start` và `bun install failed: exit status 1`.
- **Quyết định 1 — Tính năng trọng tâm mới**: Bổ sung **Chế độ Nghe Phát Âm đoán từ vựng (Audio Listening Quiz)** với nút phát âm 2 tốc độ (Chuẩn 1.0x & Chậm 0.75x) và **Bảng Thống Kê Tiến Độ Mastery (Lv.1 🌱 đến Lv.5 💎)**.
- **Quyết định 2 — Ngôn ngữ thiết kế & Trải nghiệm iPhone 17 Pro Max**: Giữ nguyên ngôn ngữ **iOS 27 Liquid Glass**, tỷ lệ khung hình **440 × 956pt (Zero-scroll 100dvh)**, bộ đôi font **Nunito & Be Vietnam Pro**, tinh chỉnh độ mượt chuyển cảnh và Dynamic Island.
- **Quyết định 3 — Lưu trữ & Sao lưu dữ liệu**: Vận hành độc lập tốc độ cao với `LocalStorage` kết hợp tính năng **Xuất / Nhập file JSON (Backup & Restore)**.

---

## 1. Overview & Core Concept

- **Nguyên nhân lỗi Dev Server hiện tại**: Dự án được import từ kho mã nguồn nhưng chưa có tệp cấu hình `package.json` định nghĩa lệnh chạy `dev` và `build`, khiến trình quản lý gói báo lỗi `exit status 1` và máy chủ cổng `3000` không thể tự động bật.
- **Giải pháp khắc phục tức thì khi thực thi**:
  1. Thiết lập cấu hình khởi chạy chuẩn gọi trực tiếp máy chủ Node.js lắng nghe trên `0.0.0.0:3000` với đầy đủ MIME types và headers chống lưu cache cũ.
  2. Khởi động lại Dev Server để giao diện iPhone 17 Pro Max hiển thị ngay trong khung Preview.
  3. Tích hợp liền mạch các nâng cấp: Chế độ Nghe Phát Âm, Bảng thống kê tiến độ Mastery Lv.1–Lv.5 và Sao lưu/Khôi phục JSON.

---

## 2. User Experience & Visual Design

### Luồng Trải Nghiệm Người Dùng (Key User Flows)

1. **Khởi Chạy Tự Động Ngay Lập Tức (Zero-Config Boot)**:
   - Ngay khi máy chủ cổng `3000` khởi chạy, màn hình hiển thị khung iPhone 17 Pro Max với ván đấu 10 câu hỏi Adaptive đầu tiên, đồng hồ 15.0 giây và 3 tim sinh mệnh sẵn sàng.
2. **Luồng Chế Độ Nghe Phát Âm (Audio Listening Arena)**:
   - Người chơi có thể chọn chuyên đề **"🎧 Luyện Nghe Phát Âm (Audio Quiz)"** từ bảng chọn chế độ hoặc gặp câu hỏi Nghe đan xen trong chế độ Adaptive.
   - Khi câu hỏi xuất hiện, hệ thống tự động đọc vang từ/cụm từ mục tiêu kèm hiệu ứng sóng âm Liquid Glass sinh động.
   - Người chơi có thể chạm nút **🔊 Nghe Chuẩn (0.92x)** hoặc **🐢 Nghe Chậm (0.72x)** để nghe lại rõ từng âm tiết, sau đó chọn nghĩa tiếng Việt hoặc chính tả đúng trong 4 phương án.
3. **Luồng Bảng Thống Kê Tiến Độ Mastery (Lv.1 – Lv.5 Dashboard)**:
   - Mở trực tiếp từ nút biểu đồ **📊 Tiến độ** trên thanh điều khiển hoặc từ màn hình Tổng kết vòng đấu.
   - Hiển thị tổng quan: Tổng số từ đã học, Độ nhớ trung bình (Retention %), Số từ cần ôn gấp (Weak Words), và biểu đồ thanh ngang phân bổ 5 cấp độ:
     - 🌱 **Lv.1 Mới tiếp xúc** • 🌿 **Lv.2 Đang học** • 🌸 **Lv.3 Nhớ tốt** • ⭐ **Lv.4 Nhuần nhuyễn** • 💎 **Lv.5 Thành thạo**
   - Cho phép lọc danh sách từ theo từng cấp độ Lv.1–Lv.5 hoặc danh sách **Từ Yếu**, chạm vào bất kỳ từ nào để nghe phát âm tức thì, hoặc bấm **"🔥 Luyện Ngay Các Từ Yếu"** để vào ngay ván 10 câu chuyên biệt.
4. **Luồng Sao Lưu & Khôi Phục Dữ Liệu (JSON Backup & Restore)**:
   - Ngay trong Bảng Thống Kê Mastery, người học có thể bấm **"⬇ Xuất Dữ Liệu (.json)"** để tải file hồ sơ học tập về máy, hoặc **"⬆ Nhập Dữ Liệu"** để khôi phục toàn bộ lịch sử SRS và cấp độ Mastery.

### Định Hướng Thẩm Mỹ & Giao Diện (Visual Identity & Theme)

- **Aesthetic Direction**: **iOS 27 Liquid Glass Pro** — Kính quang học đa tầng (`backdrop-filter: blur(28px) saturate(190%)`), viền khúc xạ ánh sáng mảnh (`1px solid rgba(255, 255, 255, 0.14)`), bố cục công thái học ngón cái (Thumb-Zone Ergonomics) vừa khít 100% khung hình iPhone 17 Pro Max (`440 × 956pt`).
- **Bảng màu & Chế độ Sáng/Tối**:
  - *OLED Dark Mode*: Nền đen sâu tuyệt đối kết hợp 3 quầng sáng chuyển động nhẹ (`#020617`, `#0f172a`), điểm nhấn xanh lam ngọc (`#38bdf8`), tím tinh vân (`#818cf8`), xanh lục bảo khi trả lời đúng (`#10b981`) và hồng ngọc cảnh báo (`#f43f5e`).
  - *Crisp Light Mode*: Nền trắng sứ trong trẻo (`#f8fafc`), thẻ kính sáng nổi khối mềm mại, độ tương phản chữ cao.
- **Typography & Phân cấp thị giác**:
  - **Nunito** (700/800/900): Dùng cho đồng hồ đếm ngược `tabular-nums`, điểm số XP, nhãn cấp độ, nút bấm xúc giác 3D.
  - **Be Vietnam Pro** (400/500/600/700): Dùng cho nội dung câu hỏi học thuật, giải thích ngữ pháp tiếng Việt và phiên âm IPA.
- **Chuyển động & Phản hồi tương tác**:
  - Mọi thao tác chạm nút có độ lún vật lý (`transform: scale(0.97)`) phản hồi dưới `150ms`.
  - Hộp thoại **Dynamic Island** co giãn đàn hồi thông báo chuỗi Combo, hồi tim, thăng cấp Mastery và trạng thái sao lưu dữ liệu.

---

## 3. Key Product Decisions & Trade-Offs

- **Quyết định 1: Khởi chạy Dev Server bằng Node HTTP thuần không phụ thuộc gói bên ngoài**
  - *Giải pháp chọn*: Định nghĩa script `"dev"` và `"start"` chạy trực tiếp máy chủ Node.js lắng nghe trên `0.0.0.0:3000` mà không cài đặt các gói phụ thuộc nặng dễ gây lỗi trình cài đặt.
  - *Lý do*: Đảm bảo `install_applet_dependencies`, `compile_applet` và `restart_dev_server` thành công 100% trong chưa đầy 1 giây, đồng thời giữ nguyên môi trường CommonJS cho 4 bộ kiểm thử tự động.
- **Quyết định 2: Cơ chế tạo câu hỏi Audio Quiz động từ Ngân hàng 371 câu**
  - *Giải pháp chọn*: Tự động tổng hợp thử thách Nghe Phát Âm (`audio_listen`) từ kho từ vựng IELTS & TOEIC hiện có kết hợp Web Speech API giọng chuẩn (`pitch: 1.18`, `rate: 0.92` và chế độ nghe chậm `rate: 0.72`).
  - *Lý do*: Cho phép luyện nghe toàn bộ 371 mục từ vựng mà không làm phình dung lượng tải trang và không làm thay đổi cấu trúc dữ liệu gốc.
- **Quyết định 3: Lưu trữ LocalStorage kết hợp Xuất/Nhập JSON tiêu chuẩn**
  - *Giải pháp chọn*: Đóng gói toàn bộ dữ liệu `ielts_memory_profiles`, `ielts_srs_matrix`, `ielts_weak_words` vào cấu trúc JSON có kiểm tra tính hợp lệ khi nhập/xuất.
  - *Lý do*: Đảm bảo tốc độ phản hồi tức thì khi đang đấu tốc độ 15 giây và bảo vệ dữ liệu học tập lâu dài của người dùng.

---

## 4. Technical Architecture & Data Strategy

### Sơ Đồ Kiến Trúc Hệ Thống & Luồng Khởi Chạy

```
┌─────────────────────────────────────────────────────────────────────────┐
│             NODE.JS RUNTIME & DEV SERVER (0.0.0.0 : PORT 3000)          │
│  [ Cấu hình Khởi Chạy ] ──► [ Static HTTP Server ] ──► [ 4 Test Suites ]│
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   IPHONE 17 PRO MAX VIEWPORT (440×956pt)                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ TẦNG 1: MONITORING HEADER & DYNAMIC ISLAND                        │  │
│  │ [3 Tim Sinh Mệnh] • [Dynamic Island] • [Khối Lớp | 📊 Tiến Độ]   │  │
│  │ [Câu X/10]        • [Đồng Hồ 15.0s]  • [Điểm XP & Vạch Photon]   │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ TẦNG 2: LIQUID GLASS QUESTION ARENA                               │  │
│  │ • 6 Chế độ gốc: letter_fill, meaning_match, collocation, v.v.     │  │
│  │ • Chế độ mới: 🎧 audio_listen (Sóng âm + Loa Chuẩn 1x / Chậm 0.7x)│  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ TẦNG 3: THUMB ACTION ARENA & BÀN PHÍM XÚC GIÁC 3D                 │  │
│  │ [Power-ups: 50:50 | Đóng Băng 3s | Gợi Ý]                         │  │
│  │ [4 Nút Đáp Án Spatial Touch] HOẶC [Bàn Phím 8 Ký Tự 3D + Undo]   │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ HỆ THỐNG MODAL & NGĂN KÉO LIQUID GLASS                            │  │
│  │ • Ngăn kéo Giải thích ngữ pháp súc tích 1 câu                     │  │
│  │ • Bảng Thống Kê Mastery (Lv.1 -> Lv.5) + Luyện Từ Yếu + JSON I/O  │  │
│  │ • Sổ Tay Từ Vựng Phòng Thi (Exam Vault) & Tổng kết Wordle Emoji   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mô Hình Dữ Liệu & Quản Lý Trạng Thái (Data Model & State)

1. **Hồ Sơ Trí Nhớ Từ Vựng (`memoryProfiles`)**:
   - Lưu trữ theo khóa từ vựng (`word`): `{ word, testedCount, failCount, consecutiveCorrect, lastSeen, avgResponseTime, masteryLevel (1..5), retention (25..100) }`.
2. **Cấu Trúc Gói Sao Lưu JSON (`BackupPayload`)**:
   - `{ version: "3.1", exportedAt: ISOString, memoryProfiles: {...}, srsMatrix: {...}, weakWordIds: [...] }`.
3. **Biến Thể Câu Hỏi Nghe Phát Âm (`AudioQuizVariant`)**:
   - Tạo động từ câu hỏi gốc với cờ `isAudioQuiz: true`, ẩn mặt chữ tiếng Anh trên đề bài, hiển thị bộ điều khiển sóng âm tương tác (Phát chuẩn `0.92x` & Phát chậm `0.72x`), yêu cầu người học nghe âm thanh để chọn đúng từ vựng hoặc nghĩa tiếng Việt tương ứng.

### Ánh Xạ Thành Phần Tương Tác & Xử Lý Sự Kiện (Interactive Component Mapping)

- **Khởi chạy máy chủ & Kiểm thử tự động**: Ngay sau khi phê duyệt kế hoạch, hệ thống thiết lập cấu hình khởi chạy, chạy `install_applet_dependencies`, `compile_applet` và `restart_dev_server` để bật máy chủ cổng `3000`.
- **Nút Mở Bảng Thống Kê Mastery (`#btn-mastery-stats`)**: Tính toán thời gian thực số lượng từ ở từng cấp `Lv.1` đến `Lv.5`, vẽ thanh tiến độ phần trăm, liệt kê danh sách từ theo bộ lọc cấp độ và gắn sự kiện phát âm cho từng thẻ từ.
- **Chế Độ Ôn Tập Từ Yếu & Nghe Phát Âm (`data-filter="audio"` / `data-filter="weak"`)**: Bổ sung vào bảng chọn Đấu Trường, cho phép người học chủ động kích hoạt ván đấu 10 câu thuần Nghe Phát Âm hoặc 10 câu tập trung giải quyết các từ đang nằm trong nhóm Từ Yếu.
- **Bộ Điều Khiển Sóng Âm (`#audio-quiz-panel`)**: Tích hợp trực tiếp vào thẻ câu hỏi khi ở chế độ Nghe, gồm nút Phát lại lớn ở trung tâm và nút Nghe chậm `🐢 0.7x`.
- **Bộ Công Cụ Sao Lưu JSON (`#btn-export-json`, `#btn-import-json`)**: Xuất trực tiếp tệp `danh-ielts-backup-YYYY-MM-DD.json` và đọc tệp tải lên qua `FileReader` kèm thông báo trạng thái trên Dynamic Island.
