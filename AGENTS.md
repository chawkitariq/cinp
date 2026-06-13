# AGENTS.md

Instructions pour les agents de coding travaillant sur ce dépôt. Ce fichier suit le format ouvert AGENTS.md: Markdown standard, consignes concrètes, commandes de setup/test, conventions de code, sécurité et workflow.

## Project Overview

`cinp` est un monorepo `pnpm` pour une plateforme MVP de coding assessment dédiée au recrutement.

Objectif produit:

- créer des problèmes techniques;
- composer des évaluations;
- inviter des candidats;
- démarrer des sessions chronométrées;
- recevoir des soumissions de code;
- calculer et consulter les résultats.

Sources de contexte:

- `docs/mvp.md`: vision produit et cible long terme.
- `packages/api`: API réelle actuelle, NestJS + TypeORM + PostgreSQL.
- `packages/web`: app réelle actuelle, Next.js + React + Tailwind CSS + shadcn/ui.
- `skills`: règles locales utiles pour l'API et Git.

Important: `docs/mvp.md` mentionne aussi Prisma, Redis, BullMQ, TanStack Query, React Hook Form et Zod. Ne les présume pas disponibles. L'état actuel du code prime pour les changements techniques immédiats; le MVP guide la direction produit.

## Repository Layout

```text
.
├── docs/
│   └── mvp.md
├── packages/
│   ├── api/
│   └── web/
├── skills/
│   ├── api-coding-practices/
│   └── git-conventions/
├── docker-compose.yaml
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

Notes:

- Les packages du workspace sont définis par `packages/*`.
- Le script `test` racine échoue volontairement; lance les commandes depuis les packages ou avec `pnpm --filter`.
- La branche principale observée est `master`.

## Setup Commands

Installer les dépendances:

```bash
pnpm install
```

Démarrer PostgreSQL local:

```bash
docker compose up db
```

API en développement:

```bash
pnpm --filter api start:dev
```

Web en développement:

```bash
pnpm --filter web dev
```

## Build And Test Commands

API:

```bash
pnpm --filter api build
pnpm --filter api test
pnpm --filter api test -- --runInBand
pnpm --filter api test:e2e
pnpm --filter api lint
```

Web:

```bash
pnpm --filter web build
pnpm --filter web lint
```

Depuis un package, les équivalents courts fonctionnent aussi:

```bash
pnpm build
pnpm test
pnpm lint
```

Choix de vérification:

- Changement API: `pnpm --filter api build`, tests ciblés ou `pnpm --filter api test -- --runInBand`, puis lint si pertinent.
- Changement Web: `pnpm --filter web build` ou `pnpm --filter web lint`; ajoute une vérification visuelle pour l'UI.
- Changement DB, relation TypeORM ou flux HTTP complet: ajoute `pnpm --filter api test:e2e` si l'environnement PostgreSQL est disponible.
- Documentation seule: pas de test requis, mais relis le Markdown modifié.

## Database And Environment

PostgreSQL local dans `docker-compose.yaml`:

- host: `localhost`
- port: `5432`
- user: `cinp`
- password: `cinp`
- database: `cinp`

Variables lues par `packages/api/src/database/datasource.ts`:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=cinp
DB_PASSWORD=cinp
DB_DATABASE=cinp
DB_SYNCHRONIZE=true
DB_LOGGING=false
DB_SSL=false
PORT=3000
```

Règles:

- `DB_SYNCHRONIZE=true` est acceptable seulement en développement local.
- Ne pas remplacer TypeORM par Prisma sans demande explicite et plan de migration.
- Préférer des migrations pour une évolution de schéma durable.

## External Documentation

Quand une demande porte sur une librairie, un framework, un SDK, une API, un outil CLI ou un service cloud, utilise Context7 avant de répondre ou de modifier du code dépendant de cette API.

Workflow:

```bash
npx ctx7@latest library <nom-officiel> "<question complète de l'utilisateur>"
npx ctx7@latest docs <libraryId> "<question complète de l'utilisateur>"
```

Règles:

- Toujours lancer `library` avant `docs`, sauf si l'utilisateur fournit déjà un ID `/org/project`.
- Utiliser le nom officiel: `Next.js`, `NestJS`, `TypeORM`, `Tailwind CSS`, etc.
- Ne pas faire plus de 3 commandes Context7 pour une question.
- Ne jamais inclure de secret dans une requête Context7.
- Si Context7 échoue par quota, informer l'utilisateur et suggérer `npx ctx7@latest login` ou `CONTEXT7_API_KEY`.
- Si Context7 échoue par DNS/réseau dans le sandbox, relancer hors sandbox.

Ne pas utiliser Context7 pour logique métier, refactoring général, revue de code ou scripts sans dépendance spécifique.

## Backend Code Style

Zone: `packages/api`.

Stack actuelle:

- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL
- `class-validator` / `class-transformer`
- Jest

Règles d'architecture:

- Un module NestJS par domaine sous `packages/api/src/<domain>`.
- Structure attendue: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/`, tests `*.spec.ts`.
- `AppModule` compose les modules; ne pas y mettre de logique métier.
- `DatabaseModule` garde la configuration TypeORM racine.
- Controllers fins: routing, pipes, DTO body, appel service.
- Services responsables de la logique applicative, persistence et exceptions NestJS.

Domaines actuels:

- `user`
- `problem`
- `assessment`
- `assessment-session`
- `submission`

Controllers:

- Routes de ressources au pluriel: `users`, `problems`, `assessments`, `assessment-sessions`, `submissions`.
- IDs HTTP en UUID: utiliser `@Param('id', ParseUUIDPipe)`.
- Retourner les résultats du service sauf transformation volontaire.

Services:

- Injecter les repositories via `@InjectRepository(Entity)` et `Repository<Entity>`.
- Créer avec `repository.create(dto)` puis `repository.save(entity)`.
- Lire avec `find()` ou `findOne({ where: { id } })`.
- Mettre à jour avec `repository.preload({ id, ...dto })`, puis `save`.
- Supprimer avec `repository.delete(id)` et retourner `{ deleted: true }` si succès.
- Lever `NotFoundException`, `BadRequestException`, `ConflictException`, etc.; ne pas retourner de strings d'erreur.
- Ne pas laisser de méthodes scaffoldées exposées qui retournent `"This action..."`.

DTO et validation:

- Le `ValidationPipe` global dans `main.ts` utilise `whitelist`, `forbidNonWhitelisted` et `transform`.
- Toutes les créations passent par un `Create*Dto`.
- Les updates utilisent `PartialType(Create*Dto)`.
- Ajouter des décorateurs `class-validator` sur les champs entrants.
- Utiliser `@IsUUID()` pour les ids dans les DTO.
- Ne pas exposer inutilement timestamps, `deletedAt` ou détails de persistance.

Entités TypeORM:

- Tables en pluriel snake_case: `@Entity({ name: 'problems' })`.
- IDs principaux en UUID: `@PrimaryGeneratedColumn('uuid')`.
- Colonnes DB en snake_case avec propriétés TS en camelCase.
- Timestamps en `timestamptz`.
- Enums string exportés pour statuts et catégories.
- `@Unique([...])` pour l'unicité métier (`email`, `slug`, `token`).
- Aligner optionalité TypeScript et nullabilité DB.
- Les callbacks inverses de relations pointent vers la propriété de relation, pas vers l'id.
- Les entités de liaison comme `AssessmentProblem` utilisent des `ManyToOne` vers les deux côtés et des clés primaires composites.

Avant de modifier l'API, lis:

- `skills/api-coding-practices/SKILL.md`
- `skills/api-coding-practices/references/api-rules.md` si tu touches entités, relations, DTO, services ou tests.

## Frontend Code Style

Zone: `packages/web`.

Stack actuelle:

- Next.js 16 App Router
- React 19
- TypeScript strict
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- lucide-react

Règles:

- Utiliser `packages/web/app` pour les routes App Router.
- Utiliser l'alias `@/*` configuré dans `packages/web/tsconfig.json`.
- Réutiliser `components/ui` et `lib/utils.ts` avant d'ajouter des helpers.
- Préférer `lucide-react` pour les icônes.
- Garder les composants accessibles, responsives et sans layout shift évident.
- Respecter les tokens shadcn et Tailwind v4 dans `app/globals.css`.
- Éviter les refontes globales non demandées.
- Pour les écrans métier, construire l'expérience utile directement, pas une page marketing générique.

Note: `packages/web/app/page.tsx` est encore proche du template Next.js. Il peut être remplacé lors de la première vraie page produit.

## Testing Instructions

Ajoute ou adapte des tests quand tu modifies:

- logique de service API;
- validation DTO;
- exceptions métier;
- relations TypeORM;
- comportement HTTP visible;
- composants ou flux frontend non triviaux.

Les tests générés `should be defined` ne suffisent pas pour couvrir une logique réelle.

Pour l'e2e API, vérifier que les pipes globaux correspondent à `main.ts` quand le test dépend de la validation runtime.

Si une vérification utile n'a pas pu être lancée, indique pourquoi dans la réponse finale.

## Security Considerations

- Ne jamais écrire de secrets dans le code, les docs, les requêtes Context7 ou les logs.
- Ne pas committer de `.env` contenant des credentials.
- Ne pas désactiver la validation globale NestJS.
- Ne pas accepter d'entités TypeORM directement comme body HTTP; utiliser des DTO.
- Ne pas exécuter de commandes destructives (`git reset --hard`, suppression de changements utilisateur, etc.) sans demande explicite.
- Ne pas introduire auth/JWT, Redis ou BullMQ seulement parce que le MVP les mentionne; les ajouter uniquement quand la tâche le demande.

## Git And PR Instructions

Avant toute modification importante:

```bash
git status --short
```

Règles:

- Ne jamais écraser ni reformater largement des changements non liés.
- Garder les commits atomiques.
- Utiliser Conventional Commits en anglais.
- Scopes utiles: `packages/api`, `packages/web`, `docs`, `docker`, `skills`.

Exemples:

```text
feat(packages/api): add submission persistence
fix(packages/api): parse route ids as uuids
docs: document local setup
chore(skills): add api coding practices
```

Avant un commit, lis:

- `skills/git-conventions/SKILL.md`
- `skills/git-conventions/references/git-rules.md` si tu écris un message, nommes une branche, prépares une PR ou répartis des changements.

## Agent Workflow

Pour chaque tâche:

1. Lire les fichiers voisins avant d'éditer.
2. Identifier le pattern existant.
3. Faire le plus petit changement cohérent.
4. Mettre à jour tests/docs si le comportement change.
5. Lancer les vérifications adaptées.
6. Résumer les changements et vérifications.

Préférences:

- Respecter les patterns existants avant d'inventer une abstraction.
- Ne pas mélanger refactor cosmétique et feature métier.
- Ne pas ajouter de dépendance sans raison forte.
- Ne pas changer d'outil majeur sans demande explicite.
- Ne pas corriger des zones non liées à la tâche sauf si c'est indispensable.

## Final Response Checklist

Dans la réponse finale, indiquer brièvement:

- ce qui a changé;
- les fichiers principaux touchés;
- les vérifications lancées et leur résultat;
- les limites ou suites utiles, seulement si elles comptent vraiment.

Rester concret. L'utilisateur partage le même workspace, donc ne pas lui demander de copier des fichiers.
