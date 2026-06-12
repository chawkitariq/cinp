# packages/web Rules

Use these rules as the detailed reference for `skills/web-coding-practices/SKILL.md`. Prefer the smallest coherent change that matches the existing route, component, and styling patterns.

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

## Data And Shared Contracts

- Treat `@cinp/api` as the owner of shared API contracts.
- Import shared types from `@cinp/api`, preferably with `import type`.
- Do not recreate API entities, enums, or payload shapes inside `packages/web`.
- Do not import from `packages/api/src/...`, `packages/api/dist/...`, or relative paths crossing package boundaries.
- Remember that JSON responses can differ from backend entity runtime types, especially dates. If the current exported contract is not browser-accurate, add an explicit shared contract in `packages/api` instead of patching the shape ad hoc in web.
- Keep API endpoint base values centralized in `constants/api.ts` instead of scattering literals across routes.

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
