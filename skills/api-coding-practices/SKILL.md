---
name: api-coding-practices
description: Project-specific coding standards for packages/api, a NestJS + TypeORM PostgreSQL API in a pnpm monorepo, including shared API contracts consumed by packages/web through @cinp/api. Use with project-coding-practices when creating, modifying, reviewing, or refactoring files under packages/api; implementing controllers, services, modules, DTOs, entities, tests, database config, validation, TypeORM relations, or public entity/DTO/type exports used by the web app; or checking API code against the current repository rules.
---

# API Coding Practices

## Purpose

Apply the coding rules established by the current repository state. Treat these rules as the local API conventions unless a newer file in the repository clearly establishes a different pattern.

## Workflow

1. Inspect the relevant `packages/api/src/<domain>` files before editing.
2. Apply `skills/project-coding-practices` for repository-wide workflow, package-boundary, shared-contract, and verification defaults.
3. Keep the NestJS domain structure: `controller`, `service`, `module`, `dto`, `entities`, and colocated `*.spec.ts` tests.
4. Keep controllers thin. Route, parse, and delegate; put business logic, persistence, and application errors in services.
5. Use DTOs for all request bodies. Add `class-validator` decorators and keep `Update*Dto extends PartialType(Create*Dto)`.
6. Add or update JSDoc for DTOs, exported enums, entities, service methods with reusable business behavior, and public contracts consumed by `packages/web`.
7. Use TypeORM repositories through `TypeOrmModule.forFeature([Entity])` and constructor injection in services.
8. Preserve DB naming conventions: plural table names, DB `snake_case`, TypeScript `camelCase`, and UUID identifiers.
9. Verify TypeORM relation cardinality and inverse sides before adding or changing relations.
10. Align TypeScript optionality with DB nullability.
11. Run focused verification with the current monorepo commands, usually `pnpm --filter api build`, `pnpm --filter api test -- --runInBand`, and `pnpm --filter api lint` when practical.

## Load Detailed Rules

Read `references/api-rules.md` when:

- adding or changing TypeORM entities or relations;
- implementing CRUD/service behavior;
- adding DTO validation;
- changing exports consumed by `packages/web`;
- reviewing code under `packages/api`;
- deciding whether scaffolded NestJS code is acceptable.

Also read `../project-coding-practices/references/common-rules.md` when the API change affects `@cinp/api` exports, web imports, package boundaries, or repository-wide organization.

## Strong Defaults

- Do not leave generated placeholder service methods returning strings.
- Do not put business logic in controllers.
- Do not accept entities directly as request bodies.
- Do not point TypeORM inverse relation callbacks at `.id` fields; point them at relation properties.
- Do not assume the MVP document means Prisma, Redis, BullMQ, TanStack Query, or other tools are already part of the live stack.
- Prefer exported string enums for API/DB-facing statuses and categories.
- Treat `synchronize=true` as development-only.
- Keep JSDoc current on reusable API surfaces; remove commented-out placeholder relations.
