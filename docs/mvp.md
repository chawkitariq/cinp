# Coding Assessment Platform — MVP Portfolio

## Vision du produit

Construire une plateforme qui permet à un recruteur de :

1. Créer des exercices techniques.
2. Créer une évaluation.
3. Inviter un candidat.
4. Faire passer un test chronométré.
5. Corriger automatiquement le code.
6. Consulter les résultats.

Le produit n'est pas un clone de LeetCode.

Le produit est un **outil d'aide à la décision de recrutement**.

---

# Personas

## Recruiter

Objectif :

> Trouver rapidement les meilleurs candidats.

Actions :

* créer des problèmes
* créer des évaluations
* inviter des candidats
* consulter les résultats

---

## Candidate

Objectif :

> Démontrer ses compétences techniques.

Actions :

* accéder à une évaluation
* résoudre des problèmes
* soumettre du code
* voir son score

---

# Workflow complet

```text
Recruiter Login
        ↓
Create Problem
        ↓
Create Assessment
        ↓
Invite Candidate
        ↓
Generate Assessment Session
        ↓
Candidate Opens Link
        ↓
Start Assessment
        ↓
Solve Problems
        ↓
Submit Code
        ↓
Automatic Evaluation
        ↓
Score Generated
        ↓
Recruiter Reviews Results
```

---

# Stack Technique

## Monorepo

```text
pnpm workspace
```

---

## Frontend

```text
Next.js
React
TypeScript
shadcn/ui
TanStack Query
React Hook Form
Zod
```

---

## Backend

```text
NestJS
TypeScript
Prisma
PostgreSQL
Redis
BullMQ
JWT
```

---

## Infrastructure

```text
Docker
Docker Compose
AWS
Terraform
```

---

# Architecture Monorepo

```text
coding-assessment-platform/

apps/
├── web
└── api

packages/
├── database
├── shared
├── eslint-config
└── tsconfig

infra/
├── docker
└── terraform

docker-compose.yml
pnpm-workspace.yaml
```

---

# Entités métier

## User

Représente :

```text
Recruiter
Candidate
```

---

## Problem

Représente :

```text
Une question technique
```

Exemple :

```text
Two Sum
Valid Parentheses
Number of Islands
```

---

## TestCase

Représente :

```text
Un cas de test servant à vérifier la solution
```

Exemple :

```json
{
  "input": [2,7,11,15],
  "target": 9,
  "expectedOutput": [0,1]
}
```

---

## Assessment

Représente :

```text
Un test complet
```

Exemple :

```text
Backend Engineer Assessment

Duration: 90 min
Questions: 4
```

---

## AssessmentProblem

Table de liaison.

Permet :

```text
Assessment A
  ↔
Problem B
```

Un problème peut appartenir à plusieurs évaluations.

---

## AssessmentSession

Représente :

```text
Une tentative d'un candidat
```

Exemple :

```text
Assessment:
Backend Assessment

Candidate:
Chawki

Status:
IN_PROGRESS
```

---

## Submission

Représente :

```text
Une réponse soumise pour un problème
```

Exemple :

```text
Problem:
Two Sum

Code:
...

Score:
100%
```

---

# Schéma relationnel

```text
User
│
├── Assessments
└── AssessmentSessions

Assessment
│
├── AssessmentProblems
└── AssessmentSessions

Problem
│
├── TestCases
└── Submissions

AssessmentSession
│
└── Submissions
```

---

# Pages Frontend

## Auth

```text
/login
/register
```

---

## Recruiter

```text
/dashboard

/problems
/problems/new

/assessments
/assessments/new
/assessments/:id
```

---

## Candidate

```text
/assessment/:token

/session/:id

/results/:sessionId
```

---

# Fonctionnalités MVP

## Auth

* Register
* Login
* JWT

---

## Problems

* Create Problem
* Edit Problem
* List Problems

---

## Test Cases

* Add Test Cases
* Edit Test Cases

---

## Assessments

* Create Assessment
* Add Problems
* Define Duration

---

## Invitations

* Generate Token
* Generate Candidate Link

---

## Candidate Session

* Start Assessment
* Timer
* Navigate Problems

---

## Code Editor

* TypeScript uniquement

---

## Submission

* Submit Code
* Save Submission

---

## Evaluation

* Run Test Cases
* Compute Score

---

## Results

Recruiter voit :

```text
Candidate
Score
Time Used
Status
```

---

# Redis

Redis n'est pas utilisé comme base de données.

Il sert aux jobs d'évaluation.

Workflow :

```text
Submit
↓
Create Submission
↓
BullMQ Job
↓
Redis Queue
↓
Worker
↓
Evaluation
↓
Update Submission
```

---

# Docker Compose Local

Services :

```text
web
api
postgres
redis
```

Commande :

```bash
docker compose up
```

---

# AWS (V1 Portfolio)

## Déploiement

```text
Frontend → Vercel
Backend → ECS Fargate
Database → RDS PostgreSQL
Redis → ElastiCache
```

---

# Terraform

Terraform doit gérer :

```text
ECR
ECS

RDS

ElastiCache

Load Balancer
```

---
