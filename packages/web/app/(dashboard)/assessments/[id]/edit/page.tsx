import Link from "next/link";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";

import { AssessmentForm } from "@/components/assessments/assessment-form";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getAssessment } from "@/api/assessments";

/**
 * Always render fresh assessment edit data from the local API.
 */
export const dynamic = "force-dynamic";

/**
 * Page for editing an existing recruiter assessment.
 */
export default async function EditAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAssessment(id);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <Button asChild className="w-fit" variant="ghost">
          <Link href={`/assessments/${assessment.id}`}>
            <ArrowLeftIcon data-icon="inline-start" />
            Retour a l evaluation
          </Link>
        </Button>

        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Bibliotheque
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Modifier {assessment.title}
          </h1>
          <p className="text-muted-foreground">
            Mets a jour le cadrage, la duree et le statut de cette evaluation.
          </p>
        </header>

        <AssessmentForm assessment={assessment} mode="edit" />
      </div>
    </main>
  );
}
