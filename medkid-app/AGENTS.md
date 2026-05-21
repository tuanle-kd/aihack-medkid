<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MedKid App - Agent Instructions

## Mục tiêu dự án

MedKid là ứng dụng Next.js phục vụ bài toán y tế/trẻ em trong khuôn khổ AI hackathon. Repo này phải chứa cả source code, tài liệu sản phẩm, kiến trúc, kế hoạch triển khai và quyết định kỹ thuật để developer/AI agent có thể phát triển ngay trong source code.

## Quy tắc làm việc

- Đọc `docs/ai-document-init-guide.md` khi cần khởi tạo/cập nhật bộ tài liệu cho AI.
- Đọc `docs/requirements.md` trước khi thay đổi hành vi sản phẩm.
- Đọc `docs/architecture.md` trước khi thay đổi kiến trúc, routing, data flow hoặc tích hợp bên ngoài.
- Với feature lớn, tạo plan trong `docs/plans/YYYY-MM-DD-feature-name.md` trước khi code.
- Với quyết định kỹ thuật quan trọng, tạo ADR trong `docs/decisions/NNNN-decision-name.md`.
- Không thêm dependency mới nếu chưa ghi rõ lý do trong plan hoặc ADR.
- Ưu tiên thay đổi nhỏ, dễ review, có thể kiểm chứng bằng lệnh cụ thể.
- Chạy lint/build trước khi kết thúc task nếu thay đổi code.

## Tech stack hiện tại

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase client/SSR
- ESLint

## Cấu trúc thư mục chuẩn

```text
src/                 Source code chính
tests/               Test tự động nếu/ khi được bổ sung
docs/requirements.md            Yêu cầu sản phẩm
docs/architecture.md            Kiến trúc hệ thống
docs/ai-document-init-guide.md   Hướng dẫn init/cập nhật tài liệu cho AI
docs/plans/                     Kế hoạch triển khai theo feature
docs/decisions/                 Architecture Decision Records
scripts/             Script phát triển/lint/build
config/              Config mẫu theo môi trường
```

## Lệnh phát triển

```bash
npm run dev
npm run lint
npm run build
```

Hoặc dùng script:

```bash
./scripts/dev.sh
./scripts/lint.sh
./scripts/build.sh
```

## Quy tắc Next.js

Dự án dùng Next.js version mới. Trước khi sửa App Router, server components, metadata, caching, actions hoặc route handlers, hãy kiểm tra docs local trong:

```text
node_modules/next/dist/docs/
```
