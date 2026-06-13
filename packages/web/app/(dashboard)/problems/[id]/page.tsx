import Link from "next/link";
import type { ComponentProps } from "react";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  EditIcon,
  FileCode2Icon,
} from "lucide-react";

import { DeleteProblemButton } from "@/components/problems/delete-problem-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { getProblem } from "@/api/problems";
import { formatDate } from "@/utils/date";
import { Difficulty } from "@cinp/api";

/**
 * Always render fresh problem detail data from the local API.
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
 * Server-rendered detail page for a single problem.
 */
export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProblem(id);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <Button asChild className="w-fit" variant="ghost">
            <Link href="/problems">
              <ArrowLeftIcon data-icon="inline-start" />
              Retour aux problemes
            </Link>
          </Button>
          <Empty className="rounded-xl border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircleIcon />
              </EmptyMedia>
              <EmptyTitle>Probleme indisponible</EmptyTitle>
              <EmptyDescription>{result.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </main>
    );
  }

  const { problem } = result;

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Button asChild className="w-fit" variant="ghost">
          <Link href="/problems">
            <ArrowLeftIcon data-icon="inline-start" />
            Retour aux problemes
          </Link>
        </Button>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                /{problem.slug}
              </p>
              <Badge variant={difficultyVariants[problem.difficulty]}>
                {difficultyLabels[problem.difficulty]}
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {problem.title}
            </h1>
            <p className="text-muted-foreground">
              Cree le {formatDate(problem.createdAt)}. Derniere mise a jour le{" "}
              {formatDate(problem.updatedAt)}.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button asChild>
              <Link href={`/problems/${problem.id}/edit`}>
                <EditIcon data-icon="inline-start" />
                Modifier
              </Link>
            </Button>
            <DeleteProblemButton problemId={problem.id} />
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Enonce</CardTitle>
            <CardDescription>
              Description visible par les candidats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
              {problem.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exemples</CardTitle>
            <CardDescription>
              Cas fournis pour clarifier les entrees et sorties attendues.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {problem.examples?.length ? (
              problem.examples.map((example, index) => (
                <div className="flex flex-col gap-3" key={index}>
                  {index > 0 ? <Separator /> : null}
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                    <code>{JSON.stringify(example, null, 2)}</code>
                  </pre>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun exemple renseigne.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contraintes</CardTitle>
          </CardHeader>
          <CardContent>
            {problem.constraints ? (
              <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
                {problem.constraints}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune contrainte renseignee.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Starter code</CardTitle>
            <CardAction>
              <FileCode2Icon />
            </CardAction>
          </CardHeader>
          <CardContent>
            {problem.starterCode ? (
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                <code>{problem.starterCode}</code>
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun starter code renseigne.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
