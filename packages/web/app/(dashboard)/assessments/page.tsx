import Link from "next/link";
import type { ComponentProps } from "react";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  FileTextIcon,
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
import { getAssessments } from "@/api/assessments";
import { formatDate } from "@/utils/date";
import { AssessmentStatus } from "@cinp/api";

/**
 * Always render fresh assessment data from the local API.
 */
export const dynamic = "force-dynamic";

/**
 * French display labels for API assessment statuses.
 */
const statusLabels: Record<AssessmentStatus, string> = {
  [AssessmentStatus.DRAFT]: "Brouillon",
  [AssessmentStatus.ACTIVE]: "Active",
  [AssessmentStatus.CLOSED]: "Fermee",
};

/**
 * Badge variants mapped to each assessment status.
 */
const statusVariants: Record<
  AssessmentStatus,
  ComponentProps<typeof Badge>["variant"]
> = {
  [AssessmentStatus.DRAFT]: "outline",
  [AssessmentStatus.ACTIVE]: "default",
  [AssessmentStatus.CLOSED]: "destructive",
};

/**
 * Truncates long assessment descriptions for assessment cards.
 *
 * @param description The raw assessment description.
 * @returns A shortened preview suitable for a card.
 */
function getShortDescription(description: string) {
  if (description.length <= 170) {
    return description;
  }

  return `${description.slice(0, 167).trim()}...`;
}

/**
 * Server-rendered assessment library page.
 *
 * @returns The assessment library screen.
 */
export default async function AssessmentsPage() {
  const result = await getAssessments();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Bibliotheque
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Evaluations
            </h1>
            <p className="text-muted-foreground">
              Compose des evaluations techniques a partir de tes problemes pour
              inviter des candidats.
            </p>
          </div>
          <Button asChild>
            <Link href="/assessments/new">
              <PlusIcon data-icon="inline-start" />
              Nouvelle evaluation
            </Link>
          </Button>
        </header>

        {!result.ok ? (
          <Empty className="rounded-xl border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircleIcon />
              </EmptyMedia>
              <EmptyTitle>Evaluations indisponibles</EmptyTitle>
              <EmptyDescription>{result.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : result.assessments.length === 0 ? (
          <Empty className="rounded-xl border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon />
              </EmptyMedia>
              <EmptyTitle>Aucune evaluation pour le moment</EmptyTitle>
              <EmptyDescription>
                Cree une premiere evaluation pour structurer un parcours de
                recrutement.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/assessments/new">
                  <PlusIcon data-icon="inline-start" />
                  Nouvelle evaluation
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.assessments.map((assessment) => (
              <Card key={assessment.id} className="min-h-full">
                <CardHeader>
                  <CardTitle>{assessment.title}</CardTitle>
                  <CardDescription>
                    {assessment.durationMin} min
                  </CardDescription>
                  <CardAction>
                    <Badge variant={statusVariants[assessment.status]}>
                      {statusLabels[assessment.status]}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {assessment.description
                      ? getShortDescription(assessment.description)
                      : "Aucune description renseignee."}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">
                      Duree {assessment.durationMin} min
                    </Badge>
                    <Badge variant="outline">
                      {statusLabels[assessment.status]}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Creee le {formatDate(assessment.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/assessments/${assessment.id}/edit`}>
                        <EditIcon data-icon="inline-start" />
                        Modifier
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/assessments/${assessment.id}`}>
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
