# AGENTS.md

Instructions pour les agents qui travaillent sur ce dépôt `cinp`.

## Project Snapshot

- `cinp` est un monorepo `pnpm` pour une plateforme MVP de coding assessment.
- La source de vérité technique est le code actuel, pas les promesses du plan produit.
- Objectif produit: créer des problèmes, composer des évaluations, inviter des candidats, lancer des sessions chronométrées, recevoir des soumissions, calculer les résultats.
- Les skills locaux du dépôt vivent dans `.agents/skills/`.
- Skills utiles à connaître: `api-coding-practices`, `web-coding-practices`, `web-api-error-policy`, `git-conventions`, `test-nestjs-api`, `test-react-components`.

## Repo Layout

- `docs/mvp.md`: vision produit et cible long terme.
- `packages/api`: API réelle, NestJS 11 + TypeORM + PostgreSQL.
- `packages/web`: frontend réel, Next.js App Router + React 19 + Tailwind CSS v4 + shadcn/ui.
- `docker-compose.yaml`: PostgreSQL local.
- `pnpm-workspace.yaml`: workspace défini sur `packages/*`.

## Setup And Verification

- Installer les dépendances avec `pnpm install`.
- Démarrer PostgreSQL local avec `docker compose up db`.
- Lancer l’API avec `pnpm --filter api start:dev`.
- Lancer le web avec `pnpm --filter web dev`.
- Vérifier l’API avec `pnpm --filter api build`, `pnpm --filter api test`, `pnpm --filter api test -- --runInBand`, `pnpm --filter api test:e2e`, `pnpm --filter api lint`.
- Vérifier le web avec `pnpm --filter web build` et `pnpm --filter web lint`.
- Quand la base, les relations TypeORM ou un flux HTTP complet changent, préférer `pnpm --filter api test:e2e` si PostgreSQL est disponible.

## Database And Environment

- Variables lues par `packages/api/src/database/datasource.ts`:

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

- `DB_SYNCHRONIZE=true` reste acceptable uniquement en développement local.
- Préférer les migrations pour une évolution durable du schéma.
- Ne pas remplacer TypeORM par Prisma sans demande explicite et plan de migration.

## API Architecture

- Zone: `packages/api`.
- Stack: NestJS 11, TypeScript, TypeORM, PostgreSQL, `class-validator`, `class-transformer`, Jest.
- Garder un module NestJS par domaine sous `packages/api/src/<domain>`.
- Conserver la structure `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/`, `*.spec.ts`.
- Garder les controllers fins: routing, pipes, DTO body, puis appel service.
- Garder la logique applicative, la persistence et les exceptions NestJS dans les services.
- Utiliser `@Param('id', ParseUUIDPipe)` pour les ids HTTP UUID.
- Créer avec `repository.create(dto)` puis `repository.save(entity)`.
- Lire avec `find()` ou `findOne({ where: { id } })`.
- Mettre à jour avec `repository.preload({ id, ...dto })`, puis `save`.
- Supprimer avec `repository.delete(id)` et retourner `{ deleted: true }` si succès.
- Ne pas laisser de méthodes scaffoldées qui renvoient des strings d’erreur.
- Exporter les DTO, enums, entités et contrats consommés par le web via `packages/api/src/index.ts`.
- Domaine actuel: `user`, `problem`, `assessment`, `assessment-session`, `submission`.
- `assessment` gère des problèmes ordonnés via `AssessmentProblem` et accepte `problemIds` en création et mise à jour.
- Le service `assessment` synchronise la table `assessment_problems` et maintient l’ordre fourni.

## DTOs And Entities

- Toutes les créations passent par un `Create*Dto`.
- Les updates utilisent `PartialType(Create*Dto)`.
- Ajouter des décorateurs `class-validator` sur les champs entrants.
- Utiliser `@IsUUID()` pour les ids dans les DTO.
- Ne pas exposer inutilement timestamps, `deletedAt` ou détails de persistance.
- Tables TypeORM en pluriel snake_case.
- IDs principaux en UUID avec `@PrimaryGeneratedColumn('uuid')`.
- Colonnes DB en snake_case, propriétés TS en camelCase.
- Timestamps en `timestamptz`.
- Utiliser des enums string exportés pour statuts et catégories.
- `@Unique([...])` pour l’unicité métier (`email`, `slug`, `token`).
- Les callbacks inverses de relations pointent vers la propriété de relation, pas vers l’id.
- Les entités de liaison comme `AssessmentProblem` utilisent des `ManyToOne` vers les deux côtés et une clé primaire composite.

## Web Architecture

- Zone: `packages/web`.
- Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, Radix UI, lucide-react.
- Utiliser `packages/web/app` pour les routes App Router.
- Utiliser l’alias `@/*` configuré dans `packages/web/tsconfig.json`.
- Réutiliser `components/ui` et `lib/utils.ts` avant d’ajouter des helpers.
- Préférer `lucide-react` pour les icônes.
- Garder les composants accessibles, responsives et sans layout shift évident.
- Respecter les tokens shadcn et Tailwind v4 dans `app/globals.css`.
- Éviter les refontes globales non demandées.
- Pour les écrans métier, construire l’expérience utile directement, pas une page marketing générique.
- `packages/web/app/page.tsx` reste proche du template Next.js et peut être remplacé quand la vraie home produit arrive.

## Web API Error Policy

- Garder les messages UI dans `packages/web/utils/api-error.ts`.
- Les loaders `GET` qui affichent des états inline peuvent renvoyer un `result` union `{ ok: true, ... } | { ok: false, message }`.
- Les loaders de ressource unique doivent utiliser `notFound()` pour un `404` quand la route doit afficher une vraie page introuvable.
- Les mutations doivent `throw new Error(serviceUnavailableMessage)` sur erreur réseau.
- Les mutations doivent `throw new Error(getApiErrorMessage(response))` si `response.ok` est faux.
- Les formulaires doivent catcher localement les erreurs de mutation et afficher un message de soumission.
- Utiliser `error.tsx` seulement quand le segment Next doit gérer les exceptions non prévues.
- Utiliser `not-found.tsx` seulement quand le segment Next doit porter l’UI 404.
- Préférer un `fetch` inline cohérent dans chaque helper plutôt qu’un wrapper mutation partagé, sauf demande explicite.

## Testing And Docs

- Ajouter ou adapter des tests quand la logique de service API, la validation DTO, les exceptions métier, les relations TypeORM, le comportement HTTP visible ou les flux frontend non triviaux changent.
- Les tests générés `should be defined` ne suffisent pas pour couvrir une logique réelle.
- Pour l’e2e API, vérifier que les pipes globaux correspondent à `main.ts` quand le test dépend de la validation runtime.
- Si une vérification utile n’a pas pu être lancée, l’indiquer clairement dans la réponse finale.

## Security And Workflow

- Ne jamais écrire de secrets dans le code, les docs, les requêtes Context7 ou les logs.
- Ne pas committer de `.env` contenant des credentials.
- Ne pas désactiver la validation globale NestJS.
- Ne pas accepter d’entités TypeORM directement comme body HTTP; utiliser des DTO.
- Ne pas exécuter de commandes destructives (`git reset --hard`, suppression de changements utilisateur, etc.) sans demande explicite.
- Avant une modification importante, exécuter `git status --short`.
- Ne jamais écraser ni reformater largement des changements non liés.
- Garder les commits atomiques.
- Utiliser Conventional Commits en anglais.
- Scopes utiles: `packages/api`, `packages/web`, `docs`, `docker`, `skills`.
- Avant un commit, lire `.agents/skills/git-conventions/SKILL.md` et, si besoin, sa référence.

