# MediKid-AI — MVP Product Specification

> **Version:** STANDALONE-WEB-MVP.2026  
> **Audience:** Developer team  
> **Scope:** Themes · Epics · User Stories với Acceptance Criteria và Story Points  

---

## Tóm tắt dự án

MediKid-AI là web app tư vấn nhi khoa từ xa. Phụ huynh mô tả triệu chứng của con bằng text, giọng nói, hoặc ảnh tổn thương. Hệ thống kéo hồ sơ bệnh nhân từ VCLINIC, tìm kiếm trong knowledge base lâm sàng, phân tích ảnh qua Computer Vision, rồi tổng hợp thành bản nháp phản hồi. Bác sĩ review, chỉnh sửa nếu cần, approve — tin nhắn mới đến phụ huynh.

**Không có gì được gửi đến phụ huynh mà chưa qua bác sĩ phê duyệt.**

Nếu phụ huynh mô tả triệu chứng nguy hiểm (co giật, tím tái, khó thở...), toàn bộ pipeline AI bị bypass ngay lập tức và màn hình chuyển sang hướng dẫn cấp cứu.

---

## Kiến trúc tổng quan

```
Phụ huynh gửi tin
    │
    ▼
[Emergency Filter]  ──── match ────► Emergency UI (hotline / map)
    │ no match
    ▼
[NLP normalize]  +  [CV analyze image]   ← parallel
    │
    ▼
[Fusion Layer]  ←  EMR (VCLINIC)  +  RAG (knowledge base)
    │
    ▼
[LLM → Draft]
    │
    ▼
[Bác sĩ: Review → Edit → APPROVE]
    │
    ▼
[Dispatch → Phụ huynh]
```

**Prototype scope:** Single-page React app, state quản lý bằng `useState`. ASR và camera là giả lập. VCLINIC dùng mock data. Giao diện split-screen: trái là mobile view phụ huynh, phải là desktop view bác sĩ.

---

## Themes

| ID | Theme | Mô tả |
|----|-------|-------|
| T1 | Onboarding & Legal Consent | Đồng thuận pháp lý Nghị định 13, khởi tạo và quản lý vòng đời session |
| T2 | Multimodal Symptom Ingestion | Tiếp nhận triệu chứng qua text, giọng nói (ASR), và hình ảnh tổn thương |
| T3 | EMR Sync & RAG Knowledge | Đồng bộ VCLINIC, vector search knowledge base, quản lý ngữ cảnh hội thoại |
| T4 | Emergency Safety Guardrail | Phát hiện từ khóa nguy cấp, bypass LLM, phân luồng cấp cứu theo giờ và vị trí |
| T5 | Doctor Review & Approval | Hàng đợi duyệt, chỉnh sửa bản nháp AI, dispatch tin nhắn đã duyệt |
| T6 | Feedback Loop & Learning | Ghi log chỉnh sửa, fine-tune vector weights, debug console |
| T7 | Compliance & Data Governance | Phân tách module Loại A/B-C, disclaimer y khoa, audit trail, data retention |
| T8 | Admin, Config & Reporting | Quản lý knowledge base, cấu hình hệ thống, thông báo, báo cáo vận hành |

---

## T1 — Onboarding & Legal Consent

### E1.1 — Consent Gate & Legal Flow

#### US-001 · Hiển thị pop-up đồng thuận khi tải trang

**As a** phụ huynh,  
**I want** thấy pop-up đồng thuận đúng Nghị định 13/2023 trước khi dùng bất kỳ tính năng nào,  
**So that** dữ liệu của con tôi được xử lý hợp pháp và tôi có quyền kiểm soát.

**Acceptance Criteria:**
- Pop-up che toàn bộ nội dung (modal overlay), không thể dismiss bằng click ngoài
- Văn bản trích dẫn Nghị định 13/2023/NĐ-CP về xử lý dữ liệu sức khỏe trẻ em
- Checkbox bắt buộc tích trước khi nút `[Bắt đầu]` active
- Nút `[Bắt đầu]` disabled nếu chưa tích — không có bypass
- Pop-up render trong < 300ms sau khi tải trang

**Story Points:** 3 · **Priority:** Critical

---

#### US-002 · Lưu trạng thái đồng thuận vào session

**As a** hệ thống,  
**I want** persist `isConsented = true` vào session state sau khi phụ huynh đồng ý,  
**So that** phụ huynh không bị hỏi lại trong cùng một phiên làm việc.

**Acceptance Criteria:**
- `isConsented` lưu trong `sessionStorage`
- Reload trong cùng session: không hiện lại pop-up
- Session timeout sau 4 giờ không hoạt động → reset `isConsented`
- Timestamp đồng thuận ghi vào audit log
- Console log: `[CONSENT GRANTED] <timestamp ISO>`

**Story Points:** 2 · **Priority:** Critical

---

#### US-003 · Cho phép phụ huynh xem chi tiết điều khoản

**As a** phụ huynh,  
**I want** xem chi tiết điều khoản đầy đủ trong pop-up mà không rời trang,  
**So that** tôi đọc kỹ trước khi quyết định đồng ý.

**Acceptance Criteria:**
- Nút `[Xem chi tiết điều khoản]` mở accordion ngay trong modal
- Nội dung: mục đích xử lý, loại dữ liệu, thời gian lưu trữ, quyền xóa
- Scroll độc lập trong accordion, không cuộn cả trang
- Nút `[Thu gọn]` trả về trạng thái ban đầu

**Story Points:** 2 · **Priority:** High

---

#### US-004 · Cho phép phụ huynh rút đồng thuận

**As a** phụ huynh,  
**I want** rút lại đồng thuận bất kỳ lúc nào từ menu cài đặt,  
**So that** tôi thực thi quyền phản đối theo Nghị định 13/2023.

**Acceptance Criteria:**
- Menu `[Cài đặt]` > `[Rút đồng thuận]`
- Xác nhận 2 bước với cảnh báo rõ hậu quả (xóa dữ liệu, mất lịch sử)
- Sau xác nhận: logout, clear `sessionStorage`, ghi audit log
- Confirmation email/SMS gửi trong 1 giờ

**Story Points:** 3 · **Priority:** High

---

### E1.2 — Session Lifecycle Management

#### US-005 · Tự động logout sau 4 giờ không hoạt động

**As a** hệ thống,  
**I want** phát hiện idle time > 4h và vô hiệu hóa session tự động,  
**So that** dữ liệu nhạy cảm không bị lộ khi phụ huynh bỏ quên màn hình.

**Acceptance Criteria:**
- Idle timer reset khi có tương tác (click, scroll, keystroke)
- 5 phút trước khi hết hạn: hiện toast cảnh báo
- Khi hết hạn: màn hình lock, yêu cầu xác nhận lại danh tính
- `sessionStorage` clear sau khi logout
- Log: `[SESSION EXPIRED] <session_id>`

**Story Points:** 3 · **Priority:** High

---

#### US-006 · Xóa toàn bộ dữ liệu theo yêu cầu phụ huynh

**As a** phụ huynh,  
**I want** yêu cầu xóa sạch dữ liệu của con khỏi hệ thống,  
**So that** tôi thực thi quyền xóa dữ liệu trong 72 giờ theo luật.

**Acceptance Criteria:**
- Nút `[Yêu cầu xóa dữ liệu]` trong trang cài đặt tài khoản
- Xác nhận 2 bước + gõ lại email để confirm
- Hệ thống gửi confirmation email trong 1 giờ
- Dữ liệu xóa hoàn toàn trong 72 giờ, gửi thông báo hoàn tất
- Audit log ghi record nào đã bị xóa (không lưu nội dung)

**Story Points:** 5 · **Priority:** High

---

#### US-007 · Tạo session ID duy nhất cho mỗi phiên

**As a** hệ thống,  
**I want** sinh UUID v4 duy nhất khi `isConsented = true`,  
**So that** mọi log có thể trace ngược về đúng phiên cụ thể.

**Acceptance Criteria:**
- UUID v4 sinh khi consent được cấp
- Session ID đính kèm mọi API call và log entry
- Hiển thị trong Debug Console: `[SESSION ID: <uuid>]`
- Standalone session không persist giữa các tab trình duyệt

