# MediKid-AI MVP UI Gap & Multi-Agent Implementation Plan

> For Hermes / AI agents: use this plan as the source-of-truth for UI gap closure. Implement in small PR-sized slices. Do not add real secrets. Medical/safety copy must avoid definitive diagnosis and must keep doctor approval before parent-facing advice.

Goal: identify UI not yet implemented against `/Users/nb230601/Documents/aihack-medkid/MediKid-AI_MVP_Spec.md` and split implementation work across multiple AI coding agents.

Architecture: current app is Next.js App Router + React client UI + Zustand + mock database/pipeline. The plan keeps MVP demo mock-first, but separates Parent, Doctor, Emergency, Admin, and QA workstreams so multiple AI tools can work independently with fewer file conflicts.

Tech Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Radix UI primitives, TipTap, mock data first; Supabase/realtime/real API integration stays behind explicit follow-up plans.

Source reviewed:
- MVP spec: `/Users/nb230601/Documents/aihack-medkid/MediKid-AI_MVP_Spec.md`
- Current source: `src/app`, `src/components`, `src/store/app-store.ts`, `src/lib/pipeline.ts`, `src/mock/data.ts`, `src/types/index.ts`
- Existing docs: `docs/user-stories-acceptance-criteria.md`, `docs/requirements.md`, `docs/architecture.md`

---

## 1. Executive UI Gap Summary

Current source already covers the core demo shell:
- Role landing page: `/`, `/parent`, `/doctor`, `/admin`
- Parent chat, consent modal, onboarding wizard
- Emergency screen with 115 + KinderHealth hotline and 5 HCM hospitals
- Doctor queue, case detail tabs, TipTap draft editor, diff view, approve/reject
- CV overlay component, RAG snippets, EMR tab, notification bell badge
- Debug console and idle logout component

UI still missing or incomplete versus MVP spec:

P0 — must close for MVP demo credibility:
1. Parent Settings / Consent Management UI
   - Missing withdraw consent flow.
   - Missing data deletion request UI.
   - Missing personal data export UI.
   - Missing session/account settings page or panel.

2. Onboarding/Auth UI completion
   - Current onboarding exists but lacks OTP step.
   - Missing email field.
   - Password rule is 6 chars, spec requires minimum 8 chars with uppercase + number.
   - Missing VCLINIC ID lookup/verify field.
   - Missing multi-child selector/max 5 children UI.

3. Real image input UI hardening
   - Current image flow is simulated only.
   - Missing `<input type="file" accept="image/*" capture="environment">`.
   - Missing camera/gallery choice, preview for real selected file, retake/replace, progress bar.
   - Missing image quality warning UI.
   - Missing multi-image grid up to 3 images.

4. Doctor review completion
   - Missing Forward to another doctor UI.
   - Reject flow has one confirmation, spec requests stronger confirmation.
   - Missing follow-up question suggestions panel.
   - Missing draft auto-save status every 10s.
   - Current diff is simple word include/exclude, not reliable word-level diff.

5. Admin functional UI shells
   - Current admin page is a static operations overview only.
   - Missing Audit Trail search/export UI.
   - Missing Emergency keyword CRUD UI.
   - Missing hotline/office-hours/hospital config UI.
   - Missing Knowledge Base CMS/test query UI.
   - Missing Fusion/LLM config UI.
   - Missing operational reporting tables/charts/export UI.

P1 — should close after P0 if demo time allows:
6. EMR/RAG doctor tools
   - Missing Refresh EMR button, spinner, cache timestamp warning.
   - RAG snippets display exists, but missing click-to-expand full source view.
   - Missing symptom progression timeline after 3+ turns.

7. Notification UI completion
   - Bell badge exists, but missing dropdown of 5 latest cases.
   - Missing mark-as-read / clear all.
   - Missing sound toggle setting.
   - Missing browser tab pending count badge.

8. Emergency routing realism
   - Emergency screen has 115 and 5 hospitals, but no map/geo UI.
   - Admin-configurable hotline/hours/hospital list not wired.
   - Office-hours logic does not yet drive map-vs-hotline behavior exactly as spec.

9. Parent chat detail polish
   - Character counter appears after 500 chars, but 1,000 char max is not enforced.
   - Missing real ASR permission error UI / retry / fallback.
   - Missing topic-change prompt and context reset UI.

