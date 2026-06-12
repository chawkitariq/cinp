---
name: api-coding-practices
description: Project-specific coding standards for packages/api, a NestJS + TypeORM PostgreSQL API in a pnpm monorepo, including shared API contracts consumed by packages/web through @cinp/api. Use when creating, modifying, reviewing, or refactoring files under packages/api; implementing controllers, services, modules, DTOs, entities, tests, database config, validation, TypeORM relations, or public entity/DTO/type exports used by the web app; or checking API code against the current repository rules.
---

# API Coding Practices

## Purpose

Apply the coding rules established by the current repository state. Treat these rules as the local API conventions unless a newer file in the repository clearly establishes a different pattern.

## Workflow

1. Inspect the relevant `packages/api/src/<domain>` files before editing.
2. Keep the NestJS domain structure: `controller`, `service`, `module`, `dto`, `entities`, and colocated `*.spec.ts` tests.
3. Keep controllers thin. Route, parse, and delegate; put business logic, persistence, and application errors in services.
4. Use DTOs for all request bodies. Add `class-validator` decorators and keep `Update*Dto extends PartialType(Create*Dto)`.
5. Use TypeORM repositories through `TypeOrmModule.forFeature([Entity])` and constructor injection in services.
6. Preserve DB naming conventions: plural table names, DB `snake_case`, TypeScript `camelCase`, and UUID identifiers.
7. Verify TypeORM relation cardinality and inverse sides before adding or changing relations.
8. Align TypeScript optionality with DB nullability.
9. Add or update behavior tests when implementing real service logic.
10. When `packages/web` needs API shapes, export them from `packages/api/src/index.ts` and import them in web from `@cinp/api`; do not rewrite API DTO/entity/type shapes in web.
11. Use Context7 first when the task depends on current NestJS, TypeORM, class-validator, or other library-specific behavior that may have changed.
12. Run focused verification with the current monorepo commands, usually `pnpm --filter api build`, `pnpm --filter api test -- --runInBand`, and `pnpm --filter api lint` when practical.

## Load Detailed Rules

Read `references/api-rules.md` when:

- adding or changing TypeORM entities or relations;
- implementing CRUD/service behavior;
- adding DTO validation;
- changing exports consumed by `packages/web`;
- reviewing code under `packages/api`;
- deciding whether scaffolded NestJS code is acceptable.

## Strong Defaults

- Do not leave generated placeholder service methods returning strings.
- Do not put business logic in controllers.
- Do not accept entities directly as request bodies.
- Do not point TypeORM inverse relation callbacks at `.id` fields; point them at relation properties.
- Do not duplicate API entities, DTOs, enums, or response types in `packages/web`; import shared contracts from `@cinp/api`.
- Do not import API contracts in web from `packages/api/src/...` or `packages/api/dist/...`; use the package boundary only.
- Do not assume the MVP document means Prisma, Redis, BullMQ, TanStack Query, or other tools are already part of the live stack.
- Prefer exported string enums for API/DB-facing statuses and categories.
- Treat `synchronize=true` as development-only.
- Keep comments rare and useful; remove commented-out placeholder relations.