**Story Points:** 2 · **Priority:** Medium

---

### E1.3 — User Identity & Profile

#### US-008 · Tạo hồ sơ phụ huynh khi đăng ký

**As a** phụ huynh,  
**I want** nhập tên, số điện thoại, email để tạo tài khoản,  
**So that** hệ thống nhận diện tôi và liên kết với hồ sơ bệnh nhi.

**Acceptance Criteria:**
- Form: Họ tên (bắt buộc), SĐT (bắt buộc, validate VN), Email (tùy chọn)
- OTP xác thực SĐT qua SMS trước khi tạo tài khoản
- Mật khẩu tối thiểu 8 ký tự, có chữ hoa + số
- Password hashed (bcrypt) trước khi lưu DB
- Redirect về trang chính sau khi tạo xong

**Story Points:** 5 · **Priority:** High

---

#### US-009 · Thêm hồ sơ bệnh nhi và liên kết VCLINIC

**As a** phụ huynh,  
**I want** nhập thông tin con và liên kết với mã bệnh nhân VCLINIC,  
**So that** AI có ngữ cảnh bệnh nhân cụ thể từ lần đầu tư vấn.

**Acceptance Criteria:**
- Form: Họ tên, ngày sinh, giới tính, cân nặng (tùy chọn)
- Trường `Mã bệnh nhân VCLINIC`: lookup API để verify trước khi lưu
- Một tài khoản phụ huynh có thể thêm tối đa 5 con
- Chọn con active trước khi bắt đầu tư vấn
- Avatar màu tự động phân biệt các con

**Story Points:** 5 · **Priority:** High

---

## T2 — Multimodal Symptom Ingestion

### E2.1 — Text Input & NLP

#### US-010 · Nhập văn bản tự do mô tả triệu chứng

**As a** phụ huynh,  
**I want** gõ mô tả triệu chứng theo ngôn ngữ tự nhiên vào ô chat,  
**So that** tôi không cần học cú pháp hay điền form phức tạp.

**Acceptance Criteria:**
- Ô chat nhận tối thiểu 1.000 ký tự
- Placeholder: `"Mô tả triệu chứng của con... (ví dụ: sốt, ho, phát ban)"`
- Character counter hiển thị khi > 500 ký tự
- Nút `[Gửi]` active khi có ít nhất 5 ký tự
- Enter gửi tin, Shift+Enter xuống dòng

**Story Points:** 2 · **Priority:** Critical

---

#### US-011 · Chuẩn hóa lỗi chính tả và phương ngữ tự động

**As a** hệ thống,  
**I want** xử lý văn bản qua bộ lọc NLP để chuẩn hóa trước khi vào pipeline,  
**So that** lỗi gõ của phụ huynh không ảnh hưởng đến chất lượng phân tích.

**Acceptance Criteria:**
- Sửa lỗi chính tả phổ biến tiếng Việt: `"sôt"` → `"sốt"`
- Chuẩn hóa từ không dấu: `"be bi sot"` → `"bé bị sốt"`
- Map phương ngữ Nam: `"trẹo"` → `"trớ"`
- Văn bản gốc và văn bản đã chuẩn hóa đều được lưu
- Xử lý trong < 200ms

**Story Points:** 5 · **Priority:** High

---

#### US-012 · Phân tích mức độ lo âu của phụ huynh

**As a** hệ thống,  
**I want** phân loại lo âu ẩn trong văn bản thành 3 mức: Calm / Concerned / Panic,  
**So that** bác sĩ nhận được tín hiệu cảm xúc để điều chỉnh tone phản hồi.

**Acceptance Criteria:**
- Output: `anxiety_level ∈ { calm, concerned, panic }`
- Badge mức lo âu hiển thị trên card ca trong hàng đợi bác sĩ
- Trigger từ khóa panic: `"cứu"`, `"nguy hiểm"`, `"chết"`, `"sợ quá"`
- Không hiển thị chỉ số này cho phụ huynh
- Log `anxiety_level` vào case metadata

**Story Points:** 5 · **Priority:** Medium

---

#### US-013 · Hiển thị typing indicator sau khi gửi

**As a** phụ huynh,  
**I want** thấy dấu hiệu hệ thống đang xử lý sau khi gửi tin,  
**So that** tôi biết tin nhắn đã được nhận và không gửi trùng.

**Acceptance Criteria:**
- Hiện animation ba chấm ngay sau khi nhấn `[Gửi]`
- Nút `[Gửi]` disabled trong lúc xử lý
- Animation hiển thị tối đa 10 giây
- Nếu lỗi: toast `"Không gửi được, vui lòng thử lại"`

**Story Points:** 1 · **Priority:** Medium

---

#### US-014 · Hiển thị lịch sử hội thoại trong phiên

**As a** phụ huynh,  
**I want** xem lại toàn bộ cuộc hội thoại từ đầu phiên đến hiện tại,  
**So that** tôi theo dõi được diễn tiến tư vấn.

**Acceptance Criteria:**
- Hiển thị tối đa 50 tin nhắn trong scroll view
- Tin nhắn phụ huynh bên phải, phản hồi bác sĩ/AI bên trái
- Timestamp mỗi tin nhắn
- Auto-scroll xuống tin nhắn mới nhất
- Không load lịch sử từ session cũ

**Story Points:** 3 · **Priority:** High

---

### E2.2 — ASR Voice Input

#### US-015 · Nút giả lập ASR tự điền transcript mẫu

**As a** phụ huynh,  
**I want** nhấn `[Giả lập Mic ASR]` và thấy transcript mẫu xuất hiện trong ô chat,  
**So that** demo luồng giọng nói cho investor mà không cần microphone thật.

**Acceptance Criteria:**
- Nút `[🎤 Giả lập Mic]` trong toolbar chat
- Nhấn → animation recording (pulse đỏ) trong 1.5 giây
- Sau animation: văn bản mẫu điền vào ô chat
- Văn bản có thể chỉnh sửa trước khi gửi
- Animation dừng hẳn sau khi điền xong

**Story Points:** 3 · **Priority:** Critical

---

#### US-016 · Tích hợp ASR thật tiếng Việt

**As a** phụ huynh,  
**I want** nói vào microphone và thấy văn bản xuất hiện real-time,  
**So that** tôi tư vấn nhanh hơn khi tay đang bận bế con.

**Acceptance Criteria:**
- Web Speech API với `lang='vi-VN'`
- Real-time transcription, độ trễ < 1 giây
- Interim results hiển thị mờ, final result hiển thị đậm
- WER < 20% với giọng Nam Bộ trong phòng yên tĩnh
- Fallback về text input nếu browser không hỗ trợ

**Story Points:** 8 · **Priority:** Medium

---

#### US-017 · Xử lý lỗi khi microphone bị từ chối quyền

**As a** phụ huynh,  
**I want** nhận hướng dẫn rõ khi trình duyệt chặn quyền microphone,  
**So that** tôi biết cách khắc phục thay vì bị stuck.

**Acceptance Criteria:**
- Bắt `NotAllowedError` từ `getUserMedia`
- Toast với hướng dẫn bật quyền theo từng browser (Chrome / Safari / Firefox)
- Nút `[Thử lại]` sau khi cấp quyền
- Nút `[Nhập bằng bàn phím]` làm fallback rõ ràng

**Story Points:** 2 · **Priority:** High

---

### E2.3 — Image Upload & Management

#### US-018 · Nút giả lập camera đính kèm ảnh mẫu

**As a** phụ huynh,  
**I want** nhấn `[Giả lập Camera]` để đính kèm ảnh tổn thương mẫu vào tin nhắn,  
**So that** demo luồng CV cho investor mà không cần chụp ảnh thật.

**Acceptance Criteria:**
- Nút `[📷 Giả lập Camera]` trong toolbar chat
- Nhấn → thumbnail ảnh mẫu (sẩn đỏ cánh tay) xuất hiện trong ô chat
- Ảnh có nút `[X]` để xóa trước khi gửi
- Tên file và kích thước hiển thị
- Chỉ 1 ảnh mẫu mỗi lần giả lập

**Story Points:** 3 · **Priority:** Critical

