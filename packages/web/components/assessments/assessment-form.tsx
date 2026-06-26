"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createAssessment, updateAssessment } from "@/api/assessments";
import { genericUserErrorMessage } from "@/utils/api-error";
import { AssessmentStatus, type Assessment } from "@cinp/api";

/**
 * Accepted assessment statuses for the form and API payload.
 */
const statusValues = [
  AssessmentStatus.DRAFT,
  AssessmentStatus.ACTIVE,
  AssessmentStatus.CLOSED,
] as const;

/**
 * Client-side validation schema matching the assessment API.
 */
const assessmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caracteres."),
  description: z.string(),
  durationMin: z.coerce
    .number()
    .int("La duree doit etre un nombre entier.")
    .min(1, "La duree doit etre de 1 minute minimum."),
  status: z.enum(statusValues, {
    required_error: "Choisis un statut.",
  }),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

/**
 * Props contract for creating a new assessment or editing an existing one.
 */
type AssessmentFormProps =
  | {
      mode: "create";
      assessment?: never;
    }
  | {
      mode: "edit";
      assessment: Assessment;
    };

/**
 * Empty form state used for assessment creation.
 */
const emptyValues: AssessmentFormValues = {
  title: "",
  description: "",
  durationMin: 60,
  status: AssessmentStatus.DRAFT,
};

/**
 * Converts blank optional text fields to undefined for cleaner API payloads.
 *
 * @param value Raw textarea content.
 * @returns `undefined` when the field is blank, otherwise the trimmed value.
 */
function getOptionalString(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

/**
 * Maps an optional API assessment entity to editable form values.
 *
 * @param assessment The assessment entity to prefill, if any.
 * @returns The form values used by React Hook Form.
 */
function getDefaultValues(assessment?: Assessment): AssessmentFormValues {
  if (!assessment) {
    return emptyValues;
  }

  return {
    title: assessment.title,
    description: assessment.description ?? "",
    durationMin: assessment.durationMin,
    status: assessment.status as AssessmentFormValues["status"],
  };
}

/**
 * Builds the create/update payload expected by the assessment API.
 *
 * @param values Validated form values.
 * @returns The payload expected by the assessments endpoints.
 */
function getPayload(values: AssessmentFormValues) {
  return {
    title: values.title.trim(),
    description: getOptionalString(values.description),
    durationMin: values.durationMin,
    status: values.status,
  };
}

/**
 * Form used to create or edit recruiter assessments.
 *
 * @param mode Determines whether the form creates or edits an assessment.
 * @param assessment Existing assessment data when editing.
 * @returns The rendered assessment form.
 */
export function AssessmentForm({
  mode,
  assessment,
}: AssessmentFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: getDefaultValues(assessment),
  });

  /**
   * Submits the form and redirects to the saved assessment detail page.
   *
   * @param values Validated assessment form values.
   * @returns A promise that resolves once persistence and navigation complete.
   * @throws {Error} When the API call fails or returns a user-facing error.
   */
  async function onSubmit(values: AssessmentFormValues) {
    setSubmitError(null);

    try {
      const payload = getPayload(values);
      const savedAssessment = isEdit
        ? await updateAssessment(assessment.id, payload)
        : await createAssessment(payload);

      router.push(`/assessments/${savedAssessment.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : genericUserErrorMessage,
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details de cette evaluation</CardTitle>
        <CardDescription>
          Les champs obligatoires sont valides avant{" "}
          {isEdit ? "la sauvegarde" : "la creation"}.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-5">
          {submitError ? (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <FieldSet disabled={isSubmitting}>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.title)}>
                <FieldLabel htmlFor="title">Titre</FieldLabel>
                <Input
                  {...register("title")}
                  aria-invalid={Boolean(errors.title)}
                  id="title"
                  placeholder="Evaluation frontend"
                />
                <FieldError>{errors.title?.message}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.durationMin)}>
                <FieldLabel htmlFor="durationMin">Duree (minutes)</FieldLabel>
                <Input
                  {...register("durationMin")}
                  aria-invalid={Boolean(errors.durationMin)}
                  id="durationMin"
                  min={1}
                  type="number"
                />
                <FieldDescription>
                  Choisis la duree allouee au candidat pour terminer cette
                  evaluation.
                </FieldDescription>
                <FieldError>{errors.durationMin?.message}</FieldError>
              </Field>

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Field data-invalid={Boolean(errors.status)}>
                    <FieldLabel htmlFor="status">Statut</FieldLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        aria-invalid={Boolean(errors.status)}
                        className="w-full"
                        id="status"
                      >
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={AssessmentStatus.DRAFT}>
                            Brouillon
                          </SelectItem>
                          <SelectItem value={AssessmentStatus.ACTIVE}>
                            Active
                          </SelectItem>
                          <SelectItem value={AssessmentStatus.CLOSED}>
                            Fermee
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError>{errors.status?.message}</FieldError>
                  </Field>
                )}
              />

              <Field data-invalid={Boolean(errors.description)}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...register("description")}
                  aria-invalid={Boolean(errors.description)}
                  className="min-h-36 resize-y"
                  id="description"
                  placeholder="Resume le contexte, le niveau attendu et les contraintes de cette evaluation."
                />
                <FieldDescription>
                  Optionnel. Precise le cadrage de cette evaluation pour
                  l equipe.
                </FieldDescription>
                <FieldError>{errors.description?.message}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button asChild variant="outline">
            <Link
              href={assessment ? `/assessments/${assessment.id}` : "/assessments"}
            >
              Annuler
            </Link>
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                {isEdit ? "Enregistrement..." : "Creation..."}
              </>
            ) : isEdit ? (
              "Enregistrer"
            ) : (
              "Creer une evaluation"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
