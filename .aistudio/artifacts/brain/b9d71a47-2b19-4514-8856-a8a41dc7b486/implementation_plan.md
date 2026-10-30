# Kế Hoạch Tối Ưu Hóa Khung Hiển Thị Câu Hỏi & Bố Cục Ảnh Tràn Viền

Bản kế hoạch này tập trung tái thiết kế toàn diện **Khu vực Câu hỏi trung tâm (Question Arena)** nhằm tối đa hóa diện tích hiển thị, phóng lớn cỡ chữ câu hỏi chính để người học nhìn rõ ngay lập tức, đồng thời áp dụng bố cục **Ảnh tràn ngang sát viền trên thẻ (Full-Bleed Top Hero)** cho các câu hỏi có hình ảnh minh họa.

## User Review & Critical Decisions

> [!IMPORTANT]
> Hệ thống sẽ thực thi thay đổi giao diện ngay sau khi bạn nhấn nút **Proceed (Tiếp tục / Phê duyệt)** trên bản kế hoạch này.

- **Quyết định 1 — Bố cục câu hỏi có hình ảnh minh họa**: Áp dụng thiết kế **Ảnh tràn ngang sát viền trên thẻ, chữ nằm gọn phía dưới** — hình ảnh minh họa mở rộng toàn bộ chiều ngang khung thẻ câu hỏi (`100% width`), bo tròn khớp sát mép trên của thẻ, phần chữ câu hỏi và ô điền ký tự nằm gọn gàng trong vùng đệm bên dưới.
- **Quyết định 2 — Tinh gọn tối đa thành phần phụ để nhường chỗ cho câu hỏi chính**: **Tự động ẩn các dải tag phụ ở đầu thẻ, chân thẻ và câu dẫn thừa** để dành trọn diện tích dọc và ngang cho hình ảnh minh họa cùng nội dung câu hỏi chính.
- **Quyết định 3 — Phóng lớn tỷ lệ chữ câu hỏi & ô từ vựng**: Nâng cấp toàn bộ thang chữ hiển thị câu hỏi chính và ô điền từ khuyết để chữ to, sắc nét, dễ đọc lướt nhanh trong thời gian đếm ngược 15 giây mà vẫn đảm bảo nguyên tắc không cuộn dọc (`Zero-scroll 100dvh`).

---

## 1. Overview & Core Concept

- **Mục tiêu cốt lõi**: Giải phóng không gian bị chiếm dụng bởi các nhãn thông tin phụ (cấp lớp, nhãn chuyên đề, ghi chú chân thẻ, câu dẫn lặp lại) và khoảng trống lề ngoài, chuyển toàn bộ diện tích đó cho **Nội dung câu hỏi chính** và **Khung ảnh minh họa**.
- **Hai trạng thái hiển thị thông minh**:
  1. **Câu hỏi纯 văn bản / Điền từ (Text-Only Focus Mode)**: Thẻ câu hỏi mở rộng toàn khung, căn giữa câu hỏi chính với cỡ chữ lớn vượt trội (`1.1rem – 1.7rem` tùy độ dài câu) và dải ô ký tự rõ nét.
  2. **Câu hỏi có hình ảnh minh họa (Full-Bleed Image + Text Mode)**: Ảnh minh họa tràn sát 3 cạnh trên-trái-phải của thẻ câu hỏi với chiều cao lớn, sắc nét; phần câu hỏi và ô điền từ được bố trí cân đối ngay phía dưới ảnh.

---

## 2. User Experience & Visual Design

### Sơ Đồ Bố Cục Khung Câu Hỏi Mới (Visual Layout Architecture)

```
┌─────────────────────────────────────────────────────────────────────────┐
│             TRẠNG THÁI 1: CÂU HỎI CÓ HÌNH ẢNH (FULL-BLEED)              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │           [ ẢNH MINH HỌA TRÀN NGANG SÁT VIỀN TRÊN THẺ ]           │  │
│  │             (100% Chiều Ngang Khung • Hiển Thị Rõ Nét)            │  │
│  │                                                                   │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │                     [ C _ M M _ N I T Y ] (🔊)                    │  │
│  │                                                                   │  │
│  │       "The local ________ came together to clean the beach."      │  │
│  │            (Chữ câu hỏi kích thước lớn, tương phản cao)           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│            TRẠNG THÁI 2: CÂU HỎI VĂN BẢN (MAXIMIZED TEXT)               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │                                                                   │  │
│  │      "She has a strong ________ in environmental protection       │  │
│  │             and sustainable urban development." (🔊)              │  │
│  │                                                                   │  │
│  │         (Toàn bộ chiều cao thẻ dành trọn cho câu hỏi lớn)         │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tinh Chỉnh Chi Tiết Giao Diện & Tỷ Lệ Hiển Thị

1. **Mở rộng diện tích Khung Câu Hỏi (Question Section)**:
   - Giảm khoảng cách lề trên và lề dưới bên ngoài khung câu hỏi để thẻ câu hỏi vươn rộng tối đa giữa thanh Header và cụm nút Đáp án.
   - Tăng tỷ lệ co giãn linh hoạt (`flex-grow`) giúp khung câu hỏi tận dụng toàn bộ không gian trống trên màn hình.
2. **Bố cục Ảnh Tràn Viền Trên (Edge-to-Edge Top Image)**:
   - Khi câu hỏi có hình ảnh minh họa, khung ảnh tự động bung rộng `100%` chiều ngang của thẻ câu hỏi, áp sát viền trên và hai viền bên (không còn bị bó hẹp trong khung nhỏ ở giữa như trước).
   - Chiều cao vùng ảnh đạt tỷ lệ vàng (`~52% – 58%` diện tích thẻ câu hỏi), sử dụng chế độ hiển thị sắc nét kết hợp lớp chuyển sắc viền dưới tinh tế để tách biệt mượt mà với phần chữ.
3. **Phóng lớn Cỡ Chữ Câu Hỏi Chính & Ô Điền Ký Tự**:
   - Tăng kích thước chữ câu hỏi trên cả 4 cấp độ độ dài:
     - Câu ngắn (`XL`): Tăng từ cỡ nhỏ lên **1.35rem – 1.72rem**, độ đậm cao, dễ đọc ngay từ cái nhìn đầu tiên.
     - Câu vừa (`MD`): Tăng lên **1.18rem – 1.48rem**.
     - Câu dài (`SM` & `XS`): Tăng lên **1.02rem – 1.28rem** với khoảng cách dòng thoáng đãng.
   - Các ô điền ký tự từ vựng (`Letter Boxes`) được phóng lớn kích thước ô và chữ bên trong để tương xứng với câu hỏi.
4. **Tự động ẩn gọn Tag phụ & Câu dẫn thừa**:
   - Ẩn dải huy hiệu đầu thẻ (Khối lớp, Band điểm, Cấp độ Mastery, Chế độ, Chủ đề), nhãn gợi ý chân thẻ và dòng câu dẫn phụ lặp lại để mắt người học tập trung 100% vào hình ảnh và câu hỏi chính.
   - Giữ nguyên cấu trúc dữ liệu ngầm để hệ thống chấm điểm, phát âm và thuật toán lặp lại ngắt quãng (SRS) hoạt động liền mạch.
