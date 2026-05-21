# Playwright E2E Init

## Context

The project currently has no automated end-to-end test runner. The `tests/` directory exists but only contains a placeholder file.

## Plan

1. Add Playwright as a development dependency.
2. Add npm scripts for running E2E tests in headless and UI modes.
3. Add a Playwright config that starts the Next.js dev server automatically.
4. Add an initial smoke test for the application home page.
5. Document the E2E commands in the README.

## Validation

- Run `npm run lint`.
- Run `npm run build`.
- Run `npm run test:e2e` if browsers are available locally.
