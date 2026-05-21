# MediKid-AI User Stories & Acceptance Criteria

Nguồn lập tài liệu:

- Kế hoạch sprint: `/Users/nb230601/Documents/aihack-medkid/MediKid-AI_3Sprint.md`
- Source code hiện tại: `medkid-app/src/`
- Mục tiêu: chuẩn hóa toàn bộ US/AC có đánh số để team 3 người và AI-DLC có thể dùng làm baseline backlog, plan, review và nghiệm thu.

Quy ước trạng thái:

```text
Done      Đã có trong source code ở mức demo/MVP.
Partial   Có một phần trong source code nhưng chưa đủ spec sprint.
Planned   Chưa thấy implementation rõ trong source code hiện tại.
Post-MVP  Không thuộc MVP hoặc đã đẩy sau MVP.
```

Quy ước mã:

```text
US-xxx       User Story ID theo sprint plan.
AC-xxx.y     Acceptance Criteria thứ y của US-xxx.
```

---

## Sprint 1 — Foundation

Mục tiêu sprint: phụ huynh và bác sĩ có thể vào app, consent được ghi nhận, hồ sơ bệnh nhi sẵn sàng cho luồng chat/demo.

### US-001 — Consent modal bắt buộc trước khi dùng

Status: Done
SP: 3
Source evidence:
- `src/app/page.tsx`
- `src/components/shared/consent-modal.tsx`
- `src/store/app-store.ts`

User Story:
Là phụ huynh, tôi muốn xem và xác nhận đồng thuận xử lý dữ liệu cá nhân trước khi sử dụng app, để tôi hiểu dữ liệu sức khỏe của trẻ sẽ được xử lý như thế nào.

Acceptance Criteria:
- AC-001.1 Khi người dùng chưa consent, hệ thống phải hiển thị modal consent phủ lên giao diện chính.
- AC-001.2 Nút “Bắt đầu tư vấn” phải bị disable cho đến khi người dùng tick checkbox đồng ý.
- AC-001.3 Modal phải nêu rõ bối cảnh xử lý dữ liệu cá nhân/sức khỏe trẻ em.
- AC-001.4 Người dùng có thể mở phần chi tiết điều khoản để xem mục đích xử lý, loại dữ liệu, thời gian lưu trữ và quyền của người dùng.
- AC-001.5 Sau khi người dùng đồng ý, modal biến mất và người dùng vào được app.

### US-002 — Persist consent vào sessionStorage + audit log

Status: Partial
SP: 2
Source evidence:
- `src/store/app-store.ts`
- `src/lib/mock-db.ts`
- `src/mock/data.ts`

User Story:
Là hệ thống, tôi muốn lưu trạng thái consent trong phiên và ghi audit log, để có bằng chứng người dùng đã đồng ý trước khi xử lý dữ liệu.

Acceptance Criteria:
- AC-002.1 Khi người dùng consent, hệ thống phải tạo audit event `CONSENT_GRANTED`.
- AC-002.2 Khi session bắt đầu, hệ thống phải tạo audit event `SESSION_START`.
- AC-002.3 Consent phải được duy trì trong phiên hiện tại sau khi modal đóng.
- AC-002.4 Consent phải được persist vào `sessionStorage` để refresh page không bắt người dùng consent lại trong cùng browser session.
- AC-002.5 Audit log phải chứa session ID và timestamp.

Ghi chú gap:
- Source hiện đã có audit log và state trong store.
- Chưa thấy persist consent vào `sessionStorage`.

### US-005 — Auto-logout sau 4 giờ idle

Status: Planned
SP: 3
Source evidence:
- Chưa thấy implementation rõ trong `src/store/app-store.ts` hoặc middleware.

User Story:
Là hệ thống, tôi muốn tự động kết thúc phiên sau 4 giờ không hoạt động, để giảm rủi ro truy cập trái phép vào dữ liệu sức khỏe.

Acceptance Criteria:
- AC-005.1 Hệ thống phải theo dõi thời điểm hoạt động gần nhất của user.
- AC-005.2 Nếu user idle đủ 4 giờ, hệ thống phải tự động kết thúc session.
- AC-005.3 Khi session hết hạn, user phải quay lại trạng thái cần đăng nhập/consent phù hợp.
- AC-005.4 Hệ thống phải ghi audit event `SESSION_EXPIRED`.
- AC-005.5 Timer phải reset khi user tương tác hợp lệ với app.

### US-007 — Session UUID v4

Status: Done
SP: 2
Source evidence:
- `src/store/app-store.ts`
- `src/types/index.ts`

User Story:
Là hệ thống, tôi muốn mỗi phiên tư vấn có UUID v4 riêng, để audit, debug và truy vết luồng xử lý chính xác.

