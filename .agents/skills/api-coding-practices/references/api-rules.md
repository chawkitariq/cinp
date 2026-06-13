# packages/api Rules

Use these rules as the detailed reference for `skills/api-coding-practices/SKILL.md`. Pair them with `skills/project-coding-practices/references/common-rules.md` for repository-wide workflow, package-boundary, shared-contract, and verification defaults.

## Architecture

- Use one NestJS module per domain under `packages/api/src/<domain>`.
- Keep `AppModule` as composition only: import domain modules and infrastructure modules.
- Use `DatabaseModule` for TypeORM root configuration.
- Keep controllers as HTTP adapters: decorators, params, body DTOs, and service calls only.
- Keep services as the application boundary for validation beyond DTO shape, repository calls, domain rules, and Nest exceptions.

## Controllers

- Use plural resource route names consistently with the domain: `users`, `problems`, `assessments`, `submissions`, and `assessment-sessions`.
- When adding or changing a resource endpoint, update frontend fetch callers to use the same plural path.
- Parse route ids explicitly. Prefer Nest pipes such as `ParseUUIDPipe` for UUID ids instead of `+id`, because entities use UUID primary keys.
- Return service results directly unless a response shape transformation is required.
- Do not assume Nest exception messages are safe UI copy. Keep frontend-visible error mapping in web helpers unless an explicit API response contract is designed for user-facing copy.

## DTOs And Validation

- Every create endpoint must use a non-empty `Create*Dto`.
- Every update endpoint should use `PartialType(Create*Dto)`.
- Use `class-validator` decorators for body validation.
- Add or preserve a global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform` when validation is being wired.
- Keep DTOs as API contracts; do not expose persistence-only fields such as `deletedAt` or computed timestamps unless explicitly required.
- Add class-level JSDoc to DTOs explaining the request or response contract they represent.
- Add property-level JSDoc when a field has domain meaning, units, accepted format, serialization detail, or a constraint not already obvious from its name, TypeScript type, and validators.

## Shared API Contracts For Web

- Follow `skills/project-coding-practices/references/common-rules.md` for ownership, package boundaries, and no-duplication rules.
- Ensure `packages/api/package.json` publishes the public type entry through `types` and `exports`.
- Add `@cinp/api` to `packages/web/package.json` with `workspace:*` when web needs API contracts.
- Treat `packages/api` as the source of truth for web request bodies and responses. When web sends data to an endpoint, export and reuse the endpoint DTO (`Create*Dto`, `Update*Dto`, etc.) instead of defining a web-local payload type.
- Export every web-consumed DTO, enum, entity, response interface, and read model from `packages/api/src/index.ts`; do not make web reach into API internals.
- Prefer `export type { ... }` for DTOs, entities, and server-backed classes. Use value exports only for runtime-safe contracts that web must use as values.
- Put web-consumed runtime enums in lightweight files such as `src/<domain>/enums/*.enum.ts`, then import them into entities/DTOs and export them publicly. Avoid defining runtime enums only inside TypeORM entity files when a client component needs the enum values.
- In web code, import from the package boundary:

```ts
import { Difficulty, type CreateProblemDto, type Problem } from '@cinp/api';
```

- Prefer `import type` in `packages/web` so Next.js does not bundle server-side NestJS/TypeORM code through shared contracts. Use regular imports only for lightweight runtime values exported intentionally for web, such as standalone enums.
- The current public API surface is intentionally small. If web needs more than the existing exports, add the missing contract explicitly in `packages/api/src/index.ts` instead of reaching into internal files.
- After changing shared exports, build API before validating web. If normal build is blocked by local `dist` permissions, use `pnpm --filter api exec tsc -p tsconfig.build.json --noEmit` as the API verification fallback, then run `pnpm --filter web build`.

## Services And Repositories

- Import `TypeOrmModule.forFeature([Entity])` in each module whose service needs repositories.
- Inject repositories with `@InjectRepository(Entity)` and `Repository<Entity>`.
- Replace scaffolded string-returning service methods with real implementations before exposing behavior.
- Throw Nest exceptions (`NotFoundException`, `BadRequestException`, `ConflictException`, etc.) instead of returning error strings.
- Keep persistence logic in services unless a dedicated domain helper is introduced by an established local pattern.
- Add JSDoc to service methods when they are reusable application operations, enforce non-obvious business rules, throw meaningful domain exceptions, or are called across controllers/domains. Keep simple CRUD pass-through methods documented only when they are part of a public contract that would otherwise be unclear.

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
- Add JSDoc to exported entities and enums. For entities, describe the domain object and important persistence invariants. For enums, describe the domain dimension; document individual members only when the literal value is not self-explanatory.

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
