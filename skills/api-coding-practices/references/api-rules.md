# packages/api Rules

Use these rules as the detailed reference for `skills/api-coding-practices/SKILL.md`. Prefer the smallest coherent change that matches the existing module and repository patterns.

## Architecture

- Use one NestJS module per domain under `packages/api/src/<domain>`.
- Keep `AppModule` as composition only: import domain modules and infrastructure modules.
- Use `DatabaseModule` for TypeORM root configuration.
- Keep controllers as HTTP adapters: decorators, params, body DTOs, and service calls only.
- Keep services as the application boundary for validation beyond DTO shape, repository calls, domain rules, and Nest exceptions.

## Controllers

- Use route names consistently with the domain. Existing routes are singular (`user`, `problem`, `assessment`, `submission`, `assessment-session`); preserve unless deliberately migrating all routes.
- Parse route ids explicitly. Prefer Nest pipes such as `ParseUUIDPipe` for UUID ids instead of `+id`, because entities use UUID primary keys.
- Return service results directly unless a response shape transformation is required.

## DTOs And Validation

- Every create endpoint must use a non-empty `Create*Dto`.
- Every update endpoint should use `PartialType(Create*Dto)`.
- Use `class-validator` decorators for body validation.
- Add or preserve a global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform` when validation is being wired.
- Keep DTOs as API contracts; do not expose persistence-only fields such as `deletedAt` or computed timestamps unless explicitly required.

## Shared API Contracts For Web

- Treat `packages/api` as the owner of API entities, DTOs, enums, and response/read-model types.
- Expose web-consumed contracts from `packages/api/src/index.ts`; `packages/api/package.json` should publish the public type entry through `types` and `exports`.
- Add `@cinp/api` to `packages/web/package.json` with `workspace:*` when web needs API contracts.
- In web code, import from the package boundary:

```ts
import type { Difficulty, Problem } from '@cinp/api';
```

- Prefer `import type` in `packages/web` so Next.js does not bundle server-side NestJS/TypeORM code through shared contracts.
- Do not import from `packages/api/src/...`, `packages/api/dist/...`, or relative paths crossing from web into api.
- Do not rewrite API shapes in web (`type Problem = ...`, duplicate DTOs, duplicate enums). If the current API export is not the right browser/HTTP shape, add a named exported contract in `packages/api` and use that from web.
- The current public API surface is intentionally small. If web needs more than the existing exports, add the missing contract explicitly in `packages/api/src/index.ts` instead of reaching into internal files.
- Remember that HTTP JSON can differ from the TypeORM entity shape, especially `Date` fields serialized as strings. Model that difference in an exported API response type instead of patching it locally in web.
- After changing shared exports, build API before validating web: `pnpm --filter api build`, then `pnpm --filter web build`.

## Services And Repositories

- Import `TypeOrmModule.forFeature([Entity])` in each module whose service needs repositories.
- Inject repositories with `@InjectRepository(Entity)` and `Repository<Entity>`.
- Replace scaffolded string-returning service methods with real implementations before exposing behavior.
- Throw Nest exceptions (`NotFoundException`, `BadRequestException`, `ConflictException`, etc.) instead of returning error strings.
- Keep persistence logic in services unless a dedicated domain helper is introduced by an established local pattern.

## TypeORM Entities

- Use `@Entity({ name: '<plural_snake_case>' })`.
- Use UUID primary keys for main entities: `@PrimaryGeneratedColumn('uuid')`.
- Use `@CreateDateColumn`, `@UpdateDateColumn`, and `@DeleteDateColumn` where lifecycle tracking is needed.
- Use `@Unique([...])` for business uniqueness such as email or slug.
- Use `@Column({ name: 'snake_case' })` when the TypeScript property is camelCase.
- Align optional properties with DB nullability:
  - `field?: T` should usually have `nullable: true`;
  - required DB columns should not use `?`.
- Prefer explicit column types for JSON, timestamps, long text, and enum columns.
- Prefer exported string enums:
  - good: `export enum Difficulty { EASY = 'easy' }`;
  - avoid numeric enums for DB/API-facing values.

## Relations

- Choose cardinality from the database relationship, not from the property name.
- A row carrying a foreign key usually has `@ManyToOne` to the referenced entity.
- A parent collection usually has `@OneToMany` back to the child relation property.
- Join entities such as `AssessmentProblem` should usually have `ManyToOne` relations to both sides, not `OneToMany`.
- Inverse callbacks should reference relation properties, not ids:
  - good: `(submission) => submission.problem`;
  - suspicious: `(problem) => problem.id`.
- Keep FK scalar columns (`problemId`) and relation properties (`problem`) consistent. Use `@JoinColumn({ name: 'problem_id' })` when mapping an explicit FK column.
- Avoid commented-out relation stubs in committed entity files.

## Database Configuration

- Keep env-driven DB config centralized in `src/database`.
- Validate required DB environment variables before startup when adding config hardening.
- Keep `DB_SYNCHRONIZE=true` for local development only; do not rely on it for production schema changes.
- Prefer migrations for durable schema evolution.
- Avoid unsafe non-null assertions on env values when a validation layer can fail early with a clear message.
- Do not introduce Prisma or replace TypeORM unless the task explicitly requests a migration plan.

## Tests

- Generated `should be defined` tests are not enough for implemented behavior.
- For service logic, test success paths, not-found cases, validation/business failures, unique constraints, and important relations.
- For controllers, mock services and verify param/body forwarding plus relevant pipes or exceptions.
- For e2e tests, initialize the same global pipes used in `main.ts` so tests match runtime behavior.

## Verification

Run checks with the current workspace commands:

```bash
pnpm --filter api build
pnpm --filter api test -- --runInBand
pnpm --filter api lint
```

Add `pnpm --filter api test:e2e` when the change touches DB wiring, TypeORM relations, or end-to-end HTTP behavior and PostgreSQL is available.
