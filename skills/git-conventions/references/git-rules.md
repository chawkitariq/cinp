# Git Rules

## Observed Repository Baseline

Recent commits follow Conventional Commits:

```text
feat(packages/api): global setup
chore: make api-coding-practices skill
feat(packages/api): update entities
style(packages/api): lint fix
feat(packages/api): setup entities
feat(packages/api): setup submission module
feat(packages/api): setup assessment-session module
feat(packages/api): setup assessment module
feat(packages/api): setup problem module
feat(packages/api): setup user module
docs: add /docs
chore: setup docker compose db service
build: install packages/web deps
build: install packages/api deps
```

Current main branch name observed: `master`.

## Commit Message Format

Use:

```text
<type>(<scope>): <subject>
```

or, for repository-wide work:

```text
<type>: <subject>
```

Rules:

- Use one line for simple commits.
- Add a body only when the why, migration note, or risk is not obvious from the diff.
- Keep subject concise, imperative, and lower-case after the colon.
- Do not end the subject with a period.
- Prefer English in commit messages, matching repository history.

## Commit Types

- `feat`: new user-visible capability, module, endpoint, entity, skill, or workflow.
- `fix`: bug fix or behavioral correction.
- `refactor`: internal code restructuring without intended behavior change.
- `style`: formatting, lint-only, naming-only, or non-behavioral style cleanup.
- `test`: tests only or test infrastructure.
- `docs`: documentation only.
- `build`: dependency, package manager, build tooling, package scripts.
- `chore`: maintenance, generated assets, repo housekeeping, skills, config that is not build-specific.
- `ci`: CI pipeline configuration.
- `revert`: revert a previous commit.

## Scopes

Prefer scopes that match repository paths:

- `packages/api`
- `packages/web`
- `docs`
- `docker`
- `skills`

Use no scope for root-wide or cross-cutting changes when one scope would be misleading.

Examples:

```text
feat(packages/api): add submission service persistence
fix(packages/api): parse route ids as uuids
style(packages/api): format generated controllers
test(packages/api): mock typeorm repositories
chore(skills): add git conventions skill
docs: document local setup
build(packages/web): install frontend dependencies
```

## Branch Naming

Use:

```text
<type>/<short-kebab-description>
```

Optionally include the area:

```text
<type>/<area>-<short-kebab-description>
```

Recommended types:

- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `chore`
- `build`

Rules:

- Use lowercase kebab-case.
- Keep names short and descriptive.
- Avoid spaces, underscores, uppercase, and vague names.
- Do not create or switch branches when the worktree has unrelated user changes unless the user asks or the move is safe.

Examples:

```text
feat/api-validation
fix/api-uuid-params
chore/git-conventions-skill
docs/project-setup
```

## Atomic Commit Guidance

Before committing:

1. Run `git status --short`.
2. Review staged files with `git diff --cached --stat`.
3. Inspect staged content with `git diff --cached`.
4. Confirm all staged changes belong to the same logical change.
5. Keep unrelated user changes unstaged.

Split commits when a diff mixes:

- feature code and unrelated formatting;
- source changes and skill/documentation updates;
- dependency changes and behavioral code;
- tests for one area and implementation in another unrelated area.

## Verification Before Commit

Match checks to the touched area.

For `packages/api` code:

```bash
npm run build
npm test -- --runInBand
npx eslint "src/**/*.ts"
```

For e2e/API DB changes:

```bash
npm run test:e2e
```

Note: e2e may require PostgreSQL local access and can be blocked by sandboxing.

For skills:

```bash
python3 /home/verbq/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/<skill-name>
```

## Pull Request Titles

Use the same convention as commits:

```text
feat(packages/api): add validated CRUD services
chore(skills): add git conventions skill
```

PR descriptions should include:

- summary of changed behavior;
- verification performed;
- migration or DB notes when relevant.

## Commit Message Review Checklist

- Does the type match the dominant change?
- Is the scope accurate and not overly broad?
- Is the subject specific enough to understand later from `git log --oneline`?
- Is it lowercase, imperative, and no trailing period?
- Does the staged diff match the message?
- Are generated or unrelated files excluded unless intentionally part of the change?
