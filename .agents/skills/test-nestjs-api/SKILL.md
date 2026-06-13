---
name: test-nestjs-api
description: Add or improve Jest tests for the NestJS API in packages/api. Use when Codex needs to test NestJS controllers, services, guards, decorators, DTO validation, TypeORM repository interactions, auth behavior, exceptions, or e2e HTTP flows with TestingModule and Supertest in the cinp API package.
---

# Test NestJS API

## Overview

Use this workflow to add meaningful tests in `packages/api`. Prefer behavior-focused tests over scaffold checks, and match the existing NestJS + TypeORM + Jest setup.

## Workflow

1. Read the target domain files first: controller, service, DTOs, entities, module, and existing `*.spec.ts`.
2. Use Context7 for current NestJS, Jest, TypeORM, or Supertest API details when changing library-specific test setup or patterns.
3. Pick the smallest useful test level:
   - service unit tests for business logic, persistence calls, exceptions, and transformations;
   - controller unit tests for routing-layer delegation and return contracts;
   - guard/decorator unit tests for request metadata and `ExecutionContext` behavior;
   - e2e tests for HTTP-visible behavior, global pipes, guards, serialization, and module wiring.
4. Keep tests colocated under `packages/api/src/<domain>/*.spec.ts`; keep e2e tests under `packages/api/test/*.e2e-spec.ts`.
5. Replace generated `should be defined` tests with behavior tests when touching that area.

## Unit Test Rules

- Use `Test.createTestingModule()` when Nest dependency injection matters. Directly instantiate classes only for isolated guards, decorators, or pure utilities where DI adds no value.
- Mock repositories with `getRepositoryToken(Entity)` and typed `jest.Mocked<Pick<Repository<Entity>, ...>>`.
- Mock only the methods used by the unit under test: `create`, `findOne`, `find`, `save`, `preload`, `delete`, etc.
- Assert both outcomes and collaborator calls. For example, verify normalized inputs, `where` clauses, payloads sent to `save`, and calls to `JwtService.signAsync`.
- Test failure paths with `await expect(...).rejects.toBeInstanceOf(...)` for Nest exceptions such as `NotFoundException`, `ConflictException`, `UnauthorizedException`, and `BadRequestException`.
- Avoid testing TypeORM itself. Test that the service uses repositories correctly and handles returned values.
- Prefer realistic entity instances with `Object.assign(new Entity(), data)` when serialization, class-transformer behavior, or entity methods matter.

## Controllers

Keep controller tests thin, just like controllers:

- provide a mocked service with every method the controller calls;
- call controller methods directly;
- assert that DTOs and route IDs are delegated unchanged;
- assert the returned value is the service result;
- leave validation pipe behavior to e2e tests unless testing a custom pipe.

Example pattern:

```ts
const service = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

const module = await Test.createTestingModule({
  controllers: [ProblemController],
  providers: [{ provide: ProblemService, useValue: service }],
}).compile()
```

## Services

Service tests should cover the business contract:

- successful create/read/update/delete behavior;
- not-found behavior for missing entities;
- conflict or validation-related business errors;
- relation lookups and TypeORM `preload` behavior when present;
- security-sensitive behavior such as password hashing and token payloads.

Use typed mocks:

```ts
let repository: jest.Mocked<Pick<Repository<User>, "create" | "findOne" | "save">>

repository = {
  create: jest.fn((user: Partial<User>) => Object.assign(new User(), user)),
  findOne: jest.fn(),
  save: jest.fn(),
}
```

## Guards And Decorators

- Build a minimal `ExecutionContext` object with only the methods the unit reads.
- Assert request mutation when a guard attaches `request.user`.
- Cover public route bypass, missing credentials, invalid credentials, valid credentials, and stale user records.
- For decorators, use the existing Nest helper pattern in the repo and assert extracted request data, not implementation internals.

## E2E Tests

Use e2e tests when the behavior depends on Nest runtime wiring:

- global `ValidationPipe` behavior from `main.ts`;
- HTTP status codes and response bodies;
- guards/interceptors/serialization across modules;
- module imports and database integration.

Mirror the app bootstrap options used by `main.ts` when they affect the test:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
```

Close the app in `afterEach` or `afterAll`. If e2e requires PostgreSQL, make sure the local DB from `docker-compose.yaml` is available; otherwise report that the e2e check was not run.

## Verification

Prefer these commands from the repo root:

```bash
pnpm --filter api test -- --runInBand
pnpm --filter api test -- <path-or-pattern> --runInBand
pnpm --filter api test:e2e
pnpm --filter api build
pnpm --filter api lint
```

For narrow changes, run the targeted test first, then broader tests if the change touches shared behavior, auth, validation, TypeORM relations, or HTTP contracts.

If sandboxed `pnpm` fails with `unable to open database file`, rerun the same command with approval outside the sandbox.
