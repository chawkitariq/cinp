import Link from "next/link";
import type { ComponentProps } from "react";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  Code2Icon,
  EditIcon,
  PlusIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getProblems } from "@/api/problems";
import { formatDate } from "@/utils/date";
import { Difficulty } from "@cinp/api";

/**
 * Always render fresh problem data from the local API.
 */
export const dynamic = "force-dynamic";

/**
 * French display labels for API difficulty values.
 */
const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: "Facile",
  [Difficulty.MEDIUM]: "Intermediaire",
  [Difficulty.HARD]: "Difficile",
};

/**
 * Badge variants mapped to each difficulty level.
 */
const difficultyVariants: Record<
  Difficulty,
  ComponentProps<typeof Badge>["variant"]
> = {
  [Difficulty.EASY]: "secondary",
  [Difficulty.MEDIUM]: "outline",
  [Difficulty.HARD]: "destructive",
};

/**
 * Truncates long problem descriptions for problem cards.
 *
 * @param description The raw problem description.
 * @returns A shortened preview suitable for a card.
 */
function getShortDescription(description: string) {
  if (description.length <= 170) {
    return description;
  }

  return `${description.slice(0, 167).trim()}...`;
}

/**
 * Server-rendered problem library page.
 *
 * @returns The problem library screen.
 */
export default async function ProblemsPage() {
  const result = await getProblems();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Bibliotheque
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Problemes techniques
            </h1>
            <p className="text-muted-foreground">
              Parcours les exercices disponibles pour composer des evaluations
              techniques adaptees a tes candidats.
            </p>
          </div>
          <Button asChild>
            <Link href="/problems/new">
              <PlusIcon data-icon="inline-start" />
              Nouveau probleme
            </Link>
          </Button>
        </header>

        {!result.ok ? (
          <Empty className="rounded-xl border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircleIcon />
              </EmptyMedia>
              <EmptyTitle>Problemes indisponibles</EmptyTitle>
              <EmptyDescription>{result.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : result.problems.length === 0 ? (
          <Empty className="rounded-xl border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Code2Icon />
              </EmptyMedia>
              <EmptyTitle>Aucun probleme pour le moment</EmptyTitle>
              <EmptyDescription>
                Cree un premier exercice pour commencer a construire tes
                assessments.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/problems/new">
                  <PlusIcon data-icon="inline-start" />
                  Nouveau probleme
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.problems.map((problem) => (
              <Card key={problem.id} className="min-h-full">
                <CardHeader>
                  <CardTitle>{problem.title}</CardTitle>
                  <CardDescription>/{problem.slug}</CardDescription>
                  <CardAction>
                    <Badge variant={difficultyVariants[problem.difficulty]}>
                      {difficultyLabels[problem.difficulty]}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {getShortDescription(problem.description)}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">
                      {problem.examples?.length ?? 0} exemples
                    </Badge>
                    {problem.constraints ? (
                      <Badge variant="outline">Contraintes</Badge>
                    ) : null}
                    {problem.starterCode ? (
                      <Badge variant="outline">Starter code</Badge>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Ajoute le {formatDate(problem.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/problems/${problem.id}/edit`}>
                        <EditIcon data-icon="inline-start" />
                        Modifier
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/problems/${problem.id}`}>
                        Voir
                        <ArrowRightIcon data-icon="inline-end" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
