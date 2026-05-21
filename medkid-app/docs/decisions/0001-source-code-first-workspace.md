# 0001 - Source-code-first Workspace

## Status

Accepted

## Context

Dự án cần được phát triển nhanh trong hackathon và có thể được tiếp tục bởi developer hoặc AI agent. Nếu tài liệu, kế hoạch và quyết định kỹ thuật nằm ngoài repo, người tiếp nhận sẽ thiếu ngữ cảnh.

## Decision

Đặt tài liệu phát triển trực tiếp trong source code:

- `AGENTS.md` cho hướng dẫn AI/developer.
- `docs/requirements.md` cho yêu cầu sản phẩm.
- `docs/architecture.md` cho kiến trúc.
- `docs/plans/` cho kế hoạch triển khai feature.
- `docs/decisions/` cho Architecture Decision Records.
- `scripts/` cho lệnh phát triển lặp lại.
- `config/` cho config mẫu theo môi trường.

## Consequences

- Dễ onboarding developer/AI agent mới.
- Lịch sử thay đổi tài liệu đi cùng lịch sử code.
- Cần duy trì tài liệu khi scope sản phẩm thay đổi.
