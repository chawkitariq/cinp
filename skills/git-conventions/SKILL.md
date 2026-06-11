---
name: git-conventions
description: Project-specific Git conventions for this repository. Use when creating or reviewing branch names, commit messages, staged changes, commit plans, pull request titles, release notes, or any workflow involving git status, git diff, git log, or .git/COMMIT_EDITMSG. Enforce the repository's Conventional Commit style, scopes such as packages/api and packages/web, branch naming, atomic commits, and pre-commit verification.
---

# Git Conventions

## Purpose

Apply the Git conventions inferred from this repository's history. Prefer these rules unless a tracked project document or hook introduces a newer explicit standard.

## Workflow

1. Inspect `git status --short` before proposing commits or branches.
2. Inspect the staged diff with `git diff --cached --stat` and `git diff --cached` before writing a commit message.
3. Keep commits atomic: one coherent change per commit.
4. Use Conventional Commits with optional scope.
5. Prefer scopes that match the touched project area, especially `packages/api`, `packages/web`, `docs`, `docker`, or `skills`.
6. Keep the subject lowercase after the type/scope unless a proper noun requires capitalization.
7. Keep the subject imperative, concise, and under 72 characters when practical.
8. Run relevant verification before committing when code changed.
9. Never amend, reset, rebase, force-push, or discard user changes unless explicitly requested.

## Load Detailed Rules

Read `references/git-rules.md` when:

- naming a branch;
- writing or reviewing a commit message;
- splitting a diff into commits;
- preparing a pull request title or description;
- checking whether staged changes match the intended commit;
- editing `.git/COMMIT_EDITMSG`.

## Strong Defaults

- Main branch is currently `master`; do not rename it casually.
- Commit format: `<type>(<scope>): <subject>` or `<type>: <subject>`.
- Good example: `feat(packages/api): setup database module`.
- Good example: `chore: make api-coding-practices skill`.
- Avoid vague subjects such as `update`, `fix stuff`, or `wip`.
- Mention verification performed in the final response, not necessarily in the commit subject.
