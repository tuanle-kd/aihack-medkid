# AI Document Init Guide

## Mục đích

Tài liệu này hướng dẫn AI agent hoặc developer khởi tạo, cập nhật và sử dụng bộ tài liệu dự án ngay trong source code. Mục tiêu là để bất kỳ AI agent nào khi mở repo cũng hiểu:

- Dự án đang làm gì.
- Kiến trúc hiện tại ra sao.
- Feature cần làm theo kế hoạch nào.
- Quyết định kỹ thuật nào đã được chấp nhận.
- Cần chạy lệnh gì để kiểm chứng thay đổi.

## Khi nào cần dùng tài liệu này

Dùng tài liệu này khi:

- Khởi tạo repo mới.
- Onboard AI agent mới vào dự án.
- Bắt đầu một feature lớn.
- Refactor kiến trúc hoặc data flow.
- Thêm dependency hoặc tích hợp dịch vụ ngoài.
- Chuẩn bị handoff cho developer/AI agent khác.

## Bộ tài liệu chuẩn

Mỗi dự án nên có tối thiểu các file/thư mục sau:

```text
AGENTS.md
README.md
docs/
├── requirements.md
├── architecture.md
├── ai-document-init-guide.md
├── plans/
└── decisions/
scripts/
config/
```

Ý nghĩa:

```text
AGENTS.md                       Quy tắc làm việc cho AI agent/developer
README.md                       Hướng dẫn chạy dự án và cấu trúc tổng quan
docs/requirements.md            Yêu cầu sản phẩm
docs/architecture.md            Kiến trúc hệ thống
docs/ai-document-init-guide.md   Hướng dẫn khởi tạo/cập nhật tài liệu cho AI
docs/plans/                     Kế hoạch triển khai từng feature
docs/decisions/                 Architecture Decision Records
scripts/                        Lệnh phát triển lặp lại
config/                         Config mẫu, không chứa secret thật
```

## Quy trình init document cho AI

### Bước 1: Đọc repo hiện tại

AI agent cần kiểm tra trước:

```bash
pwd
find . -maxdepth 3 -type f | sort
```

Nếu repo đã có `AGENTS.md`, phải đọc trước khi sửa:

```bash
cat AGENTS.md
```

Nếu dự án có app con, ví dụ `medkid-app/`, cần kiểm tra thêm:

```bash
cat medkid-app/AGENTS.md
cat medkid-app/README.md
```

### Bước 2: Xác định project root

Project root là nơi chứa app chính và tài liệu phát triển.

Với MedKid hiện tại:

```text
/Users/nb230601/Documents/aihack-medkid/medkid-app
```

Nếu workspace có nhiều app, mỗi app nên có `AGENTS.md` riêng.

### Bước 3: Tạo hoặc cập nhật `AGENTS.md`

`AGENTS.md` là file quan trọng nhất cho AI agent.

Nội dung tối thiểu:

````markdown
# Project Agent Instructions

## Project Goal

[Mô tả ngắn dự án]

## Development Rules

- Read `docs/requirements.md` before changing product behavior.
- Read `docs/architecture.md` before changing architecture.
- Create a plan in `docs/plans/` before implementing large features.
- Record major technical decisions in `docs/decisions/`.
- Do not add dependencies without documenting why.
- Run lint/build/tests before finishing code changes.

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

```text
src/                 Source code
tests/               Automated tests
docs/requirements.md Product requirements
docs/architecture.md System architecture
docs/plans/          Feature plans
docs/decisions/      ADRs
scripts/             Repeatable commands
config/              Environment templates
```
````

### Bước 4: Tạo hoặc cập nhật `README.md`

`README.md` dành cho người mới vào dự án.

Nội dung tối thiểu:

````markdown
# Project Name

## Quick Start

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

[Mô tả thư mục chính]

## Development Workflow

1. Update requirements if product scope changes.
2. Update architecture if technical structure changes.
3. Write implementation plan for large features.
4. Implement.
5. Run verification commands.
6. Record decisions as ADRs.
````

### Bước 5: Tạo `docs/requirements.md`

File này trả lời: sản phẩm cần làm gì?

Template:

````markdown
# Requirements

## Business Goals

- ...

## Users

- ...

## Functional Requirements

- ...

## Non-functional Requirements

- ...

## Out of Scope

- ...

## Open Questions

- ...
````

Quy tắc:

- Không viết quá chung chung.
- Ghi rõ điều chưa biết ở `Open Questions`.
- Nếu yêu cầu thay đổi, cập nhật file này trước khi code.

### Bước 6: Tạo `docs/architecture.md`

File này trả lời: hệ thống được thiết kế như thế nào?

Template:

````markdown
# Architecture

## Overview

[Mô tả kiến trúc tổng quan]

## Current Stack

- Frontend:
- Backend:
- Database:
- External Services:

## Source Layout

```text
src/app/
src/components/
src/features/
src/lib/
src/server/
src/types/
```

## Data Flow

1. ...
2. ...
3. ...

## Security and Safety Notes

- ...

## Engineering Principles

- DRY
- YAGNI
- Type-safe
- Small changes
````

Quy tắc:

- Không để kiến trúc chỉ nằm trong chat.
- Nếu đổi data flow, routing, database hoặc external integration, cập nhật file này.
- Với dự án y tế, luôn có phần safety/security.

### Bước 7: Tạo plan cho feature trong `docs/plans/`

Tên file:

```text
docs/plans/YYYY-MM-DD-feature-name.md
```

Template:

````markdown
# [Feature Name] Implementation Plan

## Goal

[Mục tiêu một câu]

## Scope

- In scope:
- Out of scope:

## Files to Change

- Create:
- Modify:
- Test:

