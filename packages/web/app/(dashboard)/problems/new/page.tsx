import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { ProblemForm } from "@/components/problems/problem-form";
import { Button } from "@/components/ui/button";

/**
 * Page for creating a new reusable coding problem.
 */
export default function NewProblemPage() {
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Button asChild className="w-fit" variant="ghost">
          <Link href="/problems">
            <ArrowLeftIcon data-icon="inline-start" />
            Retour aux problemes
          </Link>
        </Button>

        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Bibliotheque
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Nouveau probleme
          </h1>
          <p className="text-muted-foreground">
            Cree un exercice reutilisable pour tes evaluations techniques.
          </p>
        </header>

        <ProblemForm mode="create" />
      </div>
    </main>
  );
}
