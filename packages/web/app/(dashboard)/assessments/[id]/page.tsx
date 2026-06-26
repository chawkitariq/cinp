import Link from "next/link";
import type { ComponentProps } from "react";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  EditIcon,
  FileTextIcon,
} from "lucide-react";

import { DeleteAssessmentButton } from "@/components/assessments/delete-assessment-button";
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
import { getAssessment } from "@/api/assessments";
import { formatDate } from "@/utils/date";
import { AssessmentStatus } from "@cinp/api";

/**
 * Always render fresh assessment detail data from the local API.
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
 * Server-rendered detail page for a single assessment.
 *
 * @param params Route params resolved by the App Router.
 * @returns The assessment detail screen, or an empty state when the API lookup fails.
 */
export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAssessment(id);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <Button asChild className="w-fit" variant="ghost">
            <Link href="/assessments">
              <ArrowLeftIcon data-icon="inline-start" />
              Retour aux evaluations
            </Link>
          </Button>
          <Empty className="rounded-xl border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircleIcon />
              </EmptyMedia>
              <EmptyTitle>Evaluation indisponible</EmptyTitle>
              <EmptyDescription>{result.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </main>
    );
  }

  const { assessment } = result;

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Button asChild className="w-fit" variant="ghost">
          <Link href="/assessments">
            <ArrowLeftIcon data-icon="inline-start" />
            Retour aux evaluations
          </Link>
        </Button>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                {assessment.durationMin} min
              </p>
              <Badge variant={statusVariants[assessment.status]}>
                {statusLabels[assessment.status]}
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {assessment.title}
            </h1>
            <p className="text-muted-foreground">
              Creee le {formatDate(assessment.createdAt)}. Derniere mise a jour
              le {formatDate(assessment.updatedAt)}.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button asChild>
              <Link href={`/assessments/${assessment.id}/edit`}>
                <EditIcon data-icon="inline-start" />
                Modifier
              </Link>
            </Button>
            <DeleteAssessmentButton assessmentId={assessment.id} />
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
            <CardDescription>
              Cadre central visible par l equipe de recrutement.
            </CardDescription>
            <CardAction>
              <FileTextIcon />
            </CardAction>
          </CardHeader>
          <CardContent>
            {assessment.description ? (
              <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
                {assessment.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune description renseignee.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parametres</CardTitle>
            <CardDescription>
              Informations de planification et de publication.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Duree {assessment.durationMin} min</Badge>
              <Badge variant="outline">
                {statusLabels[assessment.status]}
              </Badge>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Utilise cette evaluation pour organiser une session candidate
              apres avoir assemble tes problemes.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