P2 — post-MVP or production hardening:
10. Push/SMS notification preferences and permission screens.
11. Admin dashboards with real charts/PDF/Excel export.
12. Regulatory sandbox/compliance module separation UI.
13. Real WebSocket/Supabase realtime presence and production auth UI.

---

## 2. Traceable UI Gap Matrix

| Spec Area | Current Status | Missing UI | Priority | Suggested Agent |
|---|---|---|---|---|
| T1 Consent/Settings | Consent modal done; idle logout present | withdraw consent, delete data, export data, settings entry point | P0 | Agent A |
| T1 Parent identity | Onboarding wizard partial | OTP step, email, password policy, VCLINIC lookup, multi-child selector | P0 | Agent A |
| T2 Text input | Mostly done | enforce max 1000 chars, better error/toast state | P1 | Agent B |
| T2 ASR | Simulated done | real permission error UI, retry, keyboard fallback | P1 | Agent B |
| T2 Image | Simulated done | file input, multi-image grid, quality warning, upload/progress simulation | P0 | Agent B |
| T2/T3 Context | Pipeline partial | topic-change prompt, symptom timeline UI | P1 | Agent B + Agent D |
| T4 Emergency | Screen mostly done | map/geo state, config-driven routing, admin config linkage | P1 | Agent C |
| T5 Doctor queue | Queue and badge done | browser tab badge, sound toggle, notification dropdown | P1 | Agent D |
| T5 Doctor detail | Tabs/editor/approve/reject done | forward flow, stronger reject confirmation, follow-up questions, auto-save status, robust diff | P0 | Agent D |
| T3 EMR/RAG | EMR/RAG panels partial | Refresh EMR, full snippet modal, cache warning | P1 | Agent D |
| T6 Debug/feedback | Debug console done | token diff capture display, learning dashboard UI | P2 | Agent E |
| T7 Compliance | Audit data model exists | Admin audit trail search/export page | P0 | Agent E |
| T8 Admin | Static overview exists | KB CMS, emergency keywords, config, reporting screens | P0/P1 | Agent E |
| QA/E2E | Playwright dependency exists | test coverage for parent/doctor/emergency/admin flows | P0 | Agent F |

---

## 3. Multi-Agent Work Allocation

### Agent A — Parent Onboarding, Settings, Consent/Data Rights

Scope:
- Own parent account/onboarding/settings UI only.
- Avoid touching doctor/admin components except links/navigation if needed.

Primary files:
- Modify: `src/components/parent/onboarding-wizard.tsx`
- Create: `src/components/parent/settings-panel.tsx`
- Modify: `src/components/parent/chat-panel.tsx` or `src/components/shared/role-app-shell.tsx` only to expose Settings entry point
- Modify: `src/store/app-store.ts` for mock settings actions only
- Modify: `src/types/index.ts` if new mock request types are needed

Tasks:
1. Add email field to onboarding step 1.
2. Replace password validation with: min 8 chars, at least one uppercase, at least one number.
3. Add mock OTP sub-step after phone/password validation:
   - show “Gửi OTP” / “Nhập OTP” UI.
   - use demo OTP `123456`.
   - do not log OTP to debug console.
4. Add VCLINIC ID field in child profile step:
   - input placeholder `VC-2024-0815`.
   - mock verify button with success/fail state.
5. Add Settings panel/sheet for parent:
   - Withdraw consent: 2-step confirmation, then call `logout()`.
   - Request data deletion: confirm by typing phone or email, show mock “sẽ xử lý trong 72 giờ”.
   - Export personal data: show mock ZIP request and 24h link notice.
6. Add audit/debug events for data-rights actions without storing PHI content.

Acceptance checks:
- Onboarding cannot complete without OTP and valid password.
- Consent withdrawal clears session state through `logout()`.
- No real SMS/email call is made.
- UI copy clearly states demo/mock mode.

Suggested AI tool:
- Cursor/Copilot for UI edits.
- Hermes/Claude Code for store integration review.

---

### Agent B — Parent Multimodal Input UI

Scope:
- Own chat input, ASR fallback UI, real file input mock, and context prompt UI.
- Avoid doctor/admin components except types needed for image arrays.

Primary files:
- Modify: `src/components/parent/chat-panel.tsx`
- Create: `src/components/parent/image-attachment-grid.tsx`
- Create: `src/components/parent/asr-permission-help.tsx`
- Modify: `src/store/app-store.ts` if image array handling needs extension
- Modify: `src/types/index.ts` only if attachment metadata is needed