Acceptance Criteria:
- AC-007.1 Khi user consent, hệ thống phải tạo session ID bằng UUID v4.
- AC-007.2 Session ID phải được gắn vào chat message, audit log, debug log và case mới.
- AC-007.3 Session ID phải không rỗng trước khi user gửi tin nhắn.
- AC-007.4 Debug console phải có khả năng hiển thị session ID phục vụ demo/troubleshooting.

### US-008 — Đăng ký phụ huynh + OTP SMS

Status: Planned
SP: 5
Source evidence:
- `src/mock/data.ts` có mock parent.
- Chưa thấy UI/API đăng ký, OTP hoặc SMS integration.

User Story:
Là phụ huynh, tôi muốn đăng ký bằng số điện thoại và OTP SMS, để tạo tài khoản an toàn trước khi sử dụng dịch vụ.

Acceptance Criteria:
- AC-008.1 User có thể nhập số điện thoại hợp lệ để bắt đầu đăng ký.
- AC-008.2 Hệ thống gửi OTP SMS hoặc mock OTP ở môi trường demo.
- AC-008.3 User có thể nhập OTP để xác thực.
- AC-008.4 OTP sai hoặc hết hạn phải hiển thị lỗi rõ ràng.
- AC-008.5 Sau khi xác thực thành công, hệ thống tạo/đọc hồ sơ parent.
- AC-008.6 Không log OTP hoặc secret vào console/debug output.

### US-009 — Tạo hồ sơ bệnh nhi một con

Status: Partial
SP: 3
Source evidence:
- `src/types/index.ts`
- `src/mock/data.ts`
- `src/store/app-store.ts`

User Story:
Là phụ huynh, tôi muốn tạo hồ sơ cơ bản cho một trẻ, để bác sĩ và AI có đủ ngữ cảnh khi tư vấn.

Acceptance Criteria:
- AC-009.1 User có thể nhập tên trẻ, ngày sinh, giới tính và cân nặng nếu có.
- AC-009.2 Hệ thống phải validate ngày sinh không nằm trong tương lai.
- AC-009.3 Hệ thống phải lưu hồ sơ trẻ vào profile của phụ huynh.
- AC-009.4 Một trẻ được chọn làm `active_child` cho phiên tư vấn.
- AC-009.5 Khi gửi case mới, tên và tuổi của trẻ phải được đưa vào case.

Ghi chú gap:
- Source hiện có mock parent/children và active child.
- Chưa có form tạo hồ sơ bệnh nhi.

### US-065 — Medical disclaimer tự động

Status: Done
SP: 2
Source evidence:
- `src/store/app-store.ts`
- `src/components/parent/chat-panel.tsx`

User Story:
Là phụ huynh, tôi muốn mọi phản hồi đã duyệt có disclaimer y tế, để hiểu nội dung chỉ mang tính tham khảo và không thay thế bác sĩ.

Acceptance Criteria:
- AC-065.1 Khi bác sĩ approve phản hồi, hệ thống phải gắn disclaimer vào message gửi cho phụ huynh.
- AC-065.2 Disclaimer phải hiển thị ngay dưới nội dung phản hồi.
- AC-065.3 Disclaimer phải nói rõ kết quả chỉ mang tính tham khảo/tầm soát và không thay thế chỉ định lâm sàng của bác sĩ.
- AC-065.4 Disclaimer không được bị xóa bởi thao tác edit draft thông thường.

---

## Sprint 2 — UI & Flow

Mục tiêu sprint: demo được toàn bộ UI và flow bằng mock data, chưa cần AI thật.

### US-010 — Text input chat box

Status: Done
SP: 2
Source evidence:
- `src/components/parent/chat-panel.tsx`
- `src/store/app-store.ts`

User Story:
Là phụ huynh, tôi muốn nhập mô tả triệu chứng của trẻ trong khung chat, để gửi thông tin cho hệ thống/bác sĩ.

Acceptance Criteria:
- AC-010.1 Chat panel phải có textarea nhập nội dung triệu chứng.
- AC-010.2 Nút gửi phải disable nếu nội dung quá ngắn hoặc hệ thống đang xử lý.
- AC-010.3 User có thể gửi bằng nút “Gửi”.
- AC-010.4 User có thể gửi bằng phím Enter, còn Shift+Enter dùng để xuống dòng.
- AC-010.5 Sau khi gửi, input phải được clear.
- AC-010.6 Message của phụ huynh phải hiển thị trong lịch sử chat.

### US-012 — Anxiety mock bằng keyword đơn giản

Status: Done
SP: 2
Source evidence:
- `src/lib/pipeline.ts`
- `src/components/doctor/case-queue.tsx`

User Story:
Là bác sĩ, tôi muốn thấy mức độ lo lắng của phụ huynh được phân loại đơn giản, để ưu tiên xử lý ca phù hợp.

