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
2. Review unstaged and staged files to understand whether unrelated work is already present.
3. Stage intentionally:
   - prefer `git add path/to/file` or `git add path/to/dir`;
   - avoid `git add .` when the worktree contains unrelated changes.
4. Review staged files with `git diff --cached --stat`.
5. Inspect staged content with `git diff --cached`.
6. Confirm all staged changes belong to the same logical change.
7. Keep unrelated user changes unstaged.

Split commits when a diff mixes:

- feature code and unrelated formatting;
- source changes and skill/documentation updates;
- dependency changes and behavioral code;
- tests for one area and implementation in another unrelated area.

## Executing Git Commands

When the user asks the agent to create a commit, the agent should perform the Git workflow directly instead of only proposing a commit message.

Preferred sequence:

1. Inspect `git status --short`.
2. Decide which files belong to the requested logical change.
3. Stage only those files.
4. Review the staged diff.
5. Run the relevant verification for the touched area when practical.
6. Create the commit with an explicit Conventional Commit message.
7. Report the commit result and verification status back to the user.

Command guidance:

- Prefer targeted staging:

```bash
git add path/to/file
git add path/to/dir
```

- Create commits non-interactively:

```bash
git commit -m "feat(packages/web): add problem creation page"
```

- Re-check the result after committing:

```bash
git status --short
git log -1 --oneline
```

Safety rules:

- Do not stage unrelated user changes just to make the worktree clean.
- Do not use destructive commands such as `git reset --hard`, `git checkout --`, or history-rewriting operations unless the user explicitly requests them.
- Do not amend an existing commit unless the user explicitly asks for an amend.
- If the requested commit would mix unrelated changes and the split cannot be inferred safely, pause and ask the user which files should be included.

## Verification Before Commit

Match checks to the touched area.

For `packages/api` code:

```bash
pnpm --filter api build
pnpm --filter api test -- --runInBand
pnpm --filter api lint
```

For e2e/API DB changes:

```bash
pnpm --filter api test:e2e
```

Note: e2e may require PostgreSQL local access and can be blocked by sandboxing.

For `packages/web` code:

```bash
pnpm --filter web lint
pnpm --filter web build
```

Use `lint` as the default check; add `build` when the change affects routes, shared contracts, client/server boundaries, or framework configuration.

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