Tasks:
1. Enforce max 1,000 characters in textarea using `maxLength={1000}`.
2. Keep counter visible after 500 chars and show warning near 1,000 chars.
3. Add hidden real file input:
   - `accept="image/*"`
   - `capture="environment"`
   - support up to 3 files in UI.
4. Replace single `mockImage` string with attachment array UI:
   - thumbnails/grid.
   - remove each image independently.
   - show filename and mock size.
5. Add quality warning mock:
   - after selecting file, show “Ảnh sẽ được kiểm tra độ sáng/độ nét trước khi CV”.
   - allow sending after warning.
6. Add upload/progress simulation UI for selected files before send or during send.
7. Add ASR permission help UI:
   - simulate denied permission state from a small “test permission error” link or button in demo mode.
   - show Chrome/Safari/Firefox guidance.
   - “Thử lại” and “Nhập bằng bàn phím” actions.
8. Add topic-change prompt UI placeholder if a new message appears unrelated:
   - mock rule: if previous messages exist and input contains “vấn đề khác”, show prompt.
   - buttons: “Tiếp tục” / “Bắt đầu chủ đề mới”.

Acceptance checks:
- Can send text + 1 to 3 image attachments.
- Existing mock camera still works.
- Empty or <5 char send remains disabled.
- Emergency flow remains first-class and not broken.

Suggested AI tool:
- v0/Bolt for fast UI component sketch if desired.
- Cursor/Claude Code for integration into existing store and Tailwind conventions.

---

### Agent C — Emergency Routing UI

Scope:
- Own emergency screen and emergency configuration surface.
- Coordinate with Agent E if admin config becomes shared.

Primary files:
- Modify: `src/components/emergency/emergency-screen.tsx`
- Modify: `src/lib/emergency.ts`
- Create: `src/components/emergency/emergency-map-placeholder.tsx`
- Optional create: `src/config/emergency-config.ts`

Tasks:
1. Make hotline/hours/hospital list config-driven through a local config object.
2. Refine office-hours UI:
   - always show 115 emergency CTA.
   - show KinderHealth hotline during office hours.
   - show map/list-focused route outside office hours.
3. Add map placeholder UI for out-of-office state:
   - no new map dependency in this pass unless approved.
   - show GPS/fallback copy and nearest-hospital cards.
4. Add “Admin cấu hình” note linking to `/admin` or config section for demo.
5. Ensure emergency screen has no LLM/chat continuation CTA except guarded “Quay lại” copy.

Acceptance checks:
- Emergency screen remains red, urgent, and avoids medical diagnosis.
- 115 CTA is always visible.
- Hospital routing UI is visible and understandable without real GPS.

Suggested AI tool:
- UI-focused agent for visual polish.
- Hermes/Codex for safety copy review.

---

### Agent D — Doctor Review Workspace Completion

Scope:
- Own doctor queue/detail/review tools.
- Avoid parent onboarding/admin pages.

Primary files:
- Modify: `src/components/doctor/case-detail.tsx`
- Modify: `src/components/doctor/case-queue.tsx`
- Create: `src/components/doctor/forward-case-dialog.tsx`
- Create: `src/components/doctor/follow-up-suggestions.tsx`
- Create: `src/components/doctor/emr-refresh-card.tsx`
- Modify: `src/store/app-store.ts`
- Modify: `src/lib/mock-db.ts`
- Modify: `src/types/index.ts`

Tasks:
1. Add Forward Case dialog:
   - dropdown online doctors from `MOCK_DOCTORS`.
   - reason/note field.
   - update case status to `forwarded` or reassign doctor in mock state.
   - audit event `FORWARDED`.
2. Strengthen reject flow:
   - second confirmation step or typed confirmation.
   - keep reason required.
3. Add Follow-up Suggestions panel:
   - 2–3 mock questions derived from workflow type.
   - click to append to draft.
   - dismiss suggestions.
4. Add draft auto-save indicator:
   - local timer every 10 seconds while draft differs.
   - show “Đã tự lưu HH:MM” mock status.
5. Replace simple diff with a safer word-level diff helper:
   - extracted function in component or `src/lib/utils.ts`.
   - show additions/deletions clearly.
6. Add EMR refresh UI:
   - button `Refresh EMR`.
   - spinner state.
   - updated timestamp.
   - warning if stale >15 min.
