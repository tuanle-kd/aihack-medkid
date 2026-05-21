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
```

Có thể dùng script tương ứng:

```bash
./scripts/dev.sh
./scripts/lint.sh
./scripts/build.sh
```

## Project Structure

```text
src/                 Source code chính
tests/               Test tự động khi bổ sung
docs/requirements.md Yêu cầu sản phẩm
docs/architecture.md Kiến trúc hệ thống
docs/plans/          Kế hoạch triển khai feature
docs/decisions/      Quyết định kỹ thuật/ADR
scripts/             Script phát triển lặp lại
config/              Config mẫu theo môi trường
```

## Development Workflow

1. Cập nhật `docs/requirements.md` nếu thay đổi yêu cầu sản phẩm.
2. Cập nhật `docs/architecture.md` nếu thay đổi kiến trúc.
3. Viết plan vào `docs/plans/` cho feature lớn.
4. Implement trong `src/`.
5. Chạy `npm run lint` và `npm run build` trước khi hoàn tất.
6. Ghi ADR vào `docs/decisions/` nếu có quyết định kỹ thuật quan trọng.

## Notes

Dự án dùng Next.js 16. Khi sửa API/convention của Next.js, ưu tiên kiểm tra tài liệu local trong `node_modules/next/dist/docs/`.
