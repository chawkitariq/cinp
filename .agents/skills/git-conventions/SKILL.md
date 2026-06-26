---
name: git-conventions
description: Project-specific Git conventions for this repository. Use when creating or reviewing branch names, commit messages, staged changes, commit plans, pull request titles, release notes, or any workflow involving git status, git diff, git add, git commit, git log, or .git/COMMIT_EDITMSG. Enforce the repository's Conventional Commit style, scopes such as packages/api and packages/web, branch naming, atomic commits, pre-commit verification, and safe execution of git commands when the user wants the agent to prepare or create commits.
---

# Git Conventions

## Purpose

Apply the Git conventions inferred from this repository's history. Prefer these rules unless a tracked project document or hook introduces a newer explicit standard.

## Workflow

1. Inspect `git status --short` before proposing commits or branches.
2. Inspect the staged diff with `git diff --cached --stat` and `git diff --cached` before writing a commit message.
3. Keep commits atomic: one coherent change per commit.
4. When the user asks to commit, stage only the files that belong to the intended logical change; avoid sweeping in unrelated worktree changes.
5. Use Conventional Commits with optional scope.
6. Prefer scopes that match the touched project area, especially `packages/api`, `packages/web`, `docs`, `docker`, or `skills`.
7. Keep the subject lowercase after the type/scope unless a proper noun requires capitalization.
8. Keep the subject imperative, concise, and under 72 characters when practical.
9. Run relevant verification before committing when code changed.
10. Execute `git add` and `git commit` directly when the user wants the agent to create the commit and the staged content is well understood.
11. Never amend, reset, rebase, force-push, or discard user changes unless explicitly requested.

## Scripts

Use the bundled scripts in `scripts/` when you need a deterministic wrapper for
the standard Git checks or commit flow:

- `scripts/git-status-short.sh`
- `scripts/git-staged-diff-stat.sh`
- `scripts/git-staged-diff.sh`
- `scripts/git-add.sh`
- `scripts/git-commit.sh`
- `scripts/git-log-latest.sh`

Prefer these scripts for the common workflow steps documented below when you
want a repeatable command entrypoint instead of typing the raw Git command.

## Load Detailed Rules

Read `references/git-rules.md` when:

- naming a branch;
- writing or reviewing a commit message;
- splitting a diff into commits;
- deciding which files to stage or leave unstaged;
- executing `git add` or `git commit` on the user's behalf;
- preparing a pull request title or description;
- checking whether staged changes match the intended commit;
- editing `.git/COMMIT_EDITMSG`.

## Strong Defaults

- Main branch is currently `master`; do not rename it casually.
- Commit format: `<type>(<scope>): <subject>` or `<type>: <subject>`.
- Good example: `feat(packages/api): setup database module`.
- Good example: `chore: make api-coding-practices skill`.
- Avoid vague subjects such as `update`, `fix stuff`, or `wip`.
- Prefer explicit staging such as `git add path/to/file` over `git add .` when unrelated changes exist.
- If the user asks for a commit, the agent should perform the commit instead of stopping at a suggested message.
- Mention verification performed in the final response, not necessarily in the commit subject.
