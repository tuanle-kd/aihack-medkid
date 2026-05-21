# MediKid-AI — Danh Sách Các Màn Hình Thực Hiện (Screens Export & Development Plan)

> Kế hoạch phân rã màn hình chi tiết cho **Phụ huynh (Mobile View)** và **Bác sĩ (Desktop View)** qua 3 Sprint dựa trên thiết kế thực tế từ **Stitch System** và tài liệu [MediKid-AI_3Sprint.md](../../../MediKid-AI_3Sprint.md).

---

## 🎨 Tích hợp Thiết kế Stitch & Bản đồ Màn hình

MediKid-AI đã được thiết kế hoàn chỉnh trên hệ thống thiết kế Stitch với các màn hình mẫu trực quan, sẵn sàng phục vụ cho việc phát triển giao diện.

### 📱 Phân Hệ Phụ Huynh (Mobile View - Thiết kế Mobile-first)

| ID Màn hình Stitch | Tên Màn hình & Mô tả | Giao diện Thực tế (Screenshot Link) | Sprint Triển khai |
| :--- | :--- | :--- | :--- |
| `31a4fa38a5f5434ea30f163e8bed94ef` | **US-001: Consent Gate (Decree 13)**<br>Giao diện chặn yêu cầu đồng ý bảo mật thông tin y tế theo Nghị định 13 trước khi sử dụng AI. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ujEBsrD5Fu3JfKoyuRhjSOO8aFSSkczwM_sf-nsDOItjsf7qQ6wrQ3DMXDwpEmq5EFy_Qw4a9buYdxz6q7h4i9MUZlvVZseob46ee06HxGyDX_D8KOoZGzpGOtzK5mLE0rQp28zOms5V-z4kDTwO6jKga7635ikLcB69UrjqA0EEU2Z-gyQO7YDYu5Owa1M_CJtPt7OZJQW6ZijDV4tUvay6k-kkk1lyO_KOBw8-G8VP2jk6J3h7pWDW7c) | Sprint 1 (Tuần 1-2) |
| `a7ef0842df4843c28b049b7409be33ed` | **US-001: Parent Registration**<br>Màn hình đăng ký thông tin số điện thoại của phụ huynh. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ui_6ON1WnmHg4yn4J-BUqInqsjLz_p2nAZ2MSIO5mIgbg3RC8nmDGFBlRs0T14EQNsZUpqP4dnaTdC-FhtywEk6zrTU4DuQLXgH5xNycvcG32zY8ZU838qIBucYYdREYSghmwqK4ToWNOQTGElCzvUGimd79KLSGB2bxWk2Tl0p785IIq4WnQf0fJrfBZgrisr2Pdh0sD5Mf0Ry4afzmVkmpKfjSI6qhnqcr6DRXyqUO5noY_anosWUoHY) | Sprint 1 (Tuần 1-2) |
| `860e5a7cbb364ec3ba65b0e325d1c27b` | **US-008: OTP Verification**<br>Màn hình nhập mã xác thực OTP gửi qua SMS của phụ huynh kèm bộ đếm ngược. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0uiAsw7O0bdiA9vdg18OZ11iugduy8uZV9KYS2B8i-w2m8ai51LqBnjBNJsElCbTxdI-lnQnDf2NUfdTGUXKqZyCvOKaNNkDuiptZ9gXcVJK4nnaBHEts6hYSnDSFJnBKDhiWYzhPngErsAUct6AOAB9GMNMdUNKfFkODjC7HHcox9jucrxpA85GtklnxTCf01GMZqSj4_tNxZ48NxIZaMB2FH1aoQyvHB-QaJvUSBr3ixhIybzbnLpGitY) | Sprint 1 (Tuần 1-2) |
| `6b4fa63321d74a458e8e43c3514f77a9` | **Thêm hồ sơ bệnh nhi (Add Child)**<br>Giao diện thêm thông tin chi tiết của bé (Họ tên, Ngày sinh, Cân nặng, Tiền sử). | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0uifJ74QzuI_MfjbAbHJC5DfyYnZgD8Dm6c_dl7bJIKAg-G0s7UzWCE0Sdd8lz2VMxtYj2Tm1O6EWDgx_tSgzQLLhjmIlBAyqpzQdb4HpubVRStjlAEEuw1PFKpCEV8XZc7iHPg2qUJFqeM8Fuafn6X3QtJnidtR1uyjFyoEQDgm7UQ4OjCtLocW5O9LmE-rRGweryPhrQWbwit5K2FOJZx6reGatiudBJkDxt5INpggqSSE5onUFE_u1g) | Sprint 1 (Tuần 1-2) |
| `e39e5ebdeecb449e96d25693c9c7c1aa` | **US-012: Parent Chat & Anxiety Detection**<br>Khung tư vấn Chat AI tích hợp bộ phát hiện lo âu của mẹ (Calm, Concerned, Panic). | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ujMnhJWCZRgkv4pF7N43PNGGOqWx8-JAuEh3RC5cIgYFzUuRTMyN9azCSS4lBIAyfYrFnhyUKpAQRg0uDeYZmN0Im798DKEDTPDHtBmyeD_LRsa-xGGEr3dyvNo2ssg85pCIo--897Iooq-4tNZeKkT_tmZ0fbP_vr-y7yxLpYG6LD4L74hMGoC5uJN39U93wdzqnEqtT0S8fSCvu_O-nzwSIg-L-g9ywAF1PDcUoowYb9okhTFdeE-ycA) | Sprint 2 & 3 |
| `62cc7dded4554976a3133f3743848858` | **US-039: Emergency Guardrail Mobile**<br>Giao diện cảnh báo đỏ khẩn cấp khi phụ huynh nhập từ khóa nguy kịch (co giật, tím tái...). | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ujm3pXFhDrVGfJAT3rN6FKcOBGLQTa9blW6EXjAYVy3IcXuwPsbeMuZ3bTWc7UFsi7MvC21ISYFd1VNateELTO5f7-3bBIrd9i7mv19i5hGn_11puy4V9OlReLz-gSNexNkeHGOQHGRKilVGNYVHZ-XPDbxNo5xT8b0n5pBLxPJQEBMqzW0EOEJ4phVgH9OtjSYYz-eFnHuZPIcAqt98Rh7Yf0RU6gweUG35EN2ityo47JD87jaOzMopLo) | Sprint 2 (Tuần 3-4) |
| `eb78bab321b74ece9f9f8e86f7ca7063` | **Mô phỏng: Phụ huynh nhận phản hồi**<br>Màn hình Chat hiển thị phản hồi đã được kiểm duyệt và ký số điện tử bởi Bác sĩ nhi khoa. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ugpXP7ISj6TFGvxrXEG-f73lgwvbQL-O7yEvgrtWT4PAGMG5ikdFhZSJpdS_0XdgDKxNVw4U0awrAfkhR7J6x-z7SIQzQ8cr-2ifWL7m8LNZK0wApxJrM7TjFKvaFqHY_g8-lGRSHFxUFzTd2pSZc1Xqn5nTuxOsPfYkhVp2ySE8clppo4oUHKM0NCCvg2iys0rlYcr75kyfTsHyzMrOt_vAwejbgv90IqEo9_G5HusPB6HwmYvJR5--w) | Sprint 3 (Tuần 5-6) |
| `fe63772b8c424eb8a8e93f6fee978332` | **Mô phỏng: Kế hoạch chăm sóc dị ứng**<br>Kế hoạch chăm sóc và hướng dẫn dùng sữa chi tiết do AI cá nhân hóa gửi về cho mẹ. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0uheESU1BxdkVtPfCDLsmFtXvjzKIJvxn3ekiTX2xEGIUKuTahlmOpnw5vTaINwpUMdJd6Umj1aAMQ9HDNZ63uUhFuGFVEyKd4UfCv9cPNgMFF4BuVa11blNlUUfMwRMU_ArnoEf3iPqf0fhvAVsFEhh9BkF3ptd4Xw9lGyvwDHSkKr8VR-qkq8AmtYDkFyurAVMphLEoYVSKpOa2C6obsYyZglCbUl596SciGB3k7Ry1A_hZY5gF6DMlT8) | Sprint 3 (Tuần 5-6) |
| `8b592a736a0b4ff9a57549303b05e741` | **Video Call Tư vấn Trực tiếp**<br>Giao diện kết nối gọi điện Video trực tiếp cho các ca bệnh phức tạp. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ugVHnvXngKoLKTaaBLkZXEKk8S9OEG_oj5wuvY4Pigmx_TCDXNHtsTjBd4hYjMxXqoIdg5wEv1G4NA8MEkN1FjPtHep5vlqgWhE326k4Q6-uZnjeWPpVcRO-u1D1ipW3TLyYJBYv9OSlDps9J0nydlSooe73ArXzImGuQCKVFEPNCYxMhLhAmhDH07V64v4XDbpHtPeF7nFK9CkcJQNr7p1tKrHKx7L7qzxDozDfeA4U2ck1nN6VXaaVZU) | Hậu Hackathon |

