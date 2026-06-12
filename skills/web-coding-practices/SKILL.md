---
name: web-coding-practices
description: Project-specific coding standards for packages/web, a Next.js App Router frontend using React 19, Tailwind CSS v4, shadcn/ui, Radix UI, and shared API contracts from @cinp/api. Use when creating, modifying, reviewing, or refactoring files under packages/web; implementing routes, pages, layouts, UI components, hooks, utils, constants, forms, fetch logic, Monaco editor integrations, styling, or shared frontend helpers; or checking web code against the current repository rules.
---

# Web Coding Practices

## Purpose

Apply the coding rules established by the current `packages/web` codebase. Treat these as the local frontend conventions unless a newer file in the repository clearly establishes a different pattern.

## Workflow

1. Inspect the relevant files in `packages/web` before editing.
2. Keep App Router files in `app/`; prefer server components by default and add `"use client"` only when hooks, browser APIs, or client-side mutations are required.
3. Reuse `components/ui` and `lib/utils.ts` before creating new local primitives.
4. Keep shared contracts owned by `@cinp/api`; import them from the package boundary, preferably with `import type`.
5. Put reusable browser or stateful logic in `hooks/`, pure stateless helpers in `utils/`, and static config values in `constants/`.
6. Keep page-specific helpers inside the route file unless they are clearly reusable across multiple screens.
7. Preserve the Tailwind v4 and shadcn setup in `app/globals.css` and `components.json`; do not introduce a parallel styling system.
8. Use Context7 first when the task depends on current Next.js, React, Tailwind CSS, shadcn/ui, Radix UI, React Hook Form, Zod, or Monaco behavior that may have changed.
9. Run focused verification with `pnpm --filter web lint`, and add `pnpm --filter web build` when the change touches routes, shared contracts, rendering boundaries, or framework configuration.

## Load Detailed Rules

Read `references/web-rules.md` when:

- editing App Router pages, layouts, or route structure;
- deciding whether logic belongs in `app/`, `components/`, `hooks/`, `utils/`, or `constants/`;
- adding or changing form logic, fetch logic, or browser-only integrations;
- touching `globals.css`, shadcn components, or Tailwind styling conventions;
- importing shared types from `@cinp/api`;
- reviewing code under `packages/web`.

## Strong Defaults

- Do not duplicate API types in web; import them from `@cinp/api`.
- Do not import from `packages/api/src/...` or `packages/api/dist/...`; use the package boundary only.
- Do not create a hook for logic that is just a small pure function.
- Do not move page-local helpers into `utils/` or `hooks/` unless they have clear reuse.
- Do not add `"use client"` to an App Router file unless the component genuinely needs client behavior.
- Do not add new design systems, icon packs, or CSS conventions when the existing shadcn and Tailwind setup already covers the need.
- Do not bypass `constants/` for repeated environment-derived URLs or fixed config values.
- Keep comments and JSDoc rare, short, and in English when they add real value.