Acceptance Criteria:
- AC-012.1 Hệ thống phải phân loại anxiety thành `calm`, `concerned`, hoặc `panic`.
- AC-012.2 Từ khóa như “cứu”, “nguy hiểm”, “lo quá”, “khẩn cấp” phải tăng mức anxiety.
- AC-012.3 Anxiety level phải được lưu vào case.
- AC-012.4 Queue bác sĩ phải hiển thị badge/emoji tương ứng với anxiety level.

### US-013 — Typing indicator

Status: Done
SP: 1
Source evidence:
- `src/components/parent/chat-panel.tsx`
- `src/store/app-store.ts`

User Story:
Là phụ huynh, tôi muốn thấy trạng thái hệ thống đang xử lý sau khi gửi tin nhắn, để biết yêu cầu chưa bị mất.

Acceptance Criteria:
- AC-013.1 Khi `isProcessing = true`, chat phải hiển thị typing indicator.
- AC-013.2 Trong lúc xử lý, input và action gửi phải bị disable phù hợp.
- AC-013.3 Khi xử lý xong hoặc có lỗi, typing indicator phải biến mất.

### US-014 — Lịch sử hội thoại

Status: Partial
SP: 3
Source evidence:
- `src/components/parent/chat-panel.tsx`
- `src/components/doctor/case-detail.tsx`
- `src/store/app-store.ts`

User Story:
Là phụ huynh và bác sĩ, tôi muốn xem lại các tin nhắn trong phiên tư vấn, để hiểu ngữ cảnh trao đổi.

Acceptance Criteria:
- AC-014.1 Chat panel phụ huynh phải hiển thị message theo thứ tự thời gian.
- AC-014.2 Message phải phân biệt sender: parent, doctor, system.
- AC-014.3 Message phải hiển thị timestamp.
- AC-014.4 Doctor detail phải có tab xem tin nhắn gốc của case.
- AC-014.5 Lịch sử hội thoại phải được persist qua refresh hoặc backend storage trong bản production.

Ghi chú gap:
- Source hiện lưu trong Zustand/memory, chưa persist qua refresh.

### US-015 — Giả lập mic ASR

Status: Done
SP: 3
Source evidence:
- `src/components/parent/chat-panel.tsx`
- `src/mock/data.ts`

User Story:
Là phụ huynh, tôi muốn bấm giả lập mic để điền nhanh câu mô tả triệu chứng, để demo luồng voice-to-text mà chưa cần ASR thật.

Acceptance Criteria:
- AC-015.1 UI phải có nút “Giả lập Mic”.
- AC-015.2 Khi bấm, UI phải hiển thị trạng thái đang ghi/đang xử lý.
- AC-015.3 Sau khoảng delay demo, hệ thống phải điền một câu mẫu vào input.
- AC-015.4 Nút mic phải disable khi app đang xử lý hoặc đang recording.
- AC-015.5 Nội dung ASR mẫu phải liên quan đến triệu chứng trẻ em.

### US-018 — Giả lập camera/image upload simulated only

Status: Done
SP: 3
Source evidence:
- `src/components/parent/chat-panel.tsx`
- `src/components/doctor/case-detail.tsx`
- `src/lib/pipeline.ts`

User Story:
Là phụ huynh, tôi muốn giả lập đính kèm ảnh triệu chứng, để demo flow ca có ảnh mà chưa cần upload thật.

Acceptance Criteria:
- AC-018.1 UI phải có nút “Giả lập Camera”.
- AC-018.2 Khi bấm, hệ thống phải hiển thị preview ảnh mẫu.
- AC-018.3 User có thể xóa ảnh mẫu trước khi gửi.
- AC-018.4 Khi gửi tin nhắn có ảnh, case phải được đánh dấu `has_images = true`.
- AC-018.5 Doctor queue/detail phải hiển thị case có ảnh.
- AC-018.6 Không yêu cầu upload ảnh thật trong MVP.

### US-023 — CV overlay ảnh mẫu

Status: Partial
SP: 3
Source evidence:
- `src/lib/pipeline.ts`
- `src/components/doctor/case-detail.tsx`
- `src/types/index.ts`

User Story:
Là bác sĩ, tôi muốn xem phân tích CV mock trên ảnh mẫu, để hiểu AI/CV phát hiện vùng tổn thương như thế nào trong demo.

Acceptance Criteria:
- AC-023.1 Với case có ảnh, pipeline phải sinh dữ liệu CV mock gồm bounding box, diện tích, màu chủ đạo và hình thái.
- AC-023.2 Doctor detail phải hiển thị kết quả CV analysis.
- AC-023.3 Nếu có bounding box, UI nên overlay vùng phát hiện lên ảnh mẫu.
- AC-023.4 Nếu không có ảnh, hệ thống không hiển thị CV analysis.

Ghi chú gap:
- Source hiện hiển thị thông tin CV analysis dạng text.
- Chưa thấy overlay trực quan lên ảnh.

### US-034 — Emergency keyword filter dưới 50ms

