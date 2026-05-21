# MedKid App

Ứng dụng chính của dự án AIHack MedKid.

## Quick Start

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Commands

```bash
npm run dev      # chạy local development server
npm run lint     # kiểm tra lint
npm run build    # build production
npm run test:e2e # chạy Playwright end-to-end tests
```

Có thể dùng script tương ứng:

```bash
./scripts/dev.sh
./scripts/lint.sh
./scripts/build.sh
```

## E2E Tests

Playwright tests live in `tests/e2e/`. The test runner starts the Next.js dev server automatically.

```bash
npm run test:e2e
npm run test:e2e:ui
```

## Project Structure

```text
src/                 Source code chính
tests/               Test tự động khi bổ sung
docs/requirements.md            Yêu cầu sản phẩm
docs/architecture.md            Kiến trúc hệ thống
docs/ai-document-init-guide.md   Hướng dẫn init/cập nhật tài liệu cho AI
docs/user-stories-acceptance-criteria.md  User Stories và Acceptance Criteria
docs/plans/                     Kế hoạch triển khai feature
docs/decisions/                 Quyết định kỹ thuật/ADR
scripts/             Script phát triển lặp lại
config/              Config mẫu theo môi trường
```

## Development Workflow

1. Đọc `docs/ai-document-init-guide.md` nếu cần khởi tạo/cập nhật bộ tài liệu cho AI.
2. Cập nhật `docs/requirements.md` nếu thay đổi yêu cầu sản phẩm.
3. Cập nhật `docs/architecture.md` nếu thay đổi kiến trúc.
4. Viết plan vào `docs/plans/` cho feature lớn.
5. Implement trong `src/`.
6. Chạy `npm run lint` và `npm run build` trước khi hoàn tất.
7. Ghi ADR vào `docs/decisions/` nếu có quyết định kỹ thuật quan trọng.

## Notes

Dự án dùng Next.js 16. Khi sửa API/convention của Next.js, ưu tiên kiểm tra tài liệu local trong `node_modules/next/dist/docs/`.
