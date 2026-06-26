---
name: web-api-error-policy
description: Standardize error handling for packages/web API code. Use when creating or refactoring web API helpers, GET loaders, mutations, page error states, notFound handling, or form submission flows in packages/web.
---

# Web API Error Policy

## Purpose

Use this skill to keep `packages/web` consistent about how API errors are surfaced in pages, components, and API helpers.

## Core Rules

- Keep user-facing messages in `packages/web/utils/api-error.ts`.
- For read flows:
  - return a `result` union when the page wants inline rendering of empty/error states;
  - call `notFound()` for a missing single resource when the route should show a 404;
  - return the service-unavailable message for network failures.
- For mutation flows:
  - throw `Error` on network failures;
  - throw `Error(getApiErrorMessage(response))` when `response.ok` is false;
  - let forms catch the error and render a local submit message.
- For Next.js route-level failures:
  - use `not-found.tsx` for 404 UI when the route should own the missing-resource state;
  - use `error.tsx` for uncaught exceptions if the segment should recover with an error boundary.
- Prefer one local `fetch` pattern per file over shared mutation wrappers when the goal is consistency of structure.

## Apply This Policy

- When adding a new API helper in `packages/web/api/`, follow the existing read-vs-mutation split.
- When refactoring old helpers, preserve the current behavior unless the request explicitly changes the UI strategy.
- When in doubt, consult [references/error-matrix.md](references/error-matrix.md) for the default mapping.
