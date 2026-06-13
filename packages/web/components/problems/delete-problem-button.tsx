"use client";

import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/customs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { deleteProblem as deleteProblemById } from "@/api/problems";

/**
 * Client action button that confirms and deletes a problem by UUID.
 */
export function DeleteProblemButton({ problemId }: { problemId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteProblem() {
    const confirmed = await ConfirmDialog.call({
      title: "Supprimer ce probleme ?",
      description: "Cette action est definitive.",
      confirmLabel: "Supprimer",
    });

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await deleteProblemById(problemId);
      router.push("/problems");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de joindre l'API. Verifie que le serveur NestJS est lance.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <Button
        disabled={isDeleting}
        onClick={deleteProblem}
        type="button"
        variant="destructive"
      >
        {isDeleting ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <Trash2Icon data-icon="inline-start" />
        )}
        Supprimer
      </Button>
      {error ? (
        <p className="max-w-sm text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