---

#### US-019 · Upload ảnh thật từ camera hoặc gallery

**As a** phụ huynh,  
**I want** chọn hoặc chụp ảnh trực tiếp từ thiết bị,  
**So that** bác sĩ thấy tổn thương thực tế của con tôi.

**Acceptance Criteria:**
- `<input type="file" accept="image/*" capture="environment">`
- Hỗ trợ JPG, PNG, HEIC, WEBP tối đa 10MB
- Preview thumbnail trước khi gửi với nút `[Chụp lại]`
- Tự nén về < 3MB nếu vượt ngưỡng
- Progress bar khi upload

**Story Points:** 3 · **Priority:** High

---

#### US-020 · Validate chất lượng ảnh trước khi xử lý CV

**As a** hệ thống,  
**I want** kiểm tra ảnh đủ sáng, đủ nét, đúng kích thước trước khi chạy CV,  
**So that** tránh kết quả CV sai lệch do ảnh kém chất lượng.

**Acceptance Criteria:**
- Blur score (Laplacian variance) > 100
- Độ sáng (luma trung bình) 40–220
- Kích thước tối thiểu 300×300px
- Nếu fail: toast `"Ảnh chưa rõ, vui lòng chụp lại trong điều kiện đủ sáng"`
- Vẫn cho phép gửi sau khi cảnh báo (không block cứng)

**Story Points:** 3 · **Priority:** High

---

#### US-021 · Hỗ trợ đính kèm nhiều ảnh trong một tin nhắn

**As a** phụ huynh,  
**I want** gửi 2–3 ảnh từ các góc khác nhau trong một lần,  
**So that** bác sĩ thấy đầy đủ vùng tổn thương.

**Acceptance Criteria:**
- Tối đa 3 ảnh mỗi tin nhắn
- Hiển thị dạng grid 3 thumbnail trong ô chat
- Xóa từng ảnh độc lập trước khi gửi
- CV chạy song song cho cả 3 ảnh, merge output
- Tổng kích thước tối đa 20MB

**Story Points:** 3 · **Priority:** Medium

---

### E2.4 — Computer Vision Analysis

#### US-022 · Khoanh vùng tổn thương bằng Active Contour

**As a** hệ thống,  
**I want** chạy thuật toán Active Contour + Saliency Map để xác định boundary tổn thương,  
**So that** Fusion Layer nhận được CV output định lượng thay vì chỉ ảnh thô.

**Acceptance Criteria:**
- Output: bounding box `(x, y, w, h)`, contour polygon, `area_px²`
- Chuyển đổi `area_px²` → `cm²` dựa trên estimated scale
- Xử lý < 3 giây trên ảnh 2MP
- Chạy on-device (WebAssembly) hoặc lightweight backend
- Fallback: nếu không detect được → trả về full image

**Story Points:** 13 · **Priority:** High

---

#### US-023 · Overlay vùng tổn thương lên ảnh cho bác sĩ

**As a** bác sĩ,  
**I want** thấy ảnh tổn thương với đường viền CV được highlight,  
**So that** tôi đánh giá kết quả CV trực quan thay vì chỉ đọc số liệu.

**Acceptance Criteria:**
- Overlay bán trong suốt (opacity 40%) màu cam trên vùng tổn thương
- Đường contour màu đỏ 2px
- Label nhỏ hiển thị diện tích ước tính (cm²)
- Toggle show/hide overlay
- Zoom ảnh 2× bằng double-click

**Story Points:** 5 · **Priority:** High

---

#### US-024 · Phân loại màu sắc và đặc điểm tổn thương

**As a** hệ thống,  
**I want** trích xuất màu chủ đạo và đặc điểm hình thái của vùng tổn thương,  
**So that** bản nháp AI có thêm mô tả khách quan về tổn thương.

**Acceptance Criteria:**
- Dominant color: đỏ / hồng / nâu / vàng / không xác định
- Hình thái cơ bản: sẩn / mảng / vết / bóng nước
- Output đưa vào system prompt LLM dạng structured text
- Log CV metadata vào case record
- Accuracy ≥ 75% trên test set nội bộ 200 ảnh

**Story Points:** 8 · **Priority:** Medium

---

### E2.5 — Multimodal Fusion Pipeline

#### US-025 · Kết hợp NLP và CV qua Fusion Layer

**As a** hệ thống,  
**I want** tính `H_t = Φ(W_nlp·f_NLP + W_cv·g_CV)` và truyền vào LLM context,  
**So that** bản nháp AI phản ánh cả thông tin ngôn ngữ lẫn thị giác.

**Acceptance Criteria:**
- `W_nlp` và `W_cv` load từ config (default: 0.6 / 0.4)
- Bệnh lý da liễu: `W_cv` tự tăng lên 0.7
- Fusion output là structured JSON đưa vào system prompt
- Log fusion weights vào debug console
- Toàn bộ pipeline < 5 giây

**Story Points:** 8 · **Priority:** High

---

#### US-026 · Tự động điều chỉnh trọng số theo loại bệnh lý

**As a** hệ thống,  
**I want** nhận diện nhóm bệnh lý từ keyword NLP và điều chỉnh `W_cv` tương ứng,  
**So that** độ chính xác fusion tối ưu theo từng ca cụ thể.

**Acceptance Criteria:**
- Mapping: da liễu/phát ban → `W_cv = 0.7`; hô hấp/ho → `W_cv = 0.3`; tiêu hóa → `W_cv = 0.2`
- Trigger keywords: `"phát ban"`, `"nổi mẩn"`, `"tổn thương da"`
- Điều chỉnh tự động, không cần bác sĩ can thiệp
- Log weight adjustment vào debug console
- Mapping có thể chỉnh trong Admin CMS

**Story Points:** 5 · **Priority:** Medium

---

## T3 — EMR Sync & RAG Knowledge

### E3.1 — VCLINIC EMR Integration

#### US-027 · Gọi VCLINIC API khi phụ huynh gửi tin nhắn

**As a** hệ thống,  
**I want** trigger VCLINIC lookup ngay khi `messages` array thay đổi,  
**So that** màn hình bác sĩ hiển thị đầy đủ hồ sơ mà không cần thao tác thủ công.

**Acceptance Criteria:**
- API call background sau khi phụ huynh nhấn `[Gửi]`
- Timeout 3 giây; retry 1 lần nếu fail
- Fail sau retry: hiện warning nhưng vẫn tiếp tục pipeline
- Log: `[VCLINIC SYNC] status + latency`
- Dữ liệu không cache quá 15 phút

**Story Points:** 8 · **Priority:** Critical

---

#### US-028 · Hiển thị hồ sơ bệnh nhân trên màn hình bác sĩ

**As a** bác sĩ,  
**I want** thấy đầy đủ họ tên, tuổi, tiền sử bệnh khi ca vào hàng đợi,  
**So that** tôi không cần tra hồ sơ riêng.

**Acceptance Criteria:**
- Panel EMR: Họ tên, SID, ngày sinh, tuổi, giới tính
- Tiền sử bệnh dạng tag chips: Trào ngược / Dị ứng / Hen suyễn...
- Thuốc đang dùng (nếu có)
- Lần khám gần nhất + chẩn đoán
- Bác sĩ phụ trách từ VCLINIC

**Story Points:** 5 · **Priority:** Critical

---

#### US-029 · Hiển thị kết quả xét nghiệm IgG

**As a** bác sĩ,  
**I want** thấy bảng IgG theo dị nguyên với màu phân mức (Xanh/Vàng/Đỏ),  
**So that** tôi nhận diện ngay pattern nhạy cảm thực phẩm.

**Acceptance Criteria:**
- Bảng: Dị nguyên | U/mL | Mức độ
- Đỏ: > 100 U/mL · Vàng: 50–100 · Xanh: < 50
- Sort giảm dần theo mức độ mặc định
- Ngày xét nghiệm hiển thị dưới bảng
- Nếu chưa có: hiện `"Chưa có dữ liệu IgG"`

**Story Points:** 5 · **Priority:** High

---

#### US-030 · Làm mới dữ liệu EMR theo yêu cầu bác sĩ

