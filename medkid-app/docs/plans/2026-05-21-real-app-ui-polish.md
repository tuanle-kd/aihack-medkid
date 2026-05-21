# Real App UI Polish

## Goal

Make the current MedKid MVP feel like a credible operating product instead of a UI demo.

## Scope

- Improve the role landing screen with product-level status, clinical workflow context, and less placeholder wording.
- Polish the shared shell so navigation, status, and debug access feel like app chrome.
- Improve parent chat with clinical profile context, icon-based UI, stronger empty state, and less demo language.
- Improve doctor queue/detail with clearer operational signals, responsive layout, and professional medical labels.
- Replace the admin placeholder with an operations dashboard surface.

## Constraints

- No new dependencies.
- Preserve existing mock data and state behavior.
- Keep medical safety language where advice could be inferred.
- Run lint/build after code changes.

## Verification

- `npm run lint`
- `npm run build`
- Start the dev server and visually check core routes when practical.
