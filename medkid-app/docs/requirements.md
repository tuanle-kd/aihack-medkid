# MedKid Requirements

## Business Goals

- Xây dựng ứng dụng MedKid hỗ trợ người dùng trong bối cảnh y tế/trẻ em.
- Tạo nền tảng demo rõ ràng, dễ mở rộng trong hackathon.
- Đảm bảo source code có đủ tài liệu để developer và AI agent tiếp tục phát triển nhanh.

## Users

- Phụ huynh/người chăm sóc trẻ.
- Nhân sự y tế hoặc tư vấn viên, nếu sản phẩm có luồng chuyên môn.
- Admin/ban vận hành, nếu cần quản trị dữ liệu.

## Functional Requirements

Cần cập nhật chi tiết theo scope sản phẩm thực tế.

- Người dùng có thể truy cập giao diện chính của ứng dụng.
- Ứng dụng có thể hiển thị/thu thập thông tin liên quan đến trẻ hoặc vấn đề y tế.
- Ứng dụng có thể tích hợp Supabase cho dữ liệu/auth khi cần.
- Các luồng AI, nếu có, phải được mô tả rõ input, output và giới hạn sử dụng.

## Non-functional Requirements

- Giao diện dễ hiểu, thân thiện với người dùng phổ thông.
- Không đưa ra chẩn đoán y khoa chắc chắn nếu chưa có cơ chế kiểm duyệt chuyên môn.
- Bảo vệ dữ liệu cá nhân và dữ liệu sức khỏe.
- Code TypeScript rõ ràng, dễ bảo trì.
- Có lệnh kiểm tra tối thiểu: lint và build.

## Out of Scope

- Chẩn đoán y khoa thay thế bác sĩ.
- Lưu trữ dữ liệu nhạy cảm chưa có chính sách bảo mật rõ ràng.
- Tích hợp production phức tạp nếu chưa cần cho demo.

## Open Questions

- Persona người dùng chính là ai?
- Use case y tế cụ thể là gì?
- Có cần auth không?
- Có dùng AI model bên ngoài không?
- Có cần dashboard/admin không?
