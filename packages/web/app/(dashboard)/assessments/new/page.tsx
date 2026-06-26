import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { AssessmentForm } from "@/components/assessments/assessment-form";
import { Button } from "@/components/ui/button";
import { getProblems } from "@/api/problems";

/**
 * Always render fresh assessment creation data from the local API.
 */
export const dynamic = "force-dynamic";

/**
 * Page for creating a new recruiter assessment.
 *
 * @returns The assessment creation screen.
 */
export default async function NewAssessmentPage() {
  const result = await getProblems();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Button asChild className="w-fit" variant="ghost">
          <Link href="/assessments">
            <ArrowLeftIcon data-icon="inline-start" />
            Retour aux evaluations
          </Link>
        </Button>

        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Bibliotheque
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Nouvelle evaluation
          </h1>
          <p className="text-muted-foreground">
            Cree un parcours de recrutement chronometre a partir de tes
            problemes existants.
          </p>
        </header>

        <AssessmentForm
          availableProblems={result.ok ? result.problems : []}
          mode="create"
          problemsErrorMessage={result.ok ? null : result.message}
        />
      </div>
    </main>
  );
}
