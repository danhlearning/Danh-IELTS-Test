# Kế Hoạch Phát Triển: Luyện Phát Âm Giọng Nói (Voice Check) & Nhiệm Vụ Ngày (Daily Streak)

Kế hoạch nâng cấp tập trung vào **2 tính năng trọng tâm** bạn đã chọn, tuân thủ nghiêm ngặt triết lý thiết kế **gọn trên 1 màn hình di động/máy tính bảng**, **chừa khoảng hở lề dưới thoải mái cho ngón cái**, ít chữ dễ đọc và **phản hồi hình ảnh – âm thanh – rung Haptic kích thích**.

---

## 1. Mini-Game Luyện Phát Âm Chấm Điểm Qua Giọng Nói (`🎙️ Voice Check`)

Tích hợp trực tiếp vào menu **Kho Trò Chơi (`🧩`)** trên thanh điều hướng cùng với *Sắp xếp câu* và *Luyện nghe*.

### Trải nghiệm & Giao diện (1 màn hình gọn gàng)
- **Thẻ Từ & Câu Ngắn Gọn**: Hiển thị nổi bật Từ mục tiêu, phiên âm chuẩn IPA, nghĩa ngắn gọn và 1 câu ví dụ ngắn (tối đa 6–8 từ) để người học đọc từ đơn hoặc đọc cả cụm từ mà không bị rối mắt.
- **Nút Nghe Mẫu & Nút Thu Âm Ngón Cái**:
  - Nút **🔊 Nghe mẫu** phát giọng đọc chuẩn để người học bắt chước ngữ điệu.
  - Cụm nút **🎙️ Chạm để nói** đặt ở vùng ngón cái (cách cạnh đáy màn hình một khoảng hở an toàn), kèm vòng sóng âm (Voice Wave Pulse) chuyển động mượt theo nhịp thu âm.
- **Chấm Điểm Trực Quan & Phản Hồi Tức Thì**:
  - Sử dụng `Web Speech API` (`SpeechRecognition` / `webkitSpeechRecognition`) kết hợp bộ chấm điểm độ khớp âm tiết để trả về **Điểm phát âm (0% – 100%)** ngay sau khi nói.
  - Tô màu xanh các từ phát âm chuẩn và gạch chân vàng từ cần đọc rõ hơn.
  - Kích hoạt **âm thanh chiến thắng + rung Haptic + hiệu ứng pháo sáng** khi đạt từ 80% trở lên, hoặc cho phép bấm **"🎙️ Thử lại"** ngay lập tức nếu muốn cải thiện điểm số.

---

## 2. Hệ Thống Nhiệm Vụ Hàng Ngày & Chuỗi Ngày Học (`🔥 Daily Quests & Streak`)

Tạo động lực quay lại học mỗi ngày với phản hồi phần thưởng giàu cảm xúc mà không làm chật khung hình chính.

### Trải nghiệm & Giao diện
- **Nút Chuỗi Ngày Học (`🔥 Streak`) Trên Header**:
  - Hiển thị số ngày học liên tiếp kèm chấm thông báo khi có nhiệm vụ hoàn thành chờ nhận thưởng.
  - Khi bấm vào sẽ mở **Popup Nhiệm Vụ & Chuỗi Ngày Học** với chiều cao thoáng, hiệu ứng trượt mượt mà và nút đóng/nhận thưởng đặt cao vừa tầm ngón cái.
- **Lịch Chuỗi 7 Ngày & 3 Nhiệm Vụ Tự Động Làm Mới Mỗi Ngày**:
  - **Thanh Chuỗi 7 Ngày (T2 – CN)**: Hiển thị trực quan các ngày đã giữ lửa học tập trong tuần.
  - **3 Nhiệm vụ ngắn gọn trong ngày**:
    1. 🎯 *Khởi động nhạy bén*: Trả lời đúng 5 câu hỏi bất kỳ.
    2. 🧩 *Chinh phục Kho Trò Chơi*: Hoàn thành 3 lượt *Luyện phát âm*, *Sắp xếp câu* hoặc *Luyện nghe*.
    3. ⚡ *Bậc thầy phản xạ*: Đạt chuỗi Combo 3x trở lên trong ngày.
- **Hiệu Ứng Nhận Thưởng Kích Thích**:
  - Mỗi nhiệm vụ hoàn thành sẽ sáng nút **"🎁 Nhận thưởng (+XP)"**.
  - Khi bấm nhận thưởng, hệ thống phát **âm thanh nổ xu sảng khoái + rung Haptic đa tầng + mưa hạt sáng**, đồng thời cộng trực tiếp điểm thưởng vào tổng điểm của người chơi và lưu bền vững trên máy (`localStorage`).

---

## 3. Các Hạng Mục Triển Khai Kỹ Thuật

1. **Cập nhật `index.html`**:
   - Thêm mục **🎙️ Luyện phát âm** vào menu thả xuống `#mini-games-dropdown-menu` (`🧩`).
   - Thêm nút huy hiệu **🔥 Streak & Nhiệm vụ ngày** trên thanh công cụ và cấu trúc `#daily-quest-modal-overlay` tối ưu cho thao tác ngón cái.
2. **Cập nhật `style.css`**:
   - Thiết kế giao diện thẻ thu âm giọng nói, vòng sóng âm động (`@keyframes voicePulse`), thước đo điểm số phát âm % và giao diện thẻ nhiệm vụ ngày gọn thoáng, đảm bảo khoảng cách an toàn với mép dưới màn hình.
3. **Cập nhật `app.js`**:
   - Xây dựng chế độ chơi `voice_check`: tích hợp `SpeechRecognition`, thuật toán chấm điểm phát âm theo từ, hiển thị từng từ đúng/sai và hỗ trợ chế độ mô phỏng thông minh nếu trình duyệt thiết bị tắt quyền mic.
   - Xây dựng bộ quản lý `DailyStreakManager`: theo dõi chuỗi ngày học liên tiếp, tự động cập nhật tiến độ 3 nhiệm vụ ngày khi người chơi trả lời đúng / đạt combo / chơi mini-game, cùng hiệu ứng âm thanh & Haptic khi nhận thưởng.
4. **Kiểm thử tự động (`test_adaptive_learning.js`)**:
   - Bổ sung bộ kiểm thử cho chế độ **Luyện phát âm (`voice_check`)** và **Hệ thống Nhiệm vụ ngày & Streak**.
