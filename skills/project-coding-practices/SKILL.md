---
name: project-coding-practices
description: Shared coding standards for the cinp pnpm monorepo, covering repository workflow, package boundaries, shared API contracts, organization heuristics, comments, verification, and dependency documentation. Use when creating, modifying, reviewing, or refactoring code in this repository across packages/api, packages/web, or cross-package changes; when deciding whether a rule belongs in API or web skills; or when applying common project practices before package-specific rules.
---

# Project Coding Practices

## Purpose

Apply the repository-wide coding practices that are common to both API and web work. Use package-specific skills for stack details, but keep these shared rules as the baseline.

## Workflow

1. Inspect nearby files and current repository patterns before editing.
2. Prefer the smallest coherent change that solves the task.
3. Keep package boundaries explicit. Use public workspace package exports instead of deep imports across packages.
4. Keep shared API contracts owned by `packages/api` and consumed by `packages/web` through `@cinp/api`.
5. Put logic where it naturally belongs now; extract helpers only for real reuse, shared ownership, or meaningful complexity reduction.
6. Preserve the current stack and conventions unless the user explicitly asks for a migration.
7. Use Context7 before relying on current library, framework, SDK, API, CLI, or cloud-service behavior.
8. Add or update tests when behavior, validation, contracts, or user-visible flows change.
9. Run focused verification for the affected package and broaden checks when changes cross package boundaries.
10. Leave unrelated user changes untouched.

## Load Detailed Rules

Read `references/common-rules.md` when:

- working across `packages/api` and `packages/web`;
- changing shared API exports, DTOs, entities, enums, response types, or web imports from `@cinp/api`;
- deciding whether to create a helper, hook, util, reference file, or abstraction;
- reviewing code for repository-wide consistency;
- updating package-specific coding-practice skills.

## Strong Defaults

- Do not duplicate contracts, enums, DTOs, or response shapes across packages.
- Do not import across package internals such as `packages/api/src/...` from web.
- Do not introduce major tools from `docs/mvp.md` unless they already exist or the task asks for them.
- Do not mix unrelated cleanup with feature work.
- Keep comments rare, short, and useful.
- Keep generated placeholders out of committed behavior.
