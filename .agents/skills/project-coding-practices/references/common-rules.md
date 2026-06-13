# Common Project Rules

Use these rules as the shared baseline for coding work in the `cinp` monorepo. Package-specific skills may add stricter stack rules, but should not contradict this file without an explicit repository change.

## Repository Workflow

- Read the relevant neighboring files before editing.
- Follow existing local patterns before introducing a new abstraction.
- Make the smallest coherent change that satisfies the request.
- Avoid broad formatting churn or unrelated refactors.
- Treat `docs/mvp.md` as product direction, not proof that a technology is installed.
- Leave unrelated user changes in the working tree untouched.

## Package Boundaries

- Treat packages as ownership boundaries.
- Use package public exports for cross-package usage.
- Do not deep-import implementation files from another package.
- Keep server-only implementation details out of frontend runtime bundles.
- When a package needs a broader public surface, add an explicit export instead of reaching into internals.

## Shared API Contracts

- Treat `packages/api` as the only source of truth for API entities, DTOs, enums, request payloads, and response/read-model contracts consumed by web.
- Expose every web-consumed contract from `packages/api/src/index.ts`; never deep-import from `packages/api/src/...` in web.
- Import shared contracts in `packages/web` from `@cinp/api`, preferably with `import type` for type-only usage.
- Do not duplicate API shapes in web files. Avoid web-local `*Payload`, copied enum literal unions, copied DTO interfaces, or hand-written response models when an API contract exists or should be exported.
- Type web API helpers with API DTOs for request bodies, such as `Create*Dto` and `Update*Dto`, and API entities/read models for responses.
- Keep API-facing enums that the web needs at runtime in lightweight API contract files, not only inside server-heavy modules, then export them from `packages/api/src/index.ts`.
- Use value imports from `@cinp/api` in client components only for lightweight runtime-safe exports such as standalone enums. Keep NestJS, TypeORM entities, decorators, and server-only classes type-only in web.
- Model HTTP JSON differences explicitly when they differ from backend runtime entities, especially `Date` fields serialized as strings.
- After changing shared contracts, build or type-check API before validating web.

## Code Organization

- Keep business, data, UI, and infrastructure concerns in their natural package-specific layers.
- Keep one-off route or service helpers local until reuse is real.
- Extract shared helpers only when they reduce meaningful duplication, clarify ownership, or isolate non-trivial complexity.
- Prefer existing helper folders and local conventions over creating new categories.
- Keep names concrete and domain-oriented.

## User-Facing Errors

- Do not display developer- or infrastructure-focused messages in the UI, including raw service names, framework names, stack details, server process hints, URLs, status-code-only text, or exception messages.
- Map network, HTTP, and unexpected failures to product-facing messages that explain the user impact and a reasonable next action.
- Keep technical detail available only in logs, diagnostics, tests, or developer tooling; do not rely on backend exception text as frontend copy.
- Centralize reusable UI error mapping in frontend helpers so pages and components do not invent inconsistent messages.

## Dependencies And External Docs

- Do not add dependencies without a strong task-driven reason.
- Do not swap major tools or frameworks without an explicit migration request.
- Use Context7 before making decisions that depend on current library, framework, SDK, API, CLI, or cloud-service behavior.
- Do not send secrets or credentials to documentation tools.

## Comments And Generated Code

- Add or update JSDoc for reusable or contract-level code whenever you create or change it: exported functions, methods, hooks, utilities, constants, enums, DTOs, entities, shared response/read-model contracts, and public types/interfaces.
- Keep JSDoc immediately above the declaration it documents. Describe what the API is for, important invariants, side effects, error behavior, units, serialization details, or domain meaning that the type signature alone does not explain.
- Use plain comments inside implementations only for non-obvious intent, constraints, or tradeoffs.
- Write comments and JSDoc in English.
- Do not add JSDoc to every page-local callback, trivial event handler, or self-explanatory private variable. Prefer better names when a comment would only repeat the code.
- Remove commented-out placeholder code before finishing.
- Replace generated scaffold behavior before exposing it as real functionality.

## Testing And Verification

- Add or update tests when changing service logic, validation, contracts, persistence relations, user-visible workflows, or non-trivial frontend behavior.
- Generated existence tests are not enough for implemented behavior.
- Run the narrowest useful package checks first.
- Run both API and web verification when changes affect shared contracts or package boundaries.
- State any verification that could not be run and why.

## Review Checklist

- Does the change match nearby patterns?
- Is the package boundary respected?
- Are shared contracts exported and imported through the intended public path?
- Is new abstraction justified by real reuse or complexity?
- Are JSDoc comments present and current for reusable/exported code and shared contracts?
- Are comments useful and not restating obvious code?
- Are tests and verification proportional to the risk?