**As a** bác sĩ,  
**I want** nhấn nút refresh để lấy lại dữ liệu VCLINIC mới nhất,  
**So that** tôi có thông tin cập nhật nếu hồ sơ vừa thay đổi trên VCLINIC.

**Acceptance Criteria:**
- Nút `[🔄 Refresh EMR]` trên panel bác sĩ
- Spinner trong lúc refresh
- Timestamp `"Cập nhật lúc HH:MM"` sau khi refresh
- Cache TTL 15 phút; tự báo khi cache > 15 phút
- Nếu API fail: giữ cache cũ + toast cảnh báo

**Story Points:** 2 · **Priority:** Medium

---

### E3.2 — RAG Knowledge Base

#### US-031 · Vector search trên knowledge base lâm sàng

**As a** hệ thống,  
**I want** embed văn bản phụ huynh và cosine similarity search trên 1.000+ mẫu câu hỏi,  
**So that** bản nháp AI được căn cứ trên tri thức lâm sàng thực tế của phòng khám.

**Acceptance Criteria:**
- Top-3 kết quả similarity > 0.6 đưa vào system prompt
- Nếu tất cả < 0.6: fallback về general pediatric knowledge
- Retrieval latency < 1 giây
- Log top-3 retrieved chunks vào debug console

**Story Points:** 8 · **Priority:** High

---

#### US-032 · Hiển thị nguồn RAG cho bác sĩ

**As a** bác sĩ,  
**I want** thấy RAG snippet nào được AI dùng làm cơ sở cho bản nháp,  
**So that** tôi đánh giá được độ tin cậy của bản nháp.

**Acceptance Criteria:**
- Panel `"Nguồn tri thức AI"` thu gọn dưới bản nháp
- Top-3 snippets kèm title và similarity score
- Click vào snippet: xem full text nguồn
- Chỉ hiển thị cho bác sĩ, không hiện cho phụ huynh

**Story Points:** 3 · **Priority:** Medium

---

### E3.3 — Contextual Conversation Memory

#### US-033 · Duy trì ngữ cảnh hội thoại qua tối đa 10 lượt

**As a** hệ thống,  
**I want** encode tối đa 10 lượt trao đổi gần nhất vào `C_t` và truyền vào LLM,  
**So that** AI không hỏi lại thông tin phụ huynh đã cung cấp trước đó.

**Acceptance Criteria:**
- Rolling window 10 lượt (user + assistant)
- Compress nếu > 500 token/lượt
- `C_t` rebuild sau mỗi tin nhắn mới
- Test: gửi 6 tin liên tiếp về cùng bệnh → AI nhớ thông tin từ tin thứ 1
- Log `context_length` vào debug console

**Story Points:** 5 · **Priority:** High

---

#### US-034 · Phát hiện thay đổi chủ đề và reset context

**As a** hệ thống,  
**I want** nhận diện khi phụ huynh chuyển sang chủ đề hoàn toàn khác và reset `C_t`,  
**So that** tránh AI bị confused khi trộn lẫn hai ca bệnh khác nhau.

**Acceptance Criteria:**
- Semantic similarity giữa tin mới và `C_t` hiện tại
- Nếu similarity < 0.3: gợi ý `"Có vẻ bạn đang hỏi về vấn đề khác — bắt đầu chủ đề mới?"`
- Phụ huynh chọn: `[Tiếp tục]` hoặc `[Bắt đầu chủ đề mới]`
- Nếu chọn mới: reset `C_t`, tạo thread mới trong session

**Story Points:** 5 · **Priority:** Medium

---

#### US-035 · Tóm tắt diễn tiến triệu chứng theo thời gian

**As a** bác sĩ,  
**I want** thấy tóm tắt ngắn gọn diễn tiến triệu chứng qua các lượt trao đổi,  
**So that** tôi nắm bắt được tiến triển bệnh mà không cần đọc lại từng tin.

**Acceptance Criteria:**
- Panel `"Diễn tiến triệu chứng"` tóm tắt sau ≥ 3 lượt
- Format: ngày/giờ + triệu chứng chính của lượt đó
- Timeline dạng vertical list, mới nhất lên đầu
- Generate bởi LLM với summarization prompt riêng
- Refresh sau mỗi lượt mới

**Story Points:** 5 · **Priority:** Medium

---

## T4 — Emergency Safety Guardrail

### E4.1 — Emergency Keyword Detection

#### US-036 · Quét từ khóa nguy cấp trước tầng LLM

**As a** hệ thống,  
**I want** filter text đầu vào với danh sách hardcoded emergency keywords,  
**So that** hệ thống phản ứng trong < 100ms khi trẻ đang nguy hiểm, không gọi LLM.

**Acceptance Criteria:**
- Keywords: co giật, tím tái, khó thở, rút lõm ngực, bất tỉnh, ngừng thở
- Filter chạy synchronous trước NLP và LLM
- Biến thể: giật, tím, thở không được, ngất xỉu
- `true` → `trigger_emergency_state()` ngay lập tức
- `false` → tiếp tục pipeline bình thường
- Xử lý < 20ms

**Story Points:** 3 · **Priority:** Critical

---

#### US-037 · Hỗ trợ biến thể chính tả của từ khóa nguy cấp

**As a** hệ thống,  
**I want** nhận diện từ khóa dù phụ huynh gõ không dấu, viết tắt hoặc sai chính tả,  
**So that** không bỏ sót bất kỳ trường hợp nguy hiểm nào.

**Acceptance Criteria:**
- Chuẩn hóa lowercase + bỏ dấu trước khi match
- Fuzzy match với Levenshtein distance ≤ 1 cho từ > 5 ký tự
- Test cases: `"co giat"`, `"tim tai"`, `"kho tho"`, `"co giật"`
- Zero false negative policy: nếu uncertain → trigger emergency
- Log mỗi keyword match với raw text gốc

**Story Points:** 3 · **Priority:** Critical

---

#### US-038 · Admin quản lý danh sách từ khóa nguy cấp

**As a** bác sĩ lâm sàng,  
**I want** thêm/sửa/xóa emergency keywords qua giao diện admin,  
**So that** danh sách luôn cập nhật theo phác đồ lâm sàng mà không cần deploy.

**Acceptance Criteria:**
- Giao diện CRUD: list + add + edit + delete
- Thay đổi có hiệu lực hot-reload trong < 30 giây
- Xóa keyword: xác nhận 2 lần bắt buộc
- Audit log: ai thêm/xóa gì, lúc nào
- Export danh sách hiện tại thành CSV

**Story Points:** 3 · **Priority:** High

---

### E4.2 — Emergency UI State

#### US-039 · Chuyển toàn bộ UI phụ huynh sang Emergency State

**As a** hệ thống,  
**I want** thay chat UI bằng màn hình đỏ cảnh báo khi detect emergency keyword,  
**So that** phụ huynh nhận thức ngay mức độ nghiêm trọng.

**Acceptance Criteria:**
- Chat UI ẩn hoàn toàn (`display: none`)
- Background `#C0392B` với pulse animation (1s infinite)
- Text cảnh báo ≥ 24px bold: `CẢNH BÁO NGUY HIỂM LÂM SÀNG`
- Sub-text: `TUYỆT ĐỐI KHÔNG TỰ Ý DÙNG THUỐC`
- State chuyển trong < 200ms
- Không có ca Pending mới trong hàng đợi bác sĩ

**Story Points:** 5 · **Priority:** Critical

---

#### US-040 · Ngăn ca khẩn cấp vào hàng đợi bác sĩ

**As a** hệ thống,  
**I want** không đưa ca khẩn cấp vào hàng đợi `Pending_Review`,  
**So that** tránh trường hợp bác sĩ bận không thấy và phụ huynh không nhận được hướng dẫn khẩn.

**Acceptance Criteria:**
- Emergency flag → bypass hoàn toàn pending queue
- Không tạo draft, không gọi LLM, không gọi VCLINIC
- Log: `[EMERGENCY BYPASS] case không được tạo`
- Test: gửi keyword nguy cấp → verify queue không có entry mới

**Story Points:** 2 · **Priority:** Critical

---

### E4.3 — Time-Aware Emergency Routing

#### US-041 · Hiển thị nút gọi hotline trong giờ hành chính

