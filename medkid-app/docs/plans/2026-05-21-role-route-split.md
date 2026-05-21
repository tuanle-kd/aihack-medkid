# Role Route Split

## Context

`MediKid-AI_3Sprint.md` calls for role-based areas for parent, doctor, and admin. The current app renders parent chat and doctor queue/detail together on `/`, which is useful for operator demos but does not match the role separation expected by the sprint plan.

## Scope

- Replace the split-screen home page with a role entry page.
- Add separate App Router routes:
  - `/parent` for the parent chat flow.
  - `/doctor` for the doctor queue and case review flow.
  - `/admin` as an operations placeholder.
- Keep the current mock Zustand data layer for this step.
- Keep consent modal on the parent route only.
- Keep debug console available on role routes.

## Out of Scope

- Supabase auth.
- Middleware role guard.
- Cross-browser realtime persistence.
- Admin CMS implementation.

## Validation

- `npm run lint`
- `npm run build`
