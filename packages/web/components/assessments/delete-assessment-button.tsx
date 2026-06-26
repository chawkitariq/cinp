"use client";

import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/customs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { deleteAssessment as deleteAssessmentById } from "@/api/assessments";
import { genericUserErrorMessage } from "@/utils/api-error";

/**
 * Client action button that confirms and deletes an assessment by UUID.
 *
 * @param assessmentId The UUID of the assessment to delete.
 * @returns The destructive action button and its inline error state.
 */
export function DeleteAssessmentButton({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Opens the confirmation dialog, deletes the assessment, and redirects back.
   *
   * @returns A promise that resolves after the delete flow completes.
   * @throws {Error} Never throws; errors are captured and rendered inline.
   */
  async function deleteAssessment() {
    const confirmed = await ConfirmDialog.call({
      title: "Supprimer cette evaluation ?",
      description: "Cette action est definitive.",
      confirmLabel: "Supprimer",
    });

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await deleteAssessmentById(assessmentId);
      router.push("/assessments");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : genericUserErrorMessage);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <Button
        disabled={isDeleting}
        onClick={deleteAssessment}
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