Status: Done
SP: 3
Source evidence:
- `src/lib/emergency.ts`
- `src/lib/pipeline.ts`
- `src/mock/data.ts`

User Story:
Là hệ thống, tôi muốn phát hiện triệu chứng nguy hiểm bằng keyword filter rất nhanh, để bypass AI và cảnh báo phụ huynh ngay.

Acceptance Criteria:
- AC-034.1 Hệ thống phải normalize tiếng Việt có dấu/không dấu trước khi match.
- AC-034.2 Hệ thống phải match exact các từ khóa nguy hiểm như co giật, tím tái, khó thở, bất tỉnh, ngừng thở.
- AC-034.3 Hệ thống phải hỗ trợ fuzzy match đơn giản cho keyword dài.
- AC-034.4 Emergency check phải chạy trước NLP/RAG/CV/LLM.
- AC-034.5 Debug log phải ghi stage `Emergency_Filter` và duration.
- AC-034.6 Mục tiêu performance của filter là dưới 50ms ở môi trường demo/local.

### US-035 — Emergency UI: hotline 115 + 5 bệnh viện nhi HCM

Status: Partial
SP: 3
Source evidence:
- `src/components/emergency/emergency-screen.tsx`
- `src/lib/emergency.ts`

User Story:
Là phụ huynh, khi nhập triệu chứng nguy hiểm, tôi muốn thấy màn hình cảnh báo rõ ràng, hotline và bệnh viện gần nhất, để biết phải đưa trẻ đi cấp cứu ngay.

Acceptance Criteria:
- AC-035.1 Khi emergency được trigger, chat panel phải chuyển sang màn hình cảnh báo màu đỏ.
- AC-035.2 UI phải nêu rõ “Đưa trẻ đến cơ sở y tế ngay lập tức”.
- AC-035.3 UI phải nhấn mạnh không tự ý dùng thuốc.
- AC-035.4 Trong giờ hành chính, UI phải hiển thị CTA gọi hotline.
- AC-035.5 Ngoài giờ hành chính, UI phải hiển thị danh sách 5 bệnh viện nhi tại TP.HCM.
- AC-035.6 Theo sprint plan, hotline cần là 115 hoặc policy hotline được Product/Medical Owner duyệt.

Ghi chú gap:
- Source hiện dùng hotline `1900 599 927`, không phải 115.
- Source hiện hiển thị 2 bệnh viện, chưa đủ 5 bệnh viện.

### US-036 — Bypass toàn bộ xử lý khi emergency

Status: Done
SP: 2
Source evidence:
- `src/lib/pipeline.ts`
- `src/store/app-store.ts`

User Story:
Là hệ thống, khi phát hiện emergency, tôi muốn dừng toàn bộ pipeline AI, để phụ huynh nhận cảnh báo ngay thay vì chờ xử lý.

Acceptance Criteria:
- AC-036.1 Emergency filter phải chạy trước các stage NLP, RAG, EMR, CV và LLM.
- AC-036.2 Nếu emergency triggered, pipeline phải return kết quả emergency ngay.
- AC-036.3 Hệ thống phải ghi audit event `EMERGENCY_BYPASS`.
- AC-036.4 UI phụ huynh phải chuyển sang emergency screen.
- AC-036.5 Không tạo draft AI thông thường cho emergency case.

### US-040 — Pending queue + anxiety badge

Status: Done
SP: 3
Source evidence:
- `src/components/doctor/case-queue.tsx`
- `src/types/index.ts`
- `src/mock/data.ts`

User Story:
Là bác sĩ, tôi muốn xem hàng đợi ca đang chờ kèm mức độ lo lắng, để ưu tiên ca cần xử lý trước.

Acceptance Criteria:
- AC-040.1 Queue phải hiển thị số lượng pending case.
- AC-040.2 Queue chỉ hiển thị pending case trong khu vực chờ duyệt.
- AC-040.3 Mỗi case card phải hiển thị tên bệnh nhi, tuổi, keyword triệu chứng, thời gian chờ và trạng thái.
- AC-040.4 Mỗi case card phải hiển thị anxiety badge với màu/emoji tương ứng.
- AC-040.5 Case panic đang pending phải có dấu hiệu nổi bật hơn case bình thường.
- AC-040.6 Case đã xử lý phải nằm trong khu vực riêng.

### US-041 — Realtime push khi có ca mới

Status: Partial
SP: 3
Source evidence:
- `src/store/app-store.ts`
- `src/lib/mock-db.ts`
- `src/components/doctor/case-queue.tsx`

User Story:
Là bác sĩ, tôi muốn queue cập nhật ngay khi phụ huynh gửi ca mới, để không phải refresh thủ công.

Acceptance Criteria:
- AC-041.1 Khi phụ huynh gửi message không emergency, hệ thống phải tạo case mới.
- AC-041.2 Case mới phải xuất hiện ngay trong doctor queue ở cùng phiên demo.
- AC-041.3 Queue count phải tăng tương ứng.
- AC-041.4 Bản production phải dùng realtime backend/Supabase channel hoặc cơ chế push tương đương.

