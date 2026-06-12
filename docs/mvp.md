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

Le MVP doit rester simple :

* le recruteur possède un compte;
* le candidat accède à une évaluation via un lien d'invitation unique;
* la correction automatique est déclenchée par les soumissions;
* les résultats servent à comparer et qualifier les candidats.

---

## État actuel vs cible

Ce document décrit la cible MVP et la direction produit.

L'implémentation actuelle du dépôt peut être plus simple que cette cible.
Par exemple, certains éléments comme l'évaluation automatique, les test cases,
les workers, Redis ou BullMQ peuvent être décrits ici sans être encore branchés
dans le code.

Règle de lecture :

```text
MVP.md = vision produit et architecture cible
Code actuel = vérité technique immédiate
```

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

Le candidat n'a pas besoin d'un espace utilisateur complet dans le MVP.

Il peut accéder au test avec un lien unique :

```text
/assessment/:token
```

Le token permet d'identifier :

* l'évaluation concernée;
* le candidat invité;
* la session associée;
* la validité du lien.

Cela évite d'ajouter trop tôt :

* mot de passe candidat;
* dashboard candidat;
* récupération de compte;
* gestion d'un profil candidat complet.

Le modèle recommandé pour le MVP :

```text
Recruiter = compte utilisateur complet
Candidate = identité légère + lien d'invitation + session
```

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

La stack ci-dessous correspond a la structure actuelle du projet.

Les choix techniques futurs doivent partir de cette base, pas d'une stack
theorique.

## Monorepo

```text
pnpm workspace
```

---

## Frontend

```text
Next.js App Router
React 19
TypeScript
Tailwind CSS v4
shadcn/ui
Radix UI
lucide-react
Monaco Editor
React Hook Form
Zod
```

Notes :

* le frontend vit dans `packages/web`;
* l'application utilise deja `react-hook-form` et `zod` pour certains formulaires;
* `TanStack Query` n'est pas installe aujourd'hui et ne doit pas etre presume.

---

## Backend

```text
NestJS 11
TypeScript
TypeORM
PostgreSQL
class-validator
class-transformer
```

Notes :

* l'API vit dans `packages/api`;
* la persistence actuelle repose sur TypeORM, pas Prisma;
* Redis, BullMQ et JWT ne font pas partie de la stack branchee actuellement;
* ils peuvent etre ajoutes plus tard si le besoin devient concret.

---

## Infrastructure

```text
Docker
Docker Compose
```

Notes :

* `docker-compose.yaml` permet deja de lancer `db`, `api` et `web`;
* PostgreSQL est l'infrastructure locale essentielle aujourd'hui;
* AWS, Terraform et Redis relevent pour l'instant d'une cible plus lointaine.

---

# Architecture Monorepo

```text
cinp/

docs/
├── mvp.md

packages/
├── api
└── web

skills/
├── api-coding-practices
└── git-conventions

docker-compose.yaml
pnpm-workspace.yaml
```

Principes :

* `packages/api` contient l'API NestJS reelle;
* `packages/web` contient l'application Next.js reelle;
* `docs/mvp.md` guide la direction produit;
* le code existant prime quand il faut faire un choix d'implementation.

---

# Entités métier

## User

Représente :

```text
Recruiter
```

Dans le MVP, `User` représente principalement le recruteur authentifié.

Le candidat n'est pas modélisé comme un compte utilisateur complet.

Son identité légère peut être portée directement par `AssessmentSession`, par
exemple avec :

* `candidateEmail`
* `candidateName`

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

Un problème contient typiquement :

* un titre;
* un slug;
* une difficulté;
* une description;
* des exemples;
* des contraintes;
* du starter code;
* un lien de propriété vers le recruteur qui l'a créé;
* des test cases associés.

À appréhender ainsi :

```text
description  = ce qu'il faut faire
examples     = démonstrations lisibles pour comprendre
constraints  = limites et règles du problème
test cases   = vérité utilisée par le système pour corriger
starter code = squelette donné au candidat
```

Les exemples et contraintes aident le candidat à comprendre le problème.
Ils ne suffisent pas à corriger automatiquement une solution.

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

Un test case est utilisé par l'évaluateur pour comparer :

```text
résultat obtenu par le code candidat
        ↓
résultat attendu par le problème
```

Contrairement aux exemples, les test cases ont une incidence directe sur le score.

Dans le modèle MVP retenu, `TestCase` appartient directement à un `Problem`.

Champs minimaux recommandés :

* `problemId`
* `input`
* `expectedOutput`
* `isPublic`
* `explanation` optionnelle

---

## Examples

Représente :

```text
Des cas visibles qui expliquent les entrées et sorties attendues
```

Exemple :

```json
[
  {
    "input": {
      "nums": [2, 7, 11, 15],
      "target": 9
    },
    "output": [0, 1],
    "explanation": "nums[0] + nums[1] = 9"
  }
]
```

Les exemples peuvent être stockés en JSON car leur structure est naturellement
composée : input, output, explication, voire plusieurs variantes.

Dans le MVP, ils sont surtout indicatifs et destinés à l'affichage.
Ils peuvent ressembler à des test cases, mais ils ne sont pas la source de vérité
de la correction.

---

## Constraints

Représente :

```text
Les limites et règles que la solution doit respecter
```

Exemple :

```text
2 <= nums.length <= 10_000
-1_000_000 <= nums[i] <= 1_000_000
Il existe exactement une solution valide
Tu ne peux pas utiliser deux fois le même élément
```

Les contraintes servent à comprendre :

* la taille des données;
* les cas limites;
* le niveau d'optimisation attendu;
* les règles à ne pas enfreindre.

Dans le MVP, elles sont principalement informatives.
Elles guident le candidat et le recruteur, mais ne calculent pas le score à elles
seules.

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