7. Add RAG snippet modal/full view when clicking a snippet.
8. Add symptom progression timeline:
   - if messages >= 3, show vertical timeline in messages tab or separate panel.
9. Complete doctor notification dropdown:
   - bell click opens 5 latest pending cases.
   - mark as read when selecting case.
   - clear all.

Acceptance checks:
- Approve still sends final edited draft to parent.
- Reject/forward do not send unapproved medical advice to parent.
- Pending queue counts remain correct.
- No lint warnings from unused imports.

Suggested AI tool:
- Claude Code/Codex for stateful UI because this touches many related files.
- Use one implementer then one reviewer agent, not parallel agents on the same files.

---

### Agent E — Admin, Config, Audit, Reporting UI Shells

Scope:
- Own admin route and admin-only components.
- Mock-first; do not implement real backend integrations yet.

Primary files:
- Modify: `src/app/(admin)/admin/page.tsx`
- Create: `src/components/admin/admin-tabs.tsx`
- Create: `src/components/admin/audit-trail-panel.tsx`
- Create: `src/components/admin/emergency-config-panel.tsx`
- Create: `src/components/admin/knowledge-base-panel.tsx`
- Create: `src/components/admin/model-config-panel.tsx`
- Create: `src/components/admin/operations-report-panel.tsx`
- Modify: `src/mock/data.ts` for additional mock admin records if needed

Tasks:
1. Convert admin overview into tabbed console:
   - Overview
   - Audit Trail
   - Emergency Config
   - Knowledge Base
   - AI/Fusion Config
   - Reports
2. Audit Trail tab:
   - filters: event type, session/case text, date range mock fields.
   - table with current mock audit logs.
   - export CSV button mock.
3. Emergency Config tab:
   - keyword list CRUD mock UI.
   - hotline and office-hours form.
   - hospital list CRUD mock UI.
4. Knowledge Base tab:
   - add/edit question, answer, tags.
   - upload/index document placeholder.
   - test query with top-5 mock results.
5. AI/Fusion Config tab:
   - workflow table with `W_nlp` + `W_cv` validation summing to 1.0.
   - LLM parameters form: temperature, max tokens, top_p, base prompt.
   - reset default and changelog mock.
6. Reports tab:
   - KPI cards.
   - doctor response-time table.
   - workflow AI quality table.
   - export CSV/PDF mock buttons.

Acceptance checks:
- Admin UI is navigable without backend.
- All forms clearly say “mock/demo config” where not persisted.
- No destructive delete without confirmation in UI.

Suggested AI tool:
- v0/Bolt for admin UI layout variants.
- Cursor for integrating into actual route/components.

---

### Agent F — QA, E2E, Regression and Demo Script

Scope:
- Own tests, QA checklist, and validation only.
- Do not change product code unless fixing test selectors or obvious bugs after approval.

Primary files:
- Create: `tests/e2e/mvp-ui.spec.ts` or project Playwright convention.
- Create: `docs/plans/2026-05-21-mvp-demo-qa-checklist.md`
- Modify: `README.md` only if adding test command notes.

Tasks:
1. Add Playwright smoke tests for:
   - landing page role cards.
   - parent onboarding + consent.
   - parent send normal symptom -> doctor queue receives case.
   - parent emergency keyword -> emergency screen appears.
   - doctor approve -> parent receives approved message with disclaimer.
   - doctor reject -> case status changes and no advice is sent.
   - admin page loads key tabs.
2. Add manual demo script:
   - normal case with image.
   - emergency case.
   - doctor edit/approve.
   - admin audit/config walkthrough.
3. Run:
   - `npm run lint`
   - `npm run build`
   - `npm run test:e2e` if browser deps are available.
4. Report failures with exact path, command, error, and owner agent.

Acceptance checks:
- Lint and build pass before final handoff.
- E2E failures are documented and assigned, not hidden.

Suggested AI tool:
- Playwright/Codex agent for tests.
- Separate review agent for flaky selectors.

---

### Agent G — Integration Owner / Merge Coordinator

Scope:
- Resolve conflicts and keep source-code-first docs accurate.
- One human or one main orchestrator agent should own this role.

Primary files:
- Modify: `docs/user-stories-acceptance-criteria.md`
- Modify: `docs/requirements.md` if scope changes.
- Modify: `docs/architecture.md` if data flow changes.
- Create ADRs in `docs/decisions/` for new dependencies or backend decisions.