Ghi chú gap:
- Source hiện realtime trong cùng Zustand state/demo split screen.
- Chưa có Supabase realtime hoặc push thật.

### US-043 — Hiển thị draft placeholder mock

Status: Done
SP: 2
Source evidence:
- `src/mock/data.ts`
- `src/components/doctor/case-detail.tsx`
- `src/lib/pipeline.ts`

User Story:
Là bác sĩ, tôi muốn xem bản nháp tư vấn do AI/mock tạo, để có điểm bắt đầu khi review ca.

Acceptance Criteria:
- AC-043.1 Case detail phải có tab “Bản nháp AI”.
- AC-043.2 Draft phải hiển thị nội dung mock nếu chưa có LLM thật.
- AC-043.3 Draft phải gắn với case được chọn.
- AC-043.4 Nếu đổi case, nội dung draft phải phản ánh case đang chọn.

### US-045 — Inline edit draft

Status: Partial
SP: 5
Source evidence:
- `src/components/doctor/case-detail.tsx`

User Story:
Là bác sĩ, tôi muốn chỉnh sửa trực tiếp bản nháp AI trước khi gửi, để đảm bảo nội dung tư vấn chính xác và phù hợp chuyên môn.

Acceptance Criteria:
- AC-045.1 Bác sĩ có thể sửa nội dung draft inline.
- AC-045.2 UI phải hiển thị số từ hiện tại.
- AC-045.3 UI phải cho phép khôi phục draft gốc.
- AC-045.4 UI phải có chế độ xem diff giữa bản gốc và bản chỉnh sửa.
- AC-045.5 Theo sprint plan, editor nên dùng TipTap hoặc rich-text editor tương đương.
- AC-045.6 Nội dung đã chỉnh sửa phải được dùng khi approve.

Ghi chú gap:
- Source hiện dùng textarea, chưa dùng TipTap.

### US-047 — APPROVE → dispatch

Status: Done
SP: 5
Source evidence:
- `src/components/doctor/case-detail.tsx`
- `src/store/app-store.ts`
- `src/lib/mock-db.ts`

User Story:
Là bác sĩ, tôi muốn approve bản tư vấn sau khi kiểm tra, để gửi phản hồi đã kiểm duyệt cho phụ huynh.

Acceptance Criteria:
- AC-047.1 Với case pending, UI phải hiển thị nút `APPROVE & DISPATCH`.
- AC-047.2 Khi approve, hệ thống phải đổi status case thành `approved`.
- AC-047.3 Hệ thống phải lưu doctor ID, thời điểm approve và edited draft.
- AC-047.4 Hệ thống phải ghi audit event `APPROVED`.
- AC-047.5 Phụ huynh phải nhận message từ doctor với nội dung final draft.
- AC-047.6 Message gửi cho phụ huynh phải có cờ `is_approved` và disclaimer y tế.

### US-048 — REJECT + lý do

Status: Done
SP: 2
Source evidence:
- `src/components/doctor/case-detail.tsx`
- `src/store/app-store.ts`
- `src/lib/mock-db.ts`

User Story:
Là bác sĩ, tôi muốn reject ca với lý do rõ ràng, để không gửi tư vấn khi thông tin không đủ hoặc ca cần khám trực tiếp.

Acceptance Criteria:
- AC-048.1 Với case pending, UI phải hiển thị nút `REJECT`.
- AC-048.2 Khi bấm reject, UI phải mở modal chọn lý do.
- AC-048.3 Lý do reject là bắt buộc trước khi xác nhận.
- AC-048.4 Khi xác nhận, hệ thống phải đổi status case thành `rejected`.
- AC-048.5 Hệ thống phải lưu doctor ID, thời điểm reject và rejection reason.
- AC-048.6 Hệ thống phải ghi audit event `REJECTED`.

### US-080 — Notification bell + badge

Status: Planned
SP: 3
Source evidence:
- `src/components/doctor/case-queue.tsx` có pending count badge.
- Chưa thấy notification bell riêng.

User Story:
Là bác sĩ, tôi muốn có chuông thông báo và badge số ca mới, để biết khi có ca cần xử lý.

Acceptance Criteria:
- AC-080.1 UI bác sĩ phải có notification bell.
- AC-080.2 Badge phải hiển thị số pending/new cases.
- AC-080.3 Khi có case mới, badge phải cập nhật ngay.
- AC-080.4 Khi bác sĩ mở/xem queue, hệ thống phải có cách đánh dấu đã xem nếu cần.
- AC-080.5 Notification không được che mất workflow review case.

---

## Sprint 3 — AI Pipeline

Mục tiêu sprint: thay mock bằng AI thật và chạy end-to-end có RAG/EMR/CV/LLM.