Dans le MVP retenu, `AssessmentSession` contient :

* le token d'accès;
* le lien vers l'assessment;
* l'état de la session;
* les dates utiles;
* le score total;
* les informations légères du candidat, sans compte dédié obligatoire.

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

Une soumission relie :

```text
AssessmentSession
        ↓
Problem
        ↓
Code candidat
        ↓
Résultat d'évaluation
```

Champs typiques :

* sessionId;
* problemId;
* language;
* code;
* status;
* score;
* passedTests;
* totalTests;
* runtimeMs;
* submittedAt.

Statuts possibles :

```text
pending  = soumission créée, pas encore évaluée
running  = évaluation en cours
passed   = tous les tests attendus passent
failed   = certains tests échouent
error    = erreur technique pendant l'évaluation
```

La soumission est la trace persistée de ce que le candidat a envoyé.
Elle ne devrait pas contenir toute la logique de correction.

---

## Evaluator

Représente :

```text
Le service qui corrige une soumission
```

Responsabilités :

* récupérer la soumission;
* récupérer le problème;
* récupérer les test cases du problème;
* exécuter le code candidat de façon isolée;
* comparer les résultats obtenus aux résultats attendus;
* calculer le score;
* mettre à jour la soumission.

Workflow :

```text
Submission créée
        ↓
status = pending
        ↓
Evaluator démarre
        ↓
status = running
        ↓
Code exécuté contre les test cases
        ↓
score calculé
        ↓
status = passed | failed | error
```

---

## Worker

Représente :

```text
Le processus qui exécute les évaluations en arrière-plan
```

Le worker ne définit pas la logique métier de correction.
Il prend une tâche dans une file et appelle l'evaluator.

Pourquoi utiliser un worker :

* éviter de bloquer la requête HTTP `POST /submission`;
* isoler l'exécution de code candidat;
* gérer les évaluations longues;
* pouvoir relancer ou superviser les jobs;
* préparer l'usage de Redis/BullMQ.

Flux cible :

```text
POST /submission
        ↓
Create Submission
        ↓
Add evaluation job
        ↓
Worker receives job
        ↓
Evaluator evaluates submission
        ↓
Submission updated
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

Le front sert deux parcours distincts :

```text
Recruiter = construit les tests et analyse les résultats
Candidate = reçoit un lien, résout les problèmes, soumet du code
```

## Auth

```text
/login
/register
```

Ces pages concernent principalement le recruteur dans le MVP.

---

## Recruiter

```text
/dashboard

/problems
/problems/new
/problems/:id
/problems/:id/edit

/assessments
/assessments/new
/assessments/:id

/results
/results/:sessionId
```

Pages recruteur :

* `/dashboard` : vue d'ensemble des évaluations, invitations et résultats récents.
* `/problems` : bibliothèque des exercices techniques.
* `/problems/new` : création d'un problème.
* `/problems/:id` : lecture d'un problème.
* `/problems/:id/edit` : modification d'un problème.
* `/assessments` : liste des évaluations.
* `/assessments/new` : création d'une évaluation avec durée et problèmes.
* `/assessments/:id` : détail, problèmes associés, invitations, sessions.
* `/results` : liste des résultats candidats.
* `/results/:sessionId` : détail d'une session candidat.

---

## Candidate

```text
/assessment/:token

/session/:id
/session/:id/problem/:problemId

/results/:sessionId
```

Pages candidat :

* `/assessment/:token` : page d'accès via lien d'invitation.
* `/session/:id` : interface de passage du test avec timer et éditeur.
* `/session/:id/problem/:problemId` : route optionnelle pour naviguer par problème.
* `/results/:sessionId` : résultat visible après l'évaluation, si le produit le permet.

---

# Fonctionnalités MVP

## Auth

* Register
* Login

L'authentification concerne d'abord le recruteur.
Le candidat accède au test par token d'invitation.

Pour le MVP :

* l'existence d'un flux d'auth recruteur est pertinente;
* le mecanisme exact n'a pas besoin d'etre fixe en JWT tout de suite si le code
  ne l'utilise pas encore;
* l'acces candidat doit rester sans compte complet.

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
* Access through invitation token

---

## Code Editor

* TypeScript uniquement

---

## Submission

* Submit Code
* Save Submission
* Track Status
* Track Score
* Track Passed Tests
* Track Runtime

---

## Evaluation

* Run Test Cases
* Compute Score
* Update Submission Status
* Store Evaluation Result

Le déclencheur naturel est la création d'une soumission.
La correction elle-même doit rester dans un service dédié, par exemple
`EvaluationService`, éventuellement appelé par un worker.

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

Redis n'est pas utilise comme base de donnees.

Dans la structure actuelle du projet, Redis n'est pas encore branche.

Si on l'ajoute plus tard, son role naturel sera de supporter une file de jobs
d'evaluation, par exemple avec BullMQ.

Workflow cible :

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

Redis est donc une option d'evolution, pas une dependance immediate du MVP.

---

# Docker Compose Local

Le fichier `docker-compose.yaml` peut lancer aujourd'hui :

```text
db
deps
api
web
```

Commande :

```bash
docker compose up
```

Pour un developpement plus minimal, PostgreSQL seul suffit souvent :

```bash
docker compose up db
```

---

# AWS (V1 Portfolio)

Cette section decrit une cible de deploiement possible, pas l'etat actuel du
depot.

## Déploiement cible

```text
Frontend → Vercel
Backend → ECS Fargate
Database → RDS PostgreSQL
Redis → ElastiCache
```

---

# Terraform

Terraform n'est pas present dans la structure actuelle du repo.

Si cette direction est retenue plus tard, Terraform pourrait gerer :

```text
ECR
ECS

RDS

ElastiCache

Load Balancer
```

---