Tasks:
1. Sequence agents to avoid conflicts:
   - Round 1 parallel: Agent A, B, C, E, F can start.
   - Agent D should start after B if attachment types change.
   - Agent G merges and runs checks after each round.
2. Enforce dependency rule:
   - No new dependency without plan/ADR.
   - Map placeholder is preferred over adding Leaflet/Mapbox in P0.
3. Update US/AC statuses after implementation.
4. Run final verification:
   - `npm run lint`
   - `npm run build`
   - targeted Playwright smoke tests if available.

Acceptance checks:
- Documentation matches implementation.
- No PHI/secrets in code/docs/logs.
- Medical safety disclaimer and doctor approval rule remain intact.

---

## 4. Recommended Execution Order

### Round 0 — Baseline verification
Owner: Agent F + Agent G

1. Run `npm run lint` and `npm run build`.
2. Record current warnings/errors.
3. Confirm app routes load: `/`, `/parent`, `/doctor`, `/admin`.

### Round 1 — P0 UI closure
Parallel where possible:

- Agent A: onboarding/settings/data rights.
- Agent B: image input + char limit.
- Agent C: emergency routing polish.
- Agent E: admin tabbed shell + audit/config baseline.

Sequential / after Agent B where needed:

- Agent D: doctor forward/reject/follow-up/autosave/diff.

### Round 2 — P1 demo hardening

- Agent D: EMR refresh, RAG modal, doctor notification dropdown, symptom timeline.
- Agent B: ASR permission fallback and topic reset prompt.
- Agent C/E: connect emergency config UI to local config mock.
- Agent F: Playwright smoke tests and demo script.

### Round 3 — Post-MVP backlog

- Real Supabase persistence/realtime.
- Real LLM streaming/context builder.
- Real pgvector/knowledge base seed 50+ chunks.
- Real map/GPS integration.
- Push/SMS notification.
- Compliance sandbox and production audit immutability.

---

## 5. Guardrails for All Agents

1. Never send AI/LLM draft directly to parent without doctor approval.
2. Do not introduce diagnosis-certain language such as “bé bị bệnh X”. Use screening/possibility language.
3. Emergency symptoms must bypass normal AI flow.
4. Do not commit real API keys, SMS tokens, Supabase service-role secrets, or PHI samples.
5. Keep mock/demo states clearly labeled.
6. Prefer small components over large page rewrites.
7. Run lint/build for every merged workstream.
8. If adding dependencies, create an ADR first.

---

## 6. Suggested Prompt for Each AI Agent

Use this template when sending work to another AI coding tool:

```text
Bạn là Agent [A/B/C/D/E/F/G] trong dự án MediKid-AI.

Repo: /Users/nb230601/Documents/aihack-medkid/medkid-app
Đọc trước:
- AGENTS.md
- docs/requirements.md
- docs/architecture.md
- docs/plans/2026-05-21-mvp-ui-gap-agent-plan.md

Phạm vi của bạn:
[copy đúng section Agent tương ứng]

Ràng buộc:
- Không thêm secret.
- Không làm AI tự gửi tư vấn cho phụ huynh khi chưa có bác sĩ approve.
- Không dùng ngôn ngữ chẩn đoán chắc chắn.
- Không sửa file ngoài phạm vi nếu không cần.
- Sau khi xong chạy npm run lint và báo kết quả.

Output cần trả về:
1. File đã sửa/tạo.
2. UI đã hoàn thành theo AC nào.
3. Lệnh đã chạy và kết quả.
4. Gap còn lại / blocker.
```

---

## 7. Definition of Done

MVP UI gap closure được xem là đạt khi:

- Parent flow có onboarding + consent + settings/data rights mock đầy đủ.
- Parent chat hỗ trợ text, mock ASR, mock/real file image UI, emergency bypass.
- Emergency UI rõ ràng, có 115, hotline policy, hospital routing view.
- Doctor workspace có queue, detail, EMR/RAG/CV, edit/diff/autosave, approve/reject/forward.
- Admin có audit/config/KB/reporting UI shell đủ để demo quản trị.
- Debug console/audit không lộ secrets hoặc raw sensitive data không cần thiết.
- `npm run lint` pass.
- `npm run build` pass.
- Smoke test hoặc manual demo script đi qua normal case + emergency case + doctor approval.