## Tasks

### Task 1: [Tên task nhỏ]

Objective:

Files:

Steps:

1. Write/update test or acceptance check.
2. Implement minimal change.
3. Run verification command.

Verification:

```bash
npm run lint
npm run build
```

## Risks

- ...

## Rollback

- ...
````

Quy tắc:

- Một plan chỉ nên tập trung vào một feature hoặc một thay đổi lớn.
- Task phải nhỏ, dễ kiểm chứng.
- Ghi file cụ thể, không viết mơ hồ như “sửa frontend”.

### Bước 8: Ghi quyết định kỹ thuật vào `docs/decisions/`

Tên file:

```text
docs/decisions/NNNN-short-decision-name.md
```

Template:

````markdown
# NNNN - Decision Title

## Status

Accepted | Proposed | Deprecated

## Context

[Vì sao cần quyết định này]

## Decision

[Quyết định cụ thể]

## Consequences

- Positive:
- Negative:
- Follow-up:
````

Khi nào cần ADR:

- Chọn database/auth provider.
- Thêm AI provider/model.
- Đổi kiến trúc routing/data flow.
- Thêm dependency lớn.
- Thay đổi chính sách bảo mật hoặc lưu trữ dữ liệu.

### Bước 9: Tạo `scripts/`

Mục tiêu: AI/dev không phải nhớ lệnh.

Tối thiểu:

```text
scripts/dev.sh
scripts/lint.sh
scripts/build.sh
```

Template shell script:

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
npm run lint
```

Sau khi tạo:

```bash
chmod +x scripts/*.sh
```

### Bước 10: Tạo `config/`

Mục tiêu: có config mẫu, không commit secret thật.

Ví dụ:

```text
config/development.example.env
config/staging.example.env
config/production.example.env
```

Quy tắc:

- Chỉ để key name, không để value thật.
- Secret thật nằm trong `.env.local` hoặc secret manager.
- Nếu thêm biến môi trường mới, cập nhật file example tương ứng.

## Checklist cho AI trước khi code

Trước khi sửa code, AI agent phải kiểm tra:

```text
[ ] Đã đọc AGENTS.md
[ ] Đã đọc docs/requirements.md nếu thay đổi hành vi sản phẩm
[ ] Đã đọc docs/architecture.md nếu thay đổi kiến trúc
[ ] Đã tạo/cập nhật plan trong docs/plans/ nếu feature lớn
[ ] Đã xác định file cần sửa
[ ] Đã biết lệnh verify
```

## Checklist sau khi code

Sau khi sửa code, AI agent phải kiểm tra:

```text
[ ] Đã chạy lint/test/build phù hợp
[ ] Đã cập nhật README nếu cách chạy thay đổi
[ ] Đã cập nhật requirements nếu scope sản phẩm thay đổi
[ ] Đã cập nhật architecture nếu data flow/kiến trúc thay đổi
[ ] Đã thêm ADR nếu có quyết định kỹ thuật quan trọng
[ ] Không commit secret thật
```

## Prompt mẫu để yêu cầu AI init document

Dùng prompt này khi đưa AI vào repo mới:

```text
Hãy khởi tạo bộ tài liệu phát triển trực tiếp trong source code cho repo này.

Yêu cầu:
- Đọc cấu trúc repo hiện tại trước.
- Tạo/cập nhật AGENTS.md, README.md.
- Tạo docs/requirements.md, docs/architecture.md.
- Tạo docs/plans/ và docs/decisions/.
- Tạo scripts/dev.sh, scripts/lint.sh, scripts/build.sh nếu phù hợp.
- Tạo config/*.example.env, không ghi secret thật.
- Không xoá code hiện có.
- Sau khi tạo xong, chạy lint/build nếu có thể.
- Báo cáo rõ file đã tạo/cập nhật và kết quả verify.
```

## Prompt mẫu để yêu cầu AI làm feature theo document

```text
Hãy triển khai feature sau trong repo này: [mô tả feature].

Quy trình bắt buộc:
1. Đọc AGENTS.md.
2. Đọc docs/requirements.md và docs/architecture.md.
3. Tạo plan trong docs/plans/YYYY-MM-DD-feature-name.md.
4. Implement theo từng task nhỏ.
5. Chạy lint/build/test.
6. Nếu có quyết định kỹ thuật mới, ghi ADR trong docs/decisions/.
7. Báo cáo file đã thay đổi và kết quả verify.
```

## Quy tắc riêng cho MedKid

Vì MedKid liên quan bối cảnh y tế/trẻ em:

- Không trình bày output AI như chẩn đoán y khoa chắc chắn.
- Luôn có cảnh báo: nội dung chỉ mang tính tham khảo, không thay thế bác sĩ.
- Không log dữ liệu sức khỏe cá nhân không cần thiết.
- Nếu thêm AI pipeline, phải mô tả input/output/risk trong `docs/architecture.md` hoặc plan.
- Nếu thêm lưu trữ dữ liệu người dùng, phải ghi rõ dữ liệu nào được lưu, lưu ở đâu, và lý do.

## Definition of Done cho tài liệu AI

Một bộ document được xem là đủ khi:

```text
[ ] Người mới có thể chạy dự án từ README.md
[ ] AI agent biết quy tắc làm việc từ AGENTS.md
[ ] Product scope nằm trong docs/requirements.md
[ ] Kiến trúc nằm trong docs/architecture.md
[ ] Feature lớn có plan trong docs/plans/
[ ] Quyết định kỹ thuật lớn có ADR trong docs/decisions/
[ ] Script phát triển chạy được
[ ] Config mẫu không chứa secret thật
[ ] Lint/build pass hoặc lỗi được ghi rõ
```
