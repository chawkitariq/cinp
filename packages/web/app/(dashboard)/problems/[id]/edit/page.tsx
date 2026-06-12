import Link from "next/link";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";

import { ProblemForm } from "@/components/problems/problem-form";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getProblem } from "@/data/problems";

/**
 * Always render fresh problem edit data from the local API.
 */
export const dynamic = "force-dynamic";

/**
 * Page for editing an existing reusable coding problem.
 */
export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProblem(id);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Button asChild className="w-fit" variant="ghost">
          <Link href={`/problems/${problem.id}`}>
            <ArrowLeftIcon data-icon="inline-start" />
            Retour au probleme
          </Link>
        </Button>

        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Bibliotheque
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Modifier {problem.title}
          </h1>
          <p className="text-muted-foreground">
            Mets a jour l&apos;enonce, les exemples et le starter code de cet
            exercice.
          </p>
        </header>

        <ProblemForm mode="edit" problem={problem} />
      </div>
    </main>
  );
}