**As a** phụ huynh,  
**I want** thấy nút gọi hotline KinderHealth trong giờ 08:00–20:00,  
**So that** tôi kết nối ngay với bác sĩ mà không phải tìm số điện thoại.

**Acceptance Criteria:**
- Đọc giờ thiết bị người dùng
- 08:00–20:00: hiện nút `[📞 BẤM GỌI HOTLINE KINDERHEALTH CẤP CỨU NGAY]`
- Nút kích thước tối thiểu 64×64px
- Tap → giả lập animation cuộc gọi (production: `tel:` protocol)
- Số hotline cấu hình trong Admin, không hardcode

**Story Points:** 3 · **Priority:** Critical

---

#### US-042 · Hiển thị bản đồ bệnh viện nhi gần nhất ngoài giờ

**As a** phụ huynh,  
**I want** thấy bản đồ với 2 bệnh viện nhi gần nhất khi cần cấp cứu sau 20:00,  
**So that** tôi biết ngay nơi cần đến mà không phải search map.

**Acceptance Criteria:**
- Sau 20:00: ẩn nút hotline, hiện map (Leaflet/Mapbox)
- Định vị GPS thiết bị; fallback: IP geolocation
- Pin 2 bệnh viện nhi gần nhất trong 15km
- Nếu không có trong 15km: 2 bệnh viện lớn nhất thành phố
- Text banner: `ĐƯA TRẺ ĐẾN PHÒNG CẤP CỨU BỆNH VIỆN NHI GẦN NHẤT LẬP TỨC`

**Story Points:** 8 · **Priority:** Critical

---

#### US-043 · Cấu hình giờ hành chính và số hotline qua Admin

**As a** admin,  
**I want** thay đổi giờ hành chính và số hotline mà không cần deploy lại code,  
**So that** phòng khám linh hoạt điều chỉnh khi thay đổi lịch hoặc số điện thoại.

**Acceptance Criteria:**
- Admin CMS: Giờ mở cửa / Giờ đóng cửa (HH:MM) + Số hotline
- Thay đổi có hiệu lực ngay, hot-reload
- Giá trị mặc định: 08:00–20:00
- Timezone: Asia/Ho_Chi_Minh

**Story Points:** 2 · **Priority:** High

---

## T5 — Doctor Review & Approval

### E5.1 — AI Draft Generation

#### US-044 · Sinh bản nháp từ context đa nguồn

**As a** hệ thống,  
**I want** LLM nhận system prompt tổng hợp (EMR + RAG + CV + NLP sentiment) để sinh bản nháp,  
**So that** bản nháp cá nhân hóa đến từng bệnh nhân, bác sĩ chỉ tinh chỉnh nhỏ.

**Acceptance Criteria:**
- System prompt: `[EMR_SUMMARY]` + `[RAG_SNIPPETS]` + `[CV_ANALYSIS]` + `[ANXIETY_LEVEL]`
- Viết theo văn phong KinderHealth, không chẩn đoán bệnh, có khuyến cáo hành động cụ thể
- Output < 300 từ
- Kết thúc bằng câu mời tái khám hoặc ghi nhật ký
- Sinh trong < 5 giây

**Story Points:** 8 · **Priority:** Critical

---

#### US-045 · Điều chỉnh tone theo mức lo âu phụ huynh

**As a** hệ thống,  
**I want** dùng `anxiety_level` để điều chỉnh tone bản nháp,  
**So that** phụ huynh hoảng loạn nhận phản hồi trấn an hơn.

**Acceptance Criteria:**
- `calm` → tone thông thường, đầy đủ thông tin
- `concerned` → thêm câu trấn an ở đầu
- `panic` → câu trấn an đầu tiên, thông tin súc tích, CTA rõ
- Test: 3 test cases tương ứng 3 mức
- Tone flag log vào debug console

**Story Points:** 3 · **Priority:** Medium

---

#### US-046 · Fallback draft khi EMR sync thất bại

**As a** hệ thống,  
**I want** sinh bản nháp ngay cả khi không lấy được dữ liệu EMR,  
**So that** bác sĩ vẫn nhận được bản nháp dù có sự cố kết nối VCLINIC.

**Acceptance Criteria:**
- Nếu VCLINIC timeout: dùng cache cũ (nếu có) hoặc chỉ RAG
- Bản nháp fallback có note: `[Không có dữ liệu EMR — vui lòng kiểm tra hồ sơ thủ công]`
- Warning badge màu vàng trên bản nháp
- Log: `[DRAFT_FALLBACK]` với lý do

**Story Points:** 3 · **Priority:** High

---

#### US-047 · Filter output LLM không được chẩn đoán bệnh

**As a** hệ thống,  
**I want** kiểm tra output LLM không chứa pattern chẩn đoán bệnh xác định,  
**So that** MediKid-AI không vi phạm Luật Khám bệnh chữa bệnh.

**Acceptance Criteria:**
- Blocked patterns: `"bé bị [tên bệnh]"`, `"chẩn đoán là"`, `"đây là bệnh"`
- Nếu detect: regenerate với instruction bổ sung
- Tối đa 2 lần regenerate; nếu vẫn fail → bản nháp trống + alert bác sĩ
- Log filter hit rate theo tuần

**Story Points:** 5 · **Priority:** Critical

---

### E5.2 — Doctor Pending Queue

#### US-048 · Hiển thị hàng đợi real-time khi có ca mới

**As a** bác sĩ,  
**I want** thấy ca mới xuất hiện ngay trong hàng đợi mà không cần refresh trang,  
**So that** tôi phản hồi kịp thời và không bỏ sót ca nào.

**Acceptance Criteria:**
- Real-time update qua WebSocket hoặc SSE polling mỗi 5 giây
- Ca mới: border đỏ 4px pulse trong 10 giây đầu
- Sắp xếp: thời gian chờ lâu nhất lên đầu mặc định
- Badge đếm số ca Pending trên browser tab
- Sound notification (có thể tắt trong settings)

**Story Points:** 5 · **Priority:** Critical

---

#### US-049 · Thông tin tóm tắt trên card ca bệnh

**As a** bác sĩ,  
**I want** thấy ngay tên bệnh nhân, thời gian chờ, mức lo âu, loại triệu chứng trên card,  
**So that** tôi prioritize ca nào cần duyệt trước mà không cần click vào từng ca.

**Acceptance Criteria:**
- Card: Tên + tuổi, SID, thời gian chờ, anxiety badge, có ảnh (Y/N)
- Anxiety badge: 🟢 Calm · 🟡 Concerned · 🔴 Panic
- Icon 📷 nếu ca có ảnh
- Symptom keyword chips (tối đa 3): `"phát ban"` / `"ho"` / `"sốt"`
- Thời gian chờ: `"5 phút trước"`, `"1 giờ trước"`

**Story Points:** 3 · **Priority:** High

---

#### US-050 · Lọc và sắp xếp hàng đợi

**As a** bác sĩ,  
**I want** lọc hàng đợi theo mức lo âu, có ảnh, thời gian chờ,  
**So that** tôi xử lý ca cần ưu tiên trước.

**Acceptance Criteria:**
- Filter chips: `[Tất cả]` `[Panic]` `[Có ảnh]` `[Chờ > 30 phút]`
- Sort: Chờ lâu nhất / Mới nhất / Panic trước
- Áp dụng ngay không cần submit
- Hiện `"Hiển thị 3/7 ca"` sau khi filter

**Story Points:** 3 · **Priority:** Medium

---

#### US-051 · SLA timer cảnh báo ca chờ quá lâu

**As a** admin,  
**I want** đặt ngưỡng thời gian chờ tối đa, sau đó hệ thống tự nhắc bác sĩ,  
**So that** không có ca nào bị bỏ quên.

**Acceptance Criteria:**
- Config: `SLA_warning` (default 30 phút), `SLA_breach` (default 60 phút)
- Chờ > warning: card chuyển màu cam
- Chờ > breach: card chuyển đỏ + notification đặc biệt cho bác sĩ
- Admin nhận daily report: số ca breach SLA

**Story Points:** 3 · **Priority:** High

---

### E5.3 — Inline Draft Review & Edit

