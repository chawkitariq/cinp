# cinp

MVP coding assessment platform for technical recruiting.

The project lets recruiters build a problem library, compose assessments, invite
candidates, track their sessions, and review submissions.

## Prerequisites

- Node.js
- pnpm 11.x
- Docker and Docker Compose

## Installation

```bash
cp -n packages/api/.env.example packages/api/.env
cp -n packages/web/.env.example packages/web/.env
```

```bash
docker compose up
```

Expected services:

- API : `http://localhost:3000`
- Web : `http://localhost:3001`

## Product Model

The MVP targets two workflows:

- recruiter: create problems, compose assessments, invite candidates, and review
  results;
- candidate: open an invitation link, take a timed session, submit code, and get
  a result.