### US-022 — CV mock bounding box

Status: Done
SP: 3
Source evidence:
- `src/lib/pipeline.ts`
- `src/types/index.ts`
- `src/components/doctor/case-detail.tsx`

User Story:
Là bác sĩ, tôi muốn hệ thống sinh bounding box mock cho ảnh tổn thương, để demo khả năng phát hiện vùng quan tâm của CV.

Acceptance Criteria:
- AC-022.1 Khi case có ảnh, pipeline phải tạo `cv_analysis.bounding_box`.
- AC-022.2 CV analysis phải có thêm diện tích, màu chủ đạo và morphology nếu có.
- AC-022.3 CV stage phải ghi debug log `CV_Analyze` và duration.
- AC-022.4 Case detail phải hiển thị CV analysis cho bác sĩ.

### US-025 — Fusion Layer H_t = Φ(W_nlp·f + W_cv·g)

Status: Done
SP: 3
Source evidence:
- `src/lib/pipeline.ts`
- `src/components/shared/debug-console.tsx`

User Story:
Là hệ thống AI, tôi muốn có fusion layer mock kết hợp tín hiệu NLP và CV, để demo cách pipeline điều chỉnh trọng số theo workflow.

Acceptance Criteria:
- AC-025.1 Pipeline phải có stage `Fusion` sau NLP/RAG/CV và trước LLM draft.
- AC-025.2 Fusion phải tính/log trọng số NLP và CV.
- AC-025.3 Với workflow `Skin_Lesion`, trọng số CV phải cao hơn các workflow không liên quan ảnh.
- AC-025.4 Debug console phải hiển thị log fusion để phục vụ demo/tuning.

### US-026 — VCLINIC mock JSON

Status: Done
SP: 2
Source evidence:
- `src/mock/data.ts`
- `src/lib/pipeline.ts`
- `src/components/doctor/case-detail.tsx`

User Story:
Là bác sĩ, tôi muốn case có thể lấy dữ liệu EMR mock từ VCLINIC, để xem hồ sơ nền của bệnh nhi trong demo.

Acceptance Criteria:
- AC-026.1 Source phải có mock EMR record theo `vclinic_id`.
- AC-026.2 Pipeline phải sync EMR mock bằng `vclinic_id` của active child.
- AC-026.3 Case mới phải chứa EMR data nếu tìm thấy.
- AC-026.4 Doctor detail phải hiển thị thông tin bệnh nhân, tiền sử, thuốc đang dùng và IgG data.
- AC-026.5 Nếu không có EMR, UI phải hiển thị trạng thái không có dữ liệu EMR.

### US-027 — Inject EMR vào LLM context

Status: Partial
SP: 3
Source evidence:
- `src/lib/pipeline.ts`
- `src/mock/data.ts`

User Story:
Là hệ thống AI, tôi muốn đưa EMR của bệnh nhi vào context khi tạo draft, để phản hồi có ngữ cảnh cá nhân hóa hơn.

Acceptance Criteria:
- AC-027.1 Pipeline phải retrieve EMR trước khi tạo draft.
- AC-027.2 LLM context phải bao gồm thông tin EMR quan trọng như tuổi, cân nặng, tiền sử, thuốc, IgG nếu liên quan.
- AC-027.3 Nếu không có EMR, pipeline vẫn phải tạo draft an toàn với context rỗng.
- AC-027.4 Debug log phải ghi trạng thái EMR sync.
- AC-027.5 Không đưa dữ liệu EMR không cần thiết vào prompt/log.

Ghi chú gap:
- Source hiện retrieve EMR và đưa vào case.
- Draft hiện dùng `MOCK_AI_DRAFT`, chưa có prompt/context LLM thật.

### US-028 — RAG: pgvector + seed 50 knowledge chunks

Status: Partial
SP: 8
Source evidence:
- `src/mock/data.ts`
- `src/lib/pipeline.ts`
- `src/components/doctor/case-detail.tsx`

User Story:
Là hệ thống AI, tôi muốn truy xuất tri thức y khoa liên quan bằng RAG, để draft có căn cứ từ nguồn tri thức được kiểm soát.

Acceptance Criteria:
- AC-028.1 Hệ thống phải có knowledge chunks y khoa đã seed.
- AC-028.2 Bản production phải dùng pgvector hoặc vector store tương đương.
- AC-028.3 MVP target phải seed tối thiểu 50 knowledge chunks.
- AC-028.4 Pipeline phải retrieve top relevant snippets theo similarity.
- AC-028.5 Doctor detail phải hiển thị RAG sources kèm title, content, similarity và source.
- AC-028.6 Debug console phải log số nguồn retrieve và max similarity.

Ghi chú gap:
- Source hiện có 3 mock snippets, chưa có pgvector và chưa đủ 50 chunks.

### US-033 — Debug console: session ID, RAG sources