### 🖥️ Phân Hệ Bác Sĩ & Quản Trị (Desktop-first)

| ID Màn hình Stitch | Tên Màn hình & Mô tả | Giao diện Thực tế (Screenshot Link) | Sprint Triển khai |
| :--- | :--- | :--- | :--- |
| `34455d536e904aee8f70e2ec1529a20b` | **Bác sĩ: Hàng đợi Duyệt ca (Queue)**<br>Danh sách hàng đợi các ca cần duyệt phân cấp theo mức độ lo âu của mẹ và thời gian chờ (SLA). | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ugq5KUgAY78vfRL9jyUqf0rL722brvD2iY_qiLJRSVSm6lNy5sH2APjB5RHgaffvRwhee6eS1NJILgq9Y6Pi2uciabFw2rOxs_X98wCiAKsdFW5-r5Yp4KQhZ6BKU6-G8XYN5xyW5dO-QIL0vn7iawIzCJ_ipelcO5GMJzgXFZ_0HXBbBrJ1S31H3Vmd2-gX0g7tli9l39fJYBaS8oMYhWgGjQ_QJJzxjb-uWlot87kO93Dc31d1bF7N-k) | Sprint 2 (Tuần 3-4) |
| `bd9e6ccfe9634b888ac6511291df9d89` | **US-052: Case Review & AI Draft**<br>Giao diện chi tiết ca bệnh: Xem thông tin trẻ, EMR y khoa, ảnh phân tích và trình biên tập Rich Text cho đơn thuốc nháp do AI soạn thảo. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0uhhqUzoPr4QrxD_guaDto3jRncDyIfRuQzuRHTlZ_GPfZTGbkhPn1GmSJfxn2tRYmSQKye8iKQZ6lxpSblWdsgNnDEen64G3X3LhUK7FWrT3qfXzxq8BGPOrXiaEp1HK8VZzulsP3cfaRDMVGnxBvcy_JLhNIw3MZZXcQwdowtOm7GCTrh1JhlkYV0qjx9Zh6Pr5Y_lqYNnxRQRDZgbrLTHjJkGmofguww5md77kV7unAWunJORbM7MCw0) | Sprint 2 & 3 |
| `8f7de81dc8a848119579857bae3eea42` | **US-054: So sánh Draft & Edit (Diff)**<br>Công cụ so sánh sự khác biệt từ và ký tự trực quan giữa câu trả lời gốc của AI và câu chỉnh sửa cuối cùng của bác sĩ. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ujQkHTTabEjlyoWnmtOv8sdKQz4ZB3a7Lellr5BuA19Hv7jotreSbmHinrjthrwrN_HOxgLKCh8Z1ood8crdtMyFd0freMOihxHBDhHwHboThtwJztlUpbgK2D7gQNqwCBzei-YWzc2kn3c8sCIIgbuXW4FS9TjQNLjTkoYs9f_vQ50R_yrqURDxwGl-T9OHIBV8kKJ7k_rRGMx8jyX5VKax7Qb4Ei9b_gtRELvYkiUOTatsdhwZvm-D3c) | Sprint 3 (Tuần 5-6) |
| `27a24bfeabc5465a96e784708b72881a` | **Mô phỏng: Duyệt ca Dị ứng sữa**<br>Giao diện duyệt chi tiết của ca bệnh dị ứng đạm sữa bò thực tế, xem hồ sơ IgG và tiền sử gia đình. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0uiildqcEB5iMj7AiVNg8KDkDZKsnCXGPTwYH7NEB9diNxbkpOCoc0HwXWiuAxzd76QdpSsqP2xsm4EZwn-a1CxinJ94wxWGGEQZTMefN-bfmjZSGzLGoNbEcyGJktL45CmvNjBJ3CT57iS6ZTxMFWGLfRHPH_yiS-uVFT7aUvNGMVgK49ZaWfvBsBwKvYsc2eLn2vNHu_snZ5vEqCJhFr9j6u-B7riQ6J3f8YLpYC2_kh5H9qrKMGk5u3w) | Sprint 2 & 3 |
| `df889ac8268242a29e8ea8b131f2236d` | **Admin: Sandbox Prompt & RAG**<br>Bảng điều khiển kỹ thuật dành cho nhà phát triển/giám khảo kiểm chứng pipeline AI, RAG và Prompts. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0ugd8PkNiApnpv34NX-YlWoBz3fksLCYPIFJEoY0aDJBYubaaeF-UpIiHZyPI0xtm-E8zckn5v936kJOU6rYI0Aqvs7UlX2BxoXIXnSPO3fiwaJftgy_7HUXAqzByEffaW8T7sl6VtQUPr_3b4j8DK4xS-ilemz_sQ8VmNTcFEg1rls-SbVkNETq5p1ZSUQQ1W_ZHbBL51OO-7UP2fYusu2hqiIPtV7rKMTl0x_qYFuuhgTwoiLDNqHbius) | Sprint 3 (Tuần 5-6) |
| `f8eb2a39a38d40b0bc281f5106e97ede` | **Admin: Báo cáo Vận hành**<br>Trang dashboard thống kê lượng ca bệnh, thời gian duyệt SLA, tỷ lệ chỉnh sửa AI Draft và cảnh báo chất lượng. | [Xem Giao diện](https://lh3.googleusercontent.com/aida/ADBb0uglLDjPmlwhz7Ag4JAxECpNXpx2K8DzAB0eUNwYUq7bFstIgBWt95VRCACBaWNzq4VPTTK3eylEhkx_J0nZw3ljppiwBoAFbBCfS717owr32COXDB3yBKH8_34L-dBnVE1kPZ6i3RsKHmjRz9ryRrR5fbZ6RYkS9yLu6nOpo4JxfVXQODf6HwrK68PYyKxNPO1D3Z5zLEeqcIk5JJv1L97dePq8mJsGDwV84LjCZQUgFKATMqZTmq8w4LE) | Sprint 3 (Tuần 5-6) |

---

## 📅 Lộ Trình Phát Triển 3 Sprint Chi Tiết

Dựa trên thiết kế Stitch và các tài liệu đặc tả y tế, kế hoạch phát triển được chia làm 3 Sprint cụ thể:

### 🚀 Sprint 1: Nền Tảng Xác Thực, Pháp Lý & Đồng Ý Y Khoa
*   **Thời gian:** Tuần 1 - Tuần 2
*   **Mục tiêu chính:** Thiết lập cơ chế bảo mật dữ liệu y tế nhạy cảm của trẻ em và tạo các bước chặn pháp lý y khoa bắt buộc.
*   **Các Màn hình & Tích hợp:**
    *   **Màn hình 1 (Consent & Disclaimer Gate):** Chặn người dùng ngay khi khởi tạo session. Bắt buộc nhấn đồng ý điều khoản bảo mật theo Nghị định 13 của Chính phủ trước khi AI hoặc Bác sĩ có quyền xem thông tin. Lưu log đồng ý kèm Session UUID v4.
    *   **Màn hình 2 (Parent Registration & OTP):** Form nhập số điện thoại đơn giản, giả lập xác thực qua mã OTP y tế 6 chữ số. Tự động đăng xuất sau 4h idle.
    *   **Màn hình 3 (Child Profile):** Hồ sơ y khoa 1 con gồm Họ tên, Ngày sinh (DatePicker tiếng Việt), Giới tính, Cân nặng để nạp vào context AI.
*   **Trạng thái Demo:** Đã tích hợp sẵn logic `ConsentModal` nổi, tự động sinh UUID v4 và mock database cho hồ sơ trẻ.

### ⚡ Sprint 2: UI Tư Vấn, Cảnh Báo Nguy Kịch & Hàng Đợi Bác Sĩ
*   **Thời gian:** Tuần 3 - Tuần 4
*   **Mục tiêu chính:** Xây dựng dòng chảy thông tin mượt mà từ Phụ huynh -> Cảnh báo lâm sàng -> Bác sĩ duyệt.
*   **Các Màn hình & Tích hợp:**
    *   **Màn hình 4 (Parent Chat UI):** Bong bóng chat trực quan, tích hợp giả lập thu âm giọng nói (ASR) tiếng Việt và giả lập camera tải ảnh tổn thương da của trẻ.
    *   **Màn hình 5 (Emergency Alert Screen):** Bộ lọc từ khóa khẩn cấp (<50ms) quét tin nhắn. Nếu phát hiện triệu chứng nguy kịch (co giật, tím tái...), lập tức chuyển hướng sang màn hình đỏ khẩn cấp. Hiển thị nút gọi Hotline 115 và danh sách 5 bệnh viện nhi lớn tại TP.HCM.
    *   **Màn hình 6 (Doctor Case Queue):** Danh sách hàng đợi ca bệnh cho Bác sĩ, tự động sắp xếp theo độ lo âu của phụ huynh (Anxiety Badge: Calm, Concerned, Panic) và thời gian chờ (SLA cảnh báo cam/đỏ).
    *   **Màn hình 7 (Case Detail UI):** Panel chi tiết ca bệnh cho bác sĩ bao gồm thông tin trẻ, tóm tắt câu hỏi, hiển thị ảnh và EMR đồng bộ từ VCLINIC.
*   **Trạng thái Demo:** UI hàng đợi, Emergency filter, và giao diện chi tiết ca bệnh đã có sẵn trong Single-page split-screen để dễ dàng trình duyệt.

### 🧠 Sprint 3: Trí Tuệ Nhân Tạo (AI Pipeline), RAG & Duyệt Đơn Thuốc Nháp
*   **Thời gian:** Tuần 5 - Tuần 6
*   **Mục tiêu chính:** Tích hợp pipeline AI thực tế, cơ sở dữ liệu tri thức y khoa và tính năng chỉnh sửa đơn thuốc nháp y tế.
*   **Các Màn hình & Tích hợp:**
    *   **Màn hình 8 (Rich Text AI Draft Editor):** Trình soạn thảo AI Draft (sử dụng TipTap Rich Text Editor) hiển thị câu trả lời khuyến nghị được sinh bởi AI. Cho phép bác sĩ chỉnh sửa trực tiếp (định dạng, in đậm, danh sách thuốc) trước khi nhấn duyệt gửi.
    *   **Màn hình 9 (RAG Sources & Computer Vision overlay):** Hiển thị nguồn tài liệu tham chiếu (sách Nhi khoa, phác đồ) mà AI đã vector search để bác sĩ kiểm tra chéo. Mock bounding box CV khoanh vùng phát ban trên ảnh.
    *   **Màn hình 10 (Debug Console Panel):** Kích hoạt nhanh bằng `Ctrl + Shift + D`, hiển thị log kỹ thuật thời gian thực của pipeline RAG, prompts, và payload API cho BGK Hackathon kiểm chứng.
*   **Trạng thái Demo:** Hệ thống pipeline, mock database vector, EMR sync đã được xây dựng hoàn chỉnh và kết nối thành công.

---

## 🛠️ Hướng dẫn Trình diễn & Kiểm thử (Hackathon Demo Guide)

Hệ thống được thiết kế dưới dạng **Split-screen Simulation** trên một trang duy nhất (`src/app/page.tsx`) để tạo hiệu ứng WOW lớn nhất khi thuyết trình:

1.  **Bước 1: Chấp thuận pháp lý:**
    *   Mở trình duyệt lên, trang sẽ hiển thị **Consent Modal** nổi. Đọc cảnh báo y khoa và nhấn *"Tôi đã đồng ý"* để bắt đầu session.
2.  **Bước 2: Phụ huynh nhắn tin tư vấn:**
    *   Bên trái (Mobile View), nhấn vào **Giả lập Mic** để tự động nhập câu hỏi về trẻ (ví dụ: dị ứng sữa, phát ban) hoặc gõ thủ công. Nhấn **Gửi**.
3.  **Bước 3: Tự động phân tích & Phân cấp hàng đợi:**
    *   Hệ thống AI xử lý: Gắn Anxiety Badge dựa trên ngôn từ của mẹ, trích xuất triệu chứng và đưa ca bệnh vào hàng đợi của Bác sĩ bên phải (Desktop View) ngay lập tức.
4.  **Bước 4: Bác sĩ xem EMR & Duyệt bản nháp:**
    *   Bác sĩ click vào ca bệnh trong hàng đợi.
    *   Xem hồ sơ bệnh án **VCLINIC EMR**, xem bảng xét nghiệm dị nguyên **IgG** của bé.
    *   Xem bản nháp đơn thuốc/chăm sóc do AI đề xuất. Bác sĩ chỉnh sửa bản nháp trực tiếp và nhấn **APPROVE & DISPATCH**.
5.  **Bước 5: Đồng bộ thời gian thực:**
    *   Ngay khi bác sĩ duyệt, bên trái (Mobile View) sẽ xuất hiện bong bóng phản hồi chính thức của bác sĩ y khoa kèm cảnh báo an toàn.
6.  **Bước 6: Cảnh báo khẩn cấp (Emergency Bypass):**
    *   Hãy thử gõ cụm từ nguy kịch như *"bé bị co giật tím tái"* và nhấn Gửi.
    *   Lập tức màn hình điện thoại bên trái sẽ chuyển sang **Màu đỏ cảnh báo cấp cứu khẩn cấp**, bypass hoàn toàn AI để bảo vệ tính mạng trẻ.
7.  **Bước 7: Bật Debug Console:**
    *   Nhấn nút **⚡ Debug** hoặc `Ctrl + Shift + D` dưới chân màn hình để hiển thị log kỹ thuật, chứng minh tính minh bạch của RAG và AI.
