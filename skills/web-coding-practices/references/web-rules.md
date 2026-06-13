# packages/web Rules

Use these rules as the detailed reference for `skills/web-coding-practices/SKILL.md`. Pair them with `skills/project-coding-practices/references/common-rules.md` for repository-wide workflow, package-boundary, shared-contract, and verification defaults.

## Table Of Contents

1. Architecture
2. App Router
3. Components
4. Hooks, Utils, And Constants
5. Data And Shared Contracts
6. Forms And Client Logic
7. Styling
8. Verification

## Architecture

- Treat `packages/web` as a Next.js 16 App Router application.
- Keep route files under `app/`.
- Use the `@/*` alias from `tsconfig.json` for local imports.
- Reuse existing folders before creating new ones:
  - `app/` for routes, layouts, and route-local UI;
  - `components/ui/` for reusable UI primitives;
  - `hooks/` for reusable stateful or browser-dependent logic;
  - `utils/` for pure helper functions;
  - `constants/` for fixed config values and environment-derived constants;
  - `lib/` for shared low-level helpers such as `cn`.

## App Router

- Prefer server components by default.
- Add `"use client"` only when the file uses React hooks, browser APIs, client navigation, controlled forms, or client-only libraries.
- Keep route-local helper functions in the page or layout file when they are only used there.
- When a page grows, extract presentational or interactive subcomponents instead of turning the route file into a catch-all utility module.
- Preserve explicit rendering intent such as `export const dynamic = "force-dynamic"` when the route depends on uncached API reads.
- `app/page.tsx` is still close to the starter template; it may be replaced when implementing the first real product homepage.

## Components

- Reuse `components/ui` primitives before creating new wrappers.
- Prefer `lucide-react` for icons.
- Follow existing composition patterns such as `Button asChild` with `next/link`.
- Keep reusable components focused on UI behavior and presentation; push data fetching and domain shaping up to the route level unless a shared component clearly owns it.
- Keep accessibility intact: preserve labels, descriptions, `aria-invalid`, and keyboard-friendly controls.
- Add JSDoc to exported reusable components when their composition contract, accessibility responsibility, data expectations, or side effects are not obvious from props alone.

## Hooks, Utils, And Constants

- Create a hook only when logic is both reusable and stateful, effectful, or browser-dependent.
- Good hook candidates:
  - dynamic library lifecycle management;
  - DOM refs and imperative browser integrations;
  - reusable client state orchestration used by multiple components.
- Keep hooks in `hooks/` and export a small, stable API.
- Keep utils pure and synchronous when possible. A util should not depend on React state, DOM access, or route state.
- Good util candidates:
  - formatting helpers such as dates or labels;
  - small parsing and normalization helpers;
  - deterministic data shaping used in multiple files.
- Keep constants in `constants/` for repeated fixed values, environment-derived URLs, or app-wide configuration values such as `API_BASE_URL`.
- Do not move logic into `utils/` or `hooks/` just to make a page file shorter. Reuse should be real, not speculative.
- Add JSDoc when creating or changing reusable hooks, utils, and constants:
  - hooks: describe the reusable behavior, browser/API assumptions, lifecycle effects, and returned API;
  - utils: describe domain intent, important edge cases, units, parsing/formatting rules, and error behavior;
  - constants: describe source, environment dependency, units, or product meaning when the value is not self-evident.
- Keep JSDoc directly above the exported declaration. Page-local helpers only need JSDoc when they carry non-obvious domain rules.

## Data And Shared Contracts

- Follow `skills/project-coding-practices/references/common-rules.md` for shared-contract ownership, package boundaries, and no-duplication rules.
- Import shared types from `@cinp/api`, preferably with `import type`.
- Keep API endpoint base values centralized in `constants/api.ts` instead of scattering literals across routes.
- Use plural API resource paths that match the NestJS controllers, such as `/problems`, `/users`, `/assessments`, `/assessment-sessions`, and `/submissions`.
- Add or update JSDoc for frontend data mappers, read models, and API-facing helper functions whenever they encode serialization differences, fallback behavior, or assumptions about `@cinp/api` contracts.

## Forms And Client Logic

- Keep React Hook Form and Zod usage inside client components.
- Keep validation schemas close to the form unless the same schema is reused across multiple routes.
- Extract reusable effect-heavy integrations, such as Monaco editor setup, into hooks.
- Keep submit handlers responsible for shaping request payloads, handling API errors, and routing after success.
- Prefer small local helpers for one-page payload shaping; move them to `utils/` only when another route needs the same behavior.

## Styling

- Use Tailwind CSS v4 utilities and the design tokens defined in `app/globals.css`.
- Preserve the existing shadcn setup from `components.json`:
  - style: `radix-nova`;
  - base color: `neutral`;
  - CSS variables enabled;
  - `lucide` icon library.
- Reuse semantic tokens such as `bg-background`, `text-muted-foreground`, `border-input`, and `ring-ring`.
- Avoid introducing ad hoc global CSS when Tailwind utilities or existing tokens already solve the problem.
- Keep layouts responsive and stable. Avoid visible layout shift, clipped content, and controls that only work on desktop widths.

## Verification

Run checks with the current workspace commands:

```bash
pnpm --filter web lint
pnpm --filter web build
```

- `lint` is the default verification for ordinary component, hook, util, and styling changes.
- Add `build` when the change affects routing, client/server boundaries, dynamic imports, shared contracts, or Next.js configuration.
- After changing shared contracts in `packages/api`, build API before validating web:

```bash
pnpm --filter api build
pnpm --filter web build
```