Status: Done
SP: 3
Source evidence:
- `src/components/shared/debug-console.tsx`
- `src/store/app-store.ts`
- `src/lib/pipeline.ts`
- `src/components/doctor/case-detail.tsx`

User Story:
Là developer/demo operator, tôi muốn bật debug console để xem session, pipeline stage và RAG/CV/LLM log, để giải thích pipeline trong demo.

Acceptance Criteria:
- AC-033.1 UI phải có nút bật/tắt Debug console.
- AC-033.2 UI phải hỗ trợ shortcut `Ctrl+Shift+D` để bật/tắt Debug console.
- AC-033.3 Khi mở console, hệ thống phải hiển thị logs theo thời gian.
- AC-033.4 Logs phải phân loại theo system, feedback, tuning, ml, error.
- AC-033.5 Console phải hiển thị stage duration nếu có.
- AC-033.6 User có thể clear logs.
- AC-033.7 User có thể export logs ra TXT.
- AC-033.8 Doctor detail phải hiển thị RAG sources trong case để bổ trợ debug/clinical review.

### US-052 — LLM draft generation — Claude API streaming

Status: Partial
SP: 8
Source evidence:
- `src/lib/pipeline.ts`
- `src/mock/data.ts`
- `src/components/doctor/case-detail.tsx`

User Story:
Là bác sĩ, tôi muốn hệ thống tạo draft tư vấn bằng LLM thật và streaming, để giảm thời gian soạn phản hồi nhưng vẫn giữ bước bác sĩ kiểm duyệt.

Acceptance Criteria:
- AC-052.1 Pipeline phải gọi Claude API hoặc LLM provider được duyệt.
- AC-052.2 Draft phải được tạo từ input phụ huynh, EMR context, RAG snippets, CV result nếu có và safety policy.
- AC-052.3 UI hoặc pipeline phải hỗ trợ streaming hoặc trạng thái sinh draft theo thời gian thực.
- AC-052.4 Draft không được tự động gửi cho phụ huynh nếu chưa được bác sĩ approve.
- AC-052.5 Draft phải tránh chẩn đoán chắc chắn và phải giữ giọng điệu an toàn.
- AC-052.6 LLM errors phải fallback sang message an toàn hoặc trạng thái lỗi cho bác sĩ.
- AC-052.7 Không log API key, prompt chứa dữ liệu nhạy cảm hoặc raw PHI không cần thiết.

Ghi chú gap:
- Source hiện delay mock và dùng `MOCK_AI_DRAFT`; chưa gọi Claude API/streaming.

---

## Cross-cutting User Stories bổ sung từ source code

Các US sau không nằm rõ trong sprint table nhưng đã xuất hiện trong source code và nên đưa vào backlog để quản lý nghiệm thu.

### US-101 — Split-screen MVP demo parent/doctor

Status: Done
SP: N/A
Source evidence:
- `src/app/page.tsx`

User Story:
Là demo operator, tôi muốn thấy cùng lúc mobile view của phụ huynh và desktop view của bác sĩ, để trình diễn end-to-end flow trên một màn hình.

Acceptance Criteria:
- AC-101.1 App phải có header MediKid-AI và nhãn MVP Demo.
- AC-101.2 Màn hình phải chia hai khu vực: phụ huynh và bác sĩ.
- AC-101.3 Khu phụ huynh chứa chat panel.
- AC-101.4 Khu bác sĩ chứa queue và case detail.
- AC-101.5 Consent modal phải overlay toàn bộ màn hình khi chưa consent.

### US-102 — Audit log cho các event chính

Status: Done
SP: N/A
Source evidence:
- `src/types/index.ts`
- `src/lib/mock-db.ts`
- `src/store/app-store.ts`
- `src/lib/pipeline.ts`

User Story:
Là hệ thống, tôi muốn ghi audit log cho các event chính, để có trace cho consent, session, message, draft, approval, rejection và emergency.

Acceptance Criteria:
- AC-102.1 Audit model phải hỗ trợ các event: `CONSENT_GRANTED`, `SESSION_START`, `MESSAGE_SENT`, `DRAFT_GENERATED`, `APPROVED`, `REJECTED`, `EMERGENCY_BYPASS`.
- AC-102.2 Mỗi audit entry phải có ID, event, session ID và timestamp.
- AC-102.3 Gửi message phải ghi `MESSAGE_SENT`.
- AC-102.4 Tạo draft phải ghi `DRAFT_GENERATED`.
- AC-102.5 Approve/reject/emergency phải ghi event tương ứng.

### US-103 — SLA visual warning trong doctor queue

Status: Done
SP: N/A
Source evidence:
- `src/components/doctor/case-queue.tsx`

User Story:
Là bác sĩ, tôi muốn các ca chờ lâu được đánh dấu trực quan, để ưu tiên xử lý theo SLA.