#### US-052 · Mở panel chi tiết ca khi bác sĩ chọn

**As a** bác sĩ,  
**I want** click vào card ca để mở panel xem đầy đủ thông tin,  
**So that** tôi có đủ context trong một màn hình để ra quyết định.

**Acceptance Criteria:**
- Side panel slide-in từ phải
- 3 tabs: `[Hồ sơ bệnh nhân]` `[Tin nhắn & Ảnh]` `[Bản nháp AI]`
- Panel mở trong < 500ms
- Đóng bằng `[X]` hoặc Escape
- Tab `[Bản nháp AI]` active mặc định khi mở

**Story Points:** 3 · **Priority:** High

---

#### US-053 · Chỉnh sửa bản nháp AI trực tiếp

**As a** bác sĩ,  
**I want** click vào khung bản nháp và chỉnh sửa như text editor,  
**So that** tôi không cần copy-paste ra nơi khác.

**Acceptance Criteria:**
- Khung bản nháp là `contenteditable` div
- Phần AI tạo (nền vàng nhạt) vs phần bác sĩ thêm (nền xanh nhạt)
- Word count real-time + diff: `"+12 từ"`
- Auto-save draft mỗi 10 giây
- Undo/Redo (Ctrl+Z / Ctrl+Y) hoạt động

**Story Points:** 5 · **Priority:** High

---

#### US-054 · So sánh bản gốc AI và bản đã chỉnh sửa

**As a** bác sĩ,  
**I want** toggle xem diff giữa bản gốc AI và bản mình đã sửa,  
**So that** tôi kiểm tra lại thay đổi trước khi approve.

**Acceptance Criteria:**
- Nút `[Xem diff]` bên cạnh bản nháp
- Phần bị xóa: gạch ngang đỏ; phần thêm: gạch chân xanh
- Toggle qua lại `[Xem diff]` ↔ `[Xem bản hoàn chỉnh]`
- Diff ở cấp độ từ (word-level)
- Nút `[Khôi phục bản gốc AI]` nếu muốn bỏ hết chỉnh sửa

**Story Points:** 3 · **Priority:** Medium

---

#### US-055 · Gợi ý câu hỏi follow-up cho bác sĩ

**As a** bác sĩ,  
**I want** thấy 2–3 câu hỏi gợi ý để hỏi thêm phụ huynh nếu thông tin chưa đủ,  
**So that** tôi khai thác thêm mà không phải nghĩ ra từ đầu.

**Acceptance Criteria:**
- Panel `"Câu hỏi gợi ý"` dưới bản nháp
- LLM sinh 2–3 câu dựa trên gap trong thông tin
- Ví dụ: `"Bé có sốt kèm theo không?"` / `"Triệu chứng xuất hiện sau khi ăn gì?"`
- Click câu hỏi → thêm vào bản nháp
- Dismiss toàn bộ gợi ý bằng 1 click

**Story Points:** 3 · **Priority:** Medium

---

### E5.4 — Approval & Dispatch

#### US-056 · APPROVE và dispatch tin nhắn đã duyệt

**As a** bác sĩ,  
**I want** nhấn `[APPROVE & DISPATCH]` để gửi bản nháp đã chỉnh đến phụ huynh,  
**So that** tôi kiểm soát hoàn toàn nội dung phụ huynh nhận được.

**Acceptance Criteria:**
- Nút `[✅ APPROVE & DISPATCH]` nổi bật màu xanh lá
- 1 click confirm, không có dialog thêm
- Sau approve: ca chuyển `Approved`, biến khỏi Pending queue
- Dispatch đến phụ huynh trong < 2 giây
- Toast: `"Đã gửi phản hồi đến phụ huynh lúc HH:MM"`

**Story Points:** 3 · **Priority:** Critical

---

#### US-057 · REJECT ca bệnh với lý do bắt buộc

**As a** bác sĩ,  
**I want** từ chối ca và ghi rõ lý do,  
**So that** ca bị từ chối có audit trail đầy đủ.

**Acceptance Criteria:**
- Nút `[❌ REJECT]` màu đỏ
- Click → dialog: dropdown lý do + text box tùy chọn
- Xác nhận 2 lần để tránh nhầm
- Ca chuyển `Rejected`, không gửi gì đến phụ huynh
- Phụ huynh nhận toast: `"Yêu cầu của bạn cần bổ sung thêm thông tin"`

**Story Points:** 3 · **Priority:** High

---

#### US-058 · Chuyển tiếp ca cho bác sĩ khác

**As a** bác sĩ,  
**I want** forward ca cho bác sĩ chuyên khoa phù hợp hơn,  
**So that** phụ huynh nhận được tư vấn từ đúng chuyên gia.

**Acceptance Criteria:**
- Nút `[↗ Chuyển cho BS khác]`
- Dropdown chọn bác sĩ đang online trong ca trực
- Note box: lý do chuyển
- Ca xuất hiện trong pending queue của bác sĩ mới kèm context và note
- Phụ huynh không nhận thông báo trong lúc chờ

**Story Points:** 5 · **Priority:** Medium

---

#### US-059 · Ghi audit trail mọi hành động bác sĩ

**As a** hệ thống,  
**I want** log đầy đủ mọi action (approve/reject/forward) kèm account và timestamp,  
**So that** mọi quyết định lâm sàng đều có dấu vết đầy đủ.

**Acceptance Criteria:**
- Log: `{ action, account_id, case_id, timestamp_iso, session_id }`
- Append-only, không thể xóa hoặc sửa
- Accessible qua Admin > Audit Trail
- Export CSV theo khoảng thời gian

**Story Points:** 3 · **Priority:** High

---

### E5.5 — Message Delivery

#### US-060 · Hiển thị tin nhắn đã duyệt trong chat phụ huynh

**As a** phụ huynh,  
**I want** thấy phản hồi bác sĩ xuất hiện mượt trong bong bóng chat,  
**So that** trải nghiệm liền mạch như nhắn tin thông thường.

**Acceptance Criteria:**
- Tin nhắn slide-in từ phải với animation 300ms
- Âm thanh notification nhẹ kèm theo
- Badge `"Được Bác sĩ kiểm duyệt ✓"` dưới tin nhắn
- Disclaimer y khoa cố định đính kèm
- Phụ huynh có thể reply để tiếp tục hội thoại

**Story Points:** 3 · **Priority:** High

---

#### US-061 · Đính kèm disclaimer y khoa vào mọi tin nhắn AI

**As a** hệ thống,  
**I want** append disclaimer cố định vào cuối tin nhắn trước khi dispatch,  
**So that** MediKid-AI không vi phạm Luật Khám bệnh chữa bệnh.

**Acceptance Criteria:**
- Disclaimer: `"Mọi kết quả phân tích chỉ mang tính tầm soát sớm và tham khảo, không thay thế chỉ định lâm sàng của Bác sĩ chuyên khoa."`
- Append tự động, bác sĩ không thể xóa
- Font nhỏ hơn nội dung chính, màu muted
- 100% tin nhắn phải có disclaimer (kiểm thử tự động)
- Version disclaimer lưu cùng tin nhắn để trace

**Story Points:** 2 · **Priority:** Critical

---

#### US-062 · Gửi push notification khi có phản hồi

**As a** phụ huynh,  
**I want** nhận notification trên điện thoại khi bác sĩ đã gửi phản hồi,  
**So that** tôi không phải giữ app mở liên tục.

**Acceptance Criteria:**
- Web Push Notification sau khi dispatch thành công
- Nội dung: `"Bác sĩ đã phản hồi yêu cầu của bé [Tên con]"`
- Tap notification → mở đúng thread hội thoại
- Phụ huynh có thể opt-out trong settings
- Fallback: in-app badge nếu push bị từ chối

**Story Points:** 5 · **Priority:** High

---

## T6 — Feedback Loop & Learning

### E6.1 — Edit Delta Logging

#### US-063 · Capture token diff mỗi lần bác sĩ chỉnh sửa

**As a** hệ thống,  
**I want** so sánh bản gốc AI và bản sau chỉnh sửa, tính word-level diff,  
**So that** feedback loop có dữ liệu định lượng để fine-tune.

