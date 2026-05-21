# Project Structure Implementation Plan

> For Hermes: Use this plan as the baseline for future source-code-first development.

## Goal

Thiết lập bộ thư mục và tài liệu nền tảng để phát triển MedKid ngay trong source code.

## Architecture

Repo giữ source code, tài liệu, kế hoạch, quyết định kỹ thuật, script và config mẫu trong cùng workspace `medkid-app/`. AI agent và developer đọc `AGENTS.md`, `docs/requirements.md`, `docs/architecture.md` trước khi triển khai feature.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- npm scripts

## Tasks

### Task 1: Add repository guidance

Files:
- Create/modify: `AGENTS.md`
- Create/modify: `README.md`

Verification:
- Open files and confirm they explain how to work inside `medkid-app/`.

### Task 2: Add project documentation

Files:
- Create: `docs/requirements.md`
- Create: `docs/architecture.md`

Verification:
- Confirm product requirements and architecture baseline are documented.

### Task 3: Add planning and decision folders

Files:
- Create: `docs/plans/`
- Create: `docs/decisions/`
- Create: `docs/decisions/0001-source-code-first-workspace.md`

Verification:
- Confirm future features can be planned and technical decisions can be tracked.

### Task 4: Add repeatable scripts

Files:
- Create: `scripts/dev.sh`
- Create: `scripts/lint.sh`
- Create: `scripts/build.sh`

Verification:
- Run `./scripts/lint.sh` and `./scripts/build.sh` when code changes are introduced.

### Task 5: Add config templates

Files:
- Create: `config/development.example.env`
- Create: `config/staging.example.env`
- Create: `config/production.example.env`

Verification:
- Confirm no real secrets are committed.