Acceptance Criteria:
- AC-103.1 Case pending chờ trên 30 phút phải có cảnh báo màu cam.
- AC-103.2 Case pending chờ trên 60 phút phải có cảnh báo màu đỏ.
- AC-103.3 Thời gian chờ phải hiển thị dạng relative time.
- AC-103.4 Cảnh báo SLA không áp dụng cho case đã xử lý.

---

## Traceability Matrix

| US | Sprint | SP | Status | Primary Source |
|---|---:|---:|---|---|
| US-001 | 1 | 3 | Done | `consent-modal.tsx`, `page.tsx` |
| US-002 | 1 | 2 | Partial | `app-store.ts`, `mock-db.ts` |
| US-005 | 1 | 3 | Planned | N/A |
| US-007 | 1 | 2 | Done | `app-store.ts` |
| US-008 | 1 | 5 | Planned | N/A |
| US-009 | 1 | 3 | Partial | `mock/data.ts`, `types/index.ts` |
| US-065 | 1 | 2 | Done | `app-store.ts`, `chat-panel.tsx` |
| US-010 | 2 | 2 | Done | `chat-panel.tsx` |
| US-012 | 2 | 2 | Done | `pipeline.ts`, `case-queue.tsx` |
| US-013 | 2 | 1 | Done | `chat-panel.tsx` |
| US-014 | 2 | 3 | Partial | `chat-panel.tsx`, `case-detail.tsx` |
| US-015 | 2 | 3 | Done | `chat-panel.tsx`, `mock/data.ts` |
| US-018 | 2 | 3 | Done | `chat-panel.tsx`, `pipeline.ts` |
| US-023 | 2 | 3 | Partial | `pipeline.ts`, `case-detail.tsx` |
| US-034 | 2 | 3 | Done | `emergency.ts`, `pipeline.ts` |
| US-035 | 2 | 3 | Partial | `emergency-screen.tsx`, `emergency.ts` |
| US-036 | 2 | 2 | Done | `pipeline.ts`, `app-store.ts` |
| US-040 | 2 | 3 | Done | `case-queue.tsx` |
| US-041 | 2 | 3 | Partial | `app-store.ts`, `mock-db.ts` |
| US-043 | 2 | 2 | Done | `case-detail.tsx`, `mock/data.ts` |
| US-045 | 2 | 5 | Partial | `case-detail.tsx` |
| US-047 | 2 | 5 | Done | `case-detail.tsx`, `app-store.ts` |
| US-048 | 2 | 2 | Done | `case-detail.tsx`, `app-store.ts` |
| US-080 | 2 | 3 | Planned | N/A |
| US-022 | 3 | 3 | Done | `pipeline.ts`, `case-detail.tsx` |
| US-025 | 3 | 3 | Done | `pipeline.ts`, `debug-console.tsx` |
| US-026 | 3 | 2 | Done | `mock/data.ts`, `pipeline.ts` |
| US-027 | 3 | 3 | Partial | `pipeline.ts` |
| US-028 | 3 | 8 | Partial | `mock/data.ts`, `pipeline.ts` |
| US-033 | 3 | 3 | Done | `debug-console.tsx`, `pipeline.ts` |
| US-052 | 3 | 8 | Partial | `pipeline.ts`, `mock/data.ts` |
| US-101 | Cross | N/A | Done | `page.tsx` |
| US-102 | Cross | N/A | Done | `types/index.ts`, `mock-db.ts` |
| US-103 | Cross | N/A | Done | `case-queue.tsx` |

---

## MVP Gap Summary

Các gap chính cần xử lý nếu muốn bám sát plan 3 sprint:

1. US-002: thêm persist consent vào `sessionStorage`.
2. US-005: thêm auto-logout sau 4 giờ idle.
3. US-008: thêm auth/OTP hoặc mock auth flow rõ ràng.
4. US-009: thêm form tạo hồ sơ bệnh nhi.
5. US-014: persist lịch sử hội thoại qua refresh/backend.
6. US-023: thêm overlay bounding box lên ảnh mẫu nếu cần demo CV trực quan.
7. US-035: đổi/duyệt hotline policy; bổ sung đủ 5 bệnh viện nhi HCM nếu theo spec.
8. US-041: thay demo state bằng realtime backend/Supabase nếu cần production-like demo.
9. US-045: nếu giữ đúng spec, thay textarea bằng TipTap/rich-text editor.
10. US-080: thêm notification bell riêng cho bác sĩ.
11. US-027/US-052: thay mock draft bằng LLM thật và context builder an toàn.
12. US-028: thêm pgvector/vector store và seed tối thiểu 50 chunks.

## Recommended Next Documents

Nên tạo tiếp các plan triển khai theo thứ tự:

```text
docs/plans/2026-05-21-sprint-1-gap-closure.md
docs/plans/2026-05-21-sprint-2-demo-hardening.md
docs/plans/2026-05-21-sprint-3-real-ai-pipeline.md
```