**Acceptance Criteria:**
- So sánh tại thời điểm APPROVE hoặc DISPATCH
- Diff ở cấp độ từ (Myers diff algorithm)
- Log: `{ added_words: [], removed_words: [], total_added: N, total_removed: M }`
- Lưu cùng case record
- Anonymize trước khi dùng cho training

**Story Points:** 5 · **Priority:** High

---

#### US-064 · Log bác sĩ và workflow type của mỗi ca

**As a** hệ thống,  
**I want** gắn `account_id` và `workflow_type` vào mỗi edit log,  
**So that** phân tích được pattern chỉnh sửa theo bác sĩ và loại bệnh lý.

**Acceptance Criteria:**
- Log: `{ doctor_id, doctor_name, workflow_type, case_id, session_id, timestamp }`
- `workflow_type` tự phân loại: `IgG_Food_Sensitivity` / `Respiratory` / `Skin_Lesion` / `General`
- Batch export JSON hàng ngày lúc 00:00
- Retention: 2 năm
- Chỉ Admin và AI team được xem raw logs

**Story Points:** 3 · **Priority:** High

---

### E6.2 — Vector Weight Fine-tuning

#### US-065 · Trigger re-weighting sau mỗi 50 ca được duyệt

**As a** hệ thống,  
**I want** chạy pipeline fine-tune sau mỗi milestone 50 ca hoàn thành,  
**So that** AI cải tiến liên tục mà không cần can thiệp thủ công.

**Acceptance Criteria:**
- Counter đếm ca approved, trigger khi đạt bội số 50
- Re-weighting chạy async, không ảnh hưởng production
- KPI: `avg_token_diff` trước/sau
- Nếu `avg_token_diff` tăng > 10%: rollback tự động
- Alert email đến AI team sau mỗi lần re-weight

**Story Points:** 13 · **Priority:** Medium

---

#### US-066 · Dashboard theo dõi hiệu quả AI theo thời gian

**As a** admin / AI team,  
**I want** xem biểu đồ `avg_token_diff` theo tuần và phân bổ chỉnh sửa theo bác sĩ,  
**So that** đánh giá được AI đang cải thiện hay thoái hóa.

**Acceptance Criteria:**
- Metrics: `avg_token_diff/week`, `total_cases/week`, `approval_rate`
- Bar chart: top 5 workflows có `token_diff` cao nhất
- Line chart: `avg_token_diff` trend 12 tuần gần nhất
- Filter theo bác sĩ, workflow, khoảng thời gian
- Export PDF báo cáo tháng

**Story Points:** 8 · **Priority:** Medium

---

### E6.3 — Debug Console

#### US-067 · Debug console real-time trong màn hình demo

**As a** nhà khoa học / investor,  
**I want** xem console log thời gian thực trong buổi demo 4 giờ,  
**So that** tôi hiểu cơ chế bên trong AI mà không cần đọc source code.

**Acceptance Criteria:**
- Panel toggle show/hide (nút hoặc Ctrl+Shift+D)
- Màu log theo loại: trắng=SYSTEM · xanh lá=FEEDBACK · vàng=TUNING · cyan=ML
- Auto-scroll entry mới nhất
- Timestamp ISO đến millisecond
- Nút `[Clear]` và `[Export TXT]`

**Story Points:** 3 · **Priority:** Medium

---

#### US-068 · Log latency từng stage trong pipeline

**As a** hệ thống,  
**I want** ghi thời gian xử lý của từng stage trong pipeline,  
**So that** team kỹ thuật phát hiện bottleneck.

**Acceptance Criteria:**
- Stages: `NLP_preprocess` → `RAG_retrieve` → `EMR_sync` → `CV_analyze` → `Fusion` → `LLM_draft`
- Log: `{ stage, start_ms, end_ms, duration_ms, status }`
- Hiển thị timeline trong debug console
- Alert nếu bất kỳ stage > 3 giây (configurable)
- Aggregate stats: P50/P95/P99 latency per stage

**Story Points:** 5 · **Priority:** Medium

---

## T7 — Compliance & Data Governance

### E7.1 — Module Separation

#### US-069 · Tách module hành chính thành microservice độc lập

**As a** product owner,  
**I want** đóng gói chức năng đặt lịch và tra cứu đơn thuốc thành service riêng,  
**So that** đăng ký lưu hành Loại A và commercialize ngay mà không chờ AI clearance.

**Acceptance Criteria:**
- Microservice độc lập: API riêng, DB riêng, deploy độc lập
- Chức năng: đặt lịch, xem lịch sử đơn thuốc, nhắc lịch tái khám
- Zero dependency lên AI pipeline và CV module
- OpenAPI spec đầy đủ cho hồ sơ đăng ký Bộ Y tế
- Unit test coverage ≥ 80%

**Story Points:** 13 · **Priority:** High

---

#### US-070 · Chạy module AI phân tích trong Regulatory Sandbox

**As a** compliance officer,  
**I want** deploy CV và risk stratification trong sandbox riêng biệt,  
**So that** tuân thủ thử nghiệm có kiểm soát theo Luật AI Việt Nam.

**Acceptance Criteria:**
- Domain riêng: `sandbox.kinderhealth.vn`
- Dữ liệu sandbox không sync với production DB
- Session sandbox expire sau 4 giờ
- Báo cáo audit tự động hàng tuần
- Rollback về version trước trong < 30 phút

**Story Points:** 8 · **Priority:** High

---

### E7.2 — Audit Trail & Data Retention

#### US-071 · Audit trail bất biến cho mọi sự kiện hệ thống

**As a** hệ thống,  
**I want** ghi append-only log cho mọi event quan trọng,  
**So that** hệ thống chứng minh tuân thủ pháp luật khi bị kiểm tra.

**Acceptance Criteria:**
- Events: `CONSENT_GRANTED`, `SESSION_START`, `MESSAGE_SENT`, `DRAFT_GENERATED`, `APPROVED`, `REJECTED`, `DATA_DELETED`
- Immutable store: không thể sửa hoặc xóa
- Mỗi entry có digital signature
- Retention: 5 năm
- Export theo event type và khoảng thời gian

**Story Points:** 8 · **Priority:** High

---

#### US-072 · Dashboard audit trail cho Compliance Officer

**As a** compliance officer,  
**I want** tìm kiếm và xem audit log theo nhiều tiêu chí,  
**So that** kiểm tra nhanh khi có sự cố hoặc yêu cầu từ cơ quan quản lý.

**Acceptance Criteria:**
- Filter: `event_type`, `user_id`, `case_id`, `date_range`
- Full-text search trong log content
- Kết quả phân trang, 50 entries/trang
- Export CSV/JSON kết quả tìm kiếm
- Không có quyền xóa, chỉ đọc

**Story Points:** 5 · **Priority:** High

---

#### US-073 · Xuất toàn bộ dữ liệu cá nhân theo yêu cầu

**As a** phụ huynh,  
**I want** download toàn bộ dữ liệu của con dưới dạng file,  
**So that** tôi thực thi quyền truy cập dữ liệu theo Nghị định 13/2023.

**Acceptance Criteria:**
- Nút `[Tải về dữ liệu của tôi]` trong Settings
- Generate ZIP: hồ sơ bệnh nhân, lịch sử hội thoại, ảnh đã gửi
- JSON format với schema documentation
- Processing time < 5 phút, link download qua email
- Link có hiệu lực 24 giờ

**Story Points:** 5 · **Priority:** Medium

---

## T8 — Admin, Config & Reporting

### E8.1 — Knowledge Base Admin CMS

#### US-074 · Thêm mẫu câu hỏi lâm sàng vào knowledge base

**As a** bác sĩ / admin,  
**I want** nhập câu hỏi mẫu, câu trả lời tham khảo và tags phân loại,  
**So that** RAG ngày càng phong phú theo thực tế lâm sàng.

**Acceptance Criteria:**
- Form: Câu hỏi mẫu + Câu trả lời tham khảo (rich text) + Tags (multi-select)
- Tags: da liễu / hô hấp / tiêu hóa / dị ứng / cấp cứu...
- Auto-generate embedding ngay sau khi save
- Preview similarity score với 3 câu hỏi gần nhất
- Bulk import từ CSV

