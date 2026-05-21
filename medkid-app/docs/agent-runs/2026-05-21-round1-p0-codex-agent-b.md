# Codex Task — Round 1 P0 / Agent B

You are Codex acting as Agent B for MedKid MVP Round 1 P0.

Workdir: /Users/nb230601/Documents/aihack-medkid/medkid-app

Read first:
- AGENTS.md
- docs/requirements.md
- docs/architecture.md
- docs/plans/2026-05-21-mvp-ui-gap-agent-plan.md

Scope:
- Parent multimodal input UI only.
- Own chat input, ASR fallback UI, real file input mock, topic-change prompt UI.
- Avoid doctor/admin/emergency/onboarding/settings components.
- Do not add dependencies.
- Do not add real upload/network/API calls; this is mock-first MVP demo.

Primary files you may edit/create:
- Modify: src/components/parent/chat-panel.tsx
- Create: src/components/parent/image-attachment-grid.tsx
- Create: src/components/parent/asr-permission-help.tsx
- Modify src/store/app-store.ts only if strictly necessary; prefer component-local state to avoid conflicts.
- Modify src/types/index.ts only if strictly necessary; prefer local type aliases.

Tasks:
1. Enforce max 1,000 characters in textarea using maxLength={1000}.
2. Keep counter visible after 500 chars and show warning near 1,000 chars.
3. Add hidden real file input:
   - accept="image/*"
   - capture="environment"
   - support up to 3 files in UI.
4. Replace/augment single mockImage string with attachment array UI:
   - thumbnails/grid.
   - remove each image independently.
   - show filename and mock size.
   - keep existing mock camera/demo image flow working.
5. Add quality warning mock:
   - after selecting file, show “Ảnh sẽ được kiểm tra độ sáng/độ nét trước khi CV”.
   - allow sending after warning.
6. Add upload/progress simulation UI for selected files before send or during send.
7. Add ASR permission help UI:
   - simulate denied permission state from a small “test permission error” link/button in demo mode.
   - show Chrome/Safari/Firefox guidance.
   - “Thử lại” and “Nhập bằng bàn phím” actions.
8. Add topic-change prompt UI placeholder:
   - mock rule: if previous messages exist and input contains “vấn đề khác”, show prompt.
   - buttons: “Tiếp tục” / “Bắt đầu chủ đề mới”.

Acceptance checks:
- Can send text + 1 to 3 image attachments.
- Existing mock camera still works.
- Empty or <5 char send remains disabled.
- Emergency flow remains first-class and not broken.
- No real uploads or external APIs.
- npm run lint passes.

After implementation:
- Run npm run lint.
- If lint fails, fix your own changes.
- Summarize changed files and any remaining gaps.
