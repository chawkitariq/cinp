---
name: test-react-components
description: Add or improve Jest and React Testing Library tests for React/Next.js components in the cinp web package. Use when Codex needs to set up web component tests, test client components, test shadcn/Radix UI interactions, test react-call Callables such as confirmation dialogs, choose user-centered assertions, or verify tests and lint for packages/web.
---

# Test React Components

## Overview

Use this workflow to add focused component tests in `packages/web` without drifting into implementation rewrites. Prefer tests that exercise the public behavior users and callers rely on.

## Workflow

1. Read the component, its nearest consumers, and existing test/config files before editing.
2. Use Context7 for current docs when adding or changing library-specific test setup or APIs: resolve the library first, then fetch docs.
3. If `packages/web` lacks test setup, add the smallest Jest setup that fits Next.js:
   - `jest.config.mjs` using `next/jest.js`
   - `jest.setup.ts` importing `@testing-library/jest-dom`
   - a `test` script in `packages/web/package.json`
   - dev dependencies for `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `@types/jest`
4. Write colocated tests as `*.test.tsx` beside the component unless the project already has another pattern.
5. Verify with a targeted test, then the package test script, then lint when TypeScript/React code or config changed.

## Testing Rules

- Test behavior, not implementation details. Query by role, accessible name, label text, or visible text before using test IDs.
- Use `screen` queries from React Testing Library and `userEvent` for interactions that represent user behavior.
- Keep assertions tied to stable user-visible outcomes: rendered dialog text, focused action, button availability, promise resolution, navigation callbacks, alert text, etc.
- Avoid snapshots for interactive components unless they capture a genuinely stable contract.
- Keep test helpers small and local. Extract only when repetition obscures the scenario.
- Do not mock local UI components by default. Mock framework boundaries only when necessary, such as `next/navigation`, network calls, timers, or browser APIs missing from JSDOM.
- Clean up async behavior with `await`, `findBy*`, `waitFor`, or resolved promises instead of arbitrary timeouts.

## React Callables

For components created with `react-call`, test the Callable API rather than reaching into the private view:

```tsx
render(<ConfirmDialog />)

const response = ConfirmDialog.call({
  title: "Supprimer ce probleme ?",
  description: "Cette action est definitive.",
})

expect(await screen.findByRole("dialog", { name: "Supprimer ce probleme ?" })).toBeInTheDocument()
await userEvent.click(screen.getByRole("button", { name: "Annuler" }))
await expect(response).resolves.toBe(false)
```

Rules:

- Mount exactly one Root for the Callable in each test render.
- Trigger calls from `act` if React warns about state updates from the imperative call.
- Assert the response promise for confirm, cancel, and dismiss flows.
- For Radix dialogs, verify accessible `dialog` content and important focus behavior when it is part of the contract.

## Verification

Prefer these commands from the repo root:

```bash
pnpm --filter @cinp/web test -- <test-file> --runInBand
pnpm --filter @cinp/web test --runInBand
pnpm --filter @cinp/web lint
```

If `pnpm ... test -- --runInBand` is used, Jest may interpret `--runInBand` as a pattern. Use `pnpm --filter @cinp/web test --runInBand` for the full suite.

If sandboxed `pnpm` fails with `unable to open database file`, rerun the same command with approval outside the sandbox.
