# OpenCode Task — Round 1 P0 / Agents C + E

You are OpenCode acting as Round 1 P0 UI implementer for MedKid.

Workdir: /Users/nb230601/Documents/aihack-medkid/medkid-app

Read first:
- AGENTS.md
- docs/requirements.md
- docs/architecture.md
- docs/plans/2026-05-21-mvp-ui-gap-agent-plan.md

Scope:
- Emergency Routing UI and Admin functional UI shells.
- Avoid parent/doctor components.
- Mock-first only. No backend integrations, no map dependency, no real APIs, no secrets.
- Medical/safety copy must avoid diagnosis; emergency UI must prioritize 115 and urgent escalation.

Primary files you may edit/create:
Emergency:
- Modify: src/components/emergency/emergency-screen.tsx
- Modify: src/lib/emergency.ts only if needed and low-risk
- Create: src/components/emergency/emergency-map-placeholder.tsx
- Optional create: src/config/emergency-config.ts

Admin:
- Modify: src/app/(admin)/admin/page.tsx
- Create: src/components/admin/admin-tabs.tsx
- Create: src/components/admin/audit-trail-panel.tsx
- Create: src/components/admin/emergency-config-panel.tsx
- Create: src/components/admin/knowledge-base-panel.tsx
- Create: src/components/admin/model-config-panel.tsx
- Create: src/components/admin/operations-report-panel.tsx
- Modify: src/mock/data.ts only for small mock admin records if needed; prefer local arrays in components to avoid conflicts.

Emergency tasks:
1. Make hotline/hours/hospital list config-driven through a local config object.
2. Refine office-hours UI:
   - always show 115 emergency CTA.
   - show KinderHealth hotline during office hours.
   - show map/list-focused route outside office hours.
3. Add map placeholder UI for out-of-office state:
   - no new map dependency.
   - show GPS/fallback copy and nearest-hospital cards.
4. Add “Admin cấu hình” note linking to /admin or config section for demo.
5. Ensure emergency screen has no LLM/chat continuation CTA except guarded “Quay lại” copy.

Admin tasks:
1. Convert admin overview into tabbed console:
   - Overview
   - Audit Trail
   - Emergency Config
   - Knowledge Base
   - AI/Fusion Config
   - Reports
2. Audit Trail tab:
   - filters: event type, session/case text, date range mock fields.
   - table with current mock audit logs or local mock data.
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
   - workflow table with W_nlp + W_cv validation summing to 1.0.
   - LLM parameters form: temperature, max tokens, top_p, base prompt.
   - reset default and changelog mock.
6. Reports tab:
   - KPI cards.
   - doctor response-time table.
   - workflow AI quality table.
   - export CSV/PDF mock buttons.

Acceptance checks:
- Emergency screen remains red, urgent, and avoids medical diagnosis.
- 115 CTA is always visible.
- Hospital routing UI is visible without real GPS.
- Admin UI is navigable without backend.
- All forms clearly say “mock/demo config” where not persisted.
- No destructive delete without confirmation in UI.
- npm run lint passes.

After implementation:
- Run npm run lint.
- If lint fails, fix your own changes.
- Summarize changed files and any remaining gaps.