**Story Points:** 5 · **Priority:** High

---

#### US-075 · Upload và index Cẩm nang y tế

**As a** admin,  
**I want** upload file PDF/DOCX Cẩm nang y tế để RAG indexing,  
**So that** bác sĩ có thể tham khảo Cẩm nang trong bản nháp AI.

**Acceptance Criteria:**
- Upload PDF/DOCX tối đa 50MB
- Auto-extract text và chunk thành đoạn 500 token
- Auto-embed và index vào vector store
- Version control: giữ 3 version gần nhất
- Trạng thái indexing: Processing / Ready / Failed

**Story Points:** 8 · **Priority:** Medium

---

#### US-076 · Test truy vấn RAG trực tiếp trong Admin

**As a** admin / AI team,  
**I want** nhập câu hỏi test và xem top results RAG trả về,  
**So that** verify chất lượng retrieval trước khi deploy knowledge base mới.

**Acceptance Criteria:**
- Ô nhập test query
- Top-5 kết quả: text snippet + similarity score + source
- Latency benchmark hiển thị
- Nút `[Chạy lại]` sau khi cập nhật knowledge base
- Export kết quả test thành CSV

**Story Points:** 3 · **Priority:** Medium

---

### E8.2 — System Configuration

#### US-077 · Cấu hình Fusion Layer weights qua Admin

**As a** admin / AI team,  
**I want** chỉnh `W_nlp` và `W_cv` cho từng nhóm bệnh lý trong giao diện admin,  
**So that** tinh chỉnh fusion model mà không cần sửa code.

**Acceptance Criteria:**
- Bảng config: Workflow | `W_nlp` | `W_cv`
- Validate: `W_nlp + W_cv = 1.0`
- Preview ảnh hưởng trên 5 ca test mẫu
- Rollback về config trước nếu cần
- Hot-reload sau khi save

**Story Points:** 3 · **Priority:** Medium

---

#### US-078 · Cấu hình LLM parameters

**As a** admin,  
**I want** chỉnh `temperature`, `max_tokens`, system prompt base qua giao diện,  
**So that** điều chỉnh hành vi AI mà không cần deploy lại.

**Acceptance Criteria:**
- Các trường: `temperature` (0.0–1.0), `max_tokens` (100–500), `top_p`
- System prompt base editable trong rich text editor
- Changelog config: ai thay đổi gì, lúc nào
- Reset về default trong 1 click

**Story Points:** 5 · **Priority:** Medium

---

#### US-079 · Cấu hình danh sách bệnh viện cấp cứu

**As a** admin,  
**I want** thêm/sửa/xóa bệnh viện nhi trong danh sách emergency,  
**So that** thông tin bệnh viện luôn chính xác và cập nhật.

**Acceptance Criteria:**
- CRUD: Tên BV, địa chỉ, tọa độ `lat/lng`, số điện thoại cấp cứu
- Map preview sau khi thêm
- Thứ tự ưu tiên hiển thị có thể kéo để sắp xếp
- Hiệu lực ngay sau save
- Import từ CSV cho bulk update

**Story Points:** 2 · **Priority:** Medium

---

### E8.3 — Notification System

#### US-080 · In-app notification khi bác sĩ có ca mới

**As a** bác sĩ,  
**I want** nhận notification trong app khi có ca mới vào hàng đợi,  
**So that** tôi phản hồi nhanh mà không cần nhìn vào hàng đợi liên tục.

**Acceptance Criteria:**
- Bell icon trên header với badge số ca chưa xem
- Dropdown 5 ca gần nhất khi click bell
- Click notification → mở đúng ca
- Mark as read khi mở ca
- Clear all notifications

**Story Points:** 3 · **Priority:** High

---

#### US-081 · SMS thông báo cho phụ huynh khi có phản hồi

**As a** phụ huynh,  
**I want** nhận SMS khi bác sĩ đã phản hồi, đặc biệt khi không có internet,  
**So that** tôi không bỏ lỡ phản hồi dù đang ở vùng internet yếu.

**Acceptance Criteria:**
- Tích hợp SMS gateway (Twilio / ESMS.vn)
- Nội dung: `"KinderHealth: Bác sĩ đã phản hồi về bé [Tên]. Xem tại: [short link]"`
- Gửi sau 30 giây nếu chưa có read receipt web
- Opt-out qua SMS STOP
- Log delivery status từ gateway

**Story Points:** 5 · **Priority:** Medium

---

### E8.4 — Operational Reporting

#### US-082 · Dashboard tổng quan vận hành

**As a** admin,  
**I want** xem KPI vận hành tổng hợp: số ca, thời gian duyệt trung bình, tỷ lệ approve,  
**So that** đánh giá hiệu suất hệ thống và đội ngũ bác sĩ.

**Acceptance Criteria:**
- Metrics: `total_cases`, `avg_response_time_min`, `approval_rate%`, `rejection_rate%`
- Phân tách theo bác sĩ
- Time filter: hôm nay / tuần này / tháng này / custom range
- Bar chart cases by day-of-week
- Export CSV

**Story Points:** 5 · **Priority:** Medium

---

#### US-083 · Báo cáo thời gian phản hồi theo từng bác sĩ

**As a** admin,  
**I want** xem `avg/min/max response time` của từng bác sĩ,  
**So that** quản lý chất lượng dịch vụ và phân bổ ca hợp lý.

**Acceptance Criteria:**
- Bảng: Bác sĩ | Số ca | Avg | Min | Max | % < 30 phút
- Sort theo `avg_response_time`
- Highlight bác sĩ có avg > 60 phút màu đỏ
- Filter theo khoảng thời gian
- Export Excel

**Story Points:** 3 · **Priority:** Medium

---

#### US-084 · Báo cáo chất lượng AI theo workflow

**As a** AI team,  
**I want** xem `avg_token_diff` và `approval_rate` theo từng workflow type,  
**So that** đánh giá AI tốt ở đâu và cần cải thiện ở đâu.

**Acceptance Criteria:**
- Bảng: Workflow | Số ca | Avg token diff | Approval rate | Rejection rate
- Sort theo `avg_token_diff` giảm dần
- Trend 4 tuần gần nhất per workflow
- Alert nếu bất kỳ workflow có `token_diff` tăng > 20% so với tuần trước
- Export CSV raw data

**Story Points:** 5 · **Priority:** Medium

---

## Story Points Summary

| Theme | Stories | Total SP |
|-------|---------|----------|
| T1 — Onboarding & Consent | 9 | 30 |
| T2 — Multimodal Ingestion | 17 | 77 |
| T3 — EMR & RAG | 9 | 41 |
| T4 — Emergency Guardrail | 8 | 29 |
| T5 — Doctor Review | 16 | 55 |
| T6 — Feedback Loop | 6 | 37 |
| T7 — Compliance | 5 | 39 |
| T8 — Admin & Reporting | 11 | 42 |
| **Total** | **84** | **350** |

---

## MVP Scope: In / Simulated / Post-MVP

| Feature | MVP Status |
|---------|-----------|
| Consent gate | ✅ In scope |
| Text input + NLP normalize | ✅ In scope |
| ASR voice input | ⚡ Simulated (giả lập transcript) |
| Image upload + CV analysis | ⚡ Simulated (ảnh mẫu, CV backend) |
| Fusion Layer | ✅ In scope |
| VCLINIC EMR sync | ⚡ Simulated (mock data) |
| RAG knowledge base | ✅ In scope |
| Context memory | ✅ In scope |
| Emergency keyword filter | ✅ In scope |
| Emergency UI + routing | ✅ In scope |
| AI draft generation | ✅ In scope |
| Doctor pending queue | ✅ In scope |
| Inline draft edit + diff | ✅ In scope |
| Approve / Reject / Forward | ✅ In scope |
| Feedback loop logging | ✅ In scope |
| Debug console | ✅ In scope |
| Push / SMS notifications | 🔜 Post-MVP |
| Admin CMS full | 🔜 Post-MVP |
| Multi-child profiles | 🔜 Post-MVP |

---

*MediKid-AI · MVP Specification · 2026 · KinderHealth · Internal use only*
