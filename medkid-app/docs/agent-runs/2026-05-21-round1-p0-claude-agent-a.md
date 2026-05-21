# Claude Code Task — Round 1 P0 / Agent A

You are Claude Code acting as Agent A for MedKid MVP Round 1 P0.

Workdir: /Users/nb230601/Documents/aihack-medkid/medkid-app

Read first:
- AGENTS.md
- docs/requirements.md
- docs/architecture.md
- docs/plans/2026-05-21-mvp-ui-gap-agent-plan.md

Scope:
- Parent Onboarding, Settings, Consent/Data Rights only.
- Avoid doctor/admin/emergency components.
- Do not add dependencies.
- Do not add real secrets, API calls, SMS/email calls, or production auth.
- Medical/safety copy must not diagnose and must say doctor approval is required for parent-facing medical advice.

Primary files you may edit/create:
- Modify: src/components/parent/onboarding-wizard.tsx
- Create: src/components/parent/settings-panel.tsx
- Modify: src/components/parent/chat-panel.tsx OR src/components/shared/role-app-shell.tsx only if needed to expose Settings entry point
- Modify: src/store/app-store.ts only for small mock settings/session actions if needed
- Modify: src/types/index.ts only if absolutely needed; prefer local component state/types to avoid conflicts.

Tasks:
1. Add email field to onboarding step 1.
2. Replace password validation with: min 8 chars, at least one uppercase, at least one number.
3. Add mock OTP sub-step after phone/email/password validation:
   - show “Gửi OTP” / “Nhập OTP” UI.
   - demo OTP is 123456.
   - do not log OTP to debug console.
   - onboarding cannot complete without valid OTP.
4. Add VCLINIC ID field in child profile step:
   - input placeholder VC-2024-0815.
   - mock verify button with success/fail state.
5. Add multi-child selector / child list UI with max 5 children.
   - Can add/edit child rows in mock UI.
   - Clear warning when max 5 reached.
6. Add Parent Settings panel/sheet:
   - Withdraw consent: 2-step confirmation, then call logout() or equivalent session clear.
   - Request data deletion: confirm by typing phone or email, show mock “sẽ xử lý trong 72 giờ”.
   - Export personal data: show mock ZIP request and 24h link notice.
   - All copy clearly says demo/mock mode where not persisted.
7. Add safe audit/debug events for data-rights actions without storing PHI content if existing store pattern supports it. If adding store actions would conflict, keep local mock event UI.

Acceptance checks:
- Onboarding cannot complete without OTP and valid password.
- Consent withdrawal clears session state through logout()/existing store behavior.
- No real SMS/email/API call is made.
- No real secrets or env values are added.
- npm run lint passes.

After implementation:
- Run npm run lint.
- If lint fails, fix your own changes.
- Summarize changed files and any remaining gaps.
