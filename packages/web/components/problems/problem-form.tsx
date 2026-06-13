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
import { createProblem, updateProblem } from "@/api/problems";
import { useMonacoEditor } from "@/hooks/use-monaco-editor";
import { genericUserErrorMessage } from "@/utils/api-error";
import {
  Difficulty,
  type CreateProblemDto,
  type Problem,
} from "@cinp/api";

/**
 * Accepted difficulty literals for the problem form and API payload.
 */
const difficultyValues = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
] as const;

/**
 * Client-side validation schema matching the create/update problem API.
 */
const problemSchema = z.object({
  title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caracteres."),
  slug: z
    .string()
    .trim()
    .min(3, "Le slug doit contenir au moins 3 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Utilise des minuscules, chiffres et tirets, sans tiret au debut ou a la fin.",
    ),
  difficulty: z.enum(difficultyValues, {
    required_error: "Choisis une difficulte.",
  }),
  description: z
    .string()
    .trim()
    .min(20, "La description doit contenir au moins 20 caracteres."),
  createdById: z.string().uuid("L'id createur doit etre un UUID valide."),
  examples: z.string().superRefine((value, context) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    try {
      const parsedExamples = JSON.parse(trimmedValue);

      if (!Array.isArray(parsedExamples)) {
        context.addIssue({
          code: "custom",
          message: "Les exemples doivent etre un tableau JSON.",
        });
      }
    } catch {
      context.addIssue({
        code: "custom",
        message: "Le JSON des exemples est invalide.",
      });
    }
  }),
  constraints: z.string(),
  starterCode: z.string(),
});

type ProblemFormValues = z.infer<typeof problemSchema>;

/**
 * Props contract for creating a new problem or editing an existing one.
 */
type ProblemFormProps =
  | {
      mode: "create";
      problem?: never;
    }
  | {
      mode: "edit";
      problem: Problem;
    };

/**
 * Empty form state used for problem creation.
 */
const emptyValues: ProblemFormValues = {
  title: "",
  slug: "",
  difficulty: Difficulty.EASY,
  description: "",
  createdById: "",
  examples: "",
  constraints: "",
  starterCode: "",
};

/**
 * Converts blank optional text fields to undefined for cleaner API payloads.
 */
function getOptionalString(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

/**
 * Parses the examples JSON textarea into the API examples array.
 */
function getExamples(value: string): CreateProblemDto["examples"] {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  return JSON.parse(trimmedValue) as CreateProblemDto["examples"];
}

/**
 * Maps an optional API problem entity to editable form values.
 */
function getDefaultValues(problem?: Problem): ProblemFormValues {
  if (!problem) {
    return emptyValues;
  }

  return {
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty as ProblemFormValues["difficulty"],
    description: problem.description,
    createdById: problem.createdById,
    examples: problem.examples?.length
      ? JSON.stringify(problem.examples, null, 2)
      : "",
    constraints: problem.constraints ?? "",
    starterCode: problem.starterCode ?? "",
  };
}

/**
 * Builds the create/update payload expected by the problem API.
 */
function getPayload(values: ProblemFormValues): CreateProblemDto {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    difficulty: values.difficulty,
    description: values.description.trim(),
    createdById: values.createdById.trim(),
    examples: getExamples(values.examples),
    constraints: getOptionalString(values.constraints),
    starterCode: getOptionalString(values.starterCode),
  };
}

/**
 * Monaco-backed editor field used for starter code input.
 */
function StarterCodeEditor({
  disabled,
  invalid,
  onChange,
  value,
}: {
  disabled: boolean;
  invalid: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  const { containerRef, isReady, loadError } = useMonacoEditor({
    disabled,
    onChange,
    value,
  });

  return (
    <>
      <div
        aria-invalid={invalid}
        className="relative overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
      >
        <div
          ref={containerRef}
          aria-label="Starter code"
          className="h-72 w-full"
          role="textbox"
        />
        {!isReady && !loadError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Spinner />
          </div>
        ) : null}
      </div>
      {loadError ? (
        <FieldDescription className="text-destructive">
          {loadError}
        </FieldDescription>
      ) : null}
    </>
  );
}

/**
 * Form used to create or edit reusable coding problems.
 */
export function ProblemForm({
  mode,
  problem,
}: ProblemFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEdit = mode === "edit";

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: getDefaultValues(problem),
  });

  async function onSubmit(values: ProblemFormValues) {
    setSubmitError(null);

    try {
      const payload = getPayload(values);
      const savedProblem = isEdit
        ? await updateProblem(problem.id, payload)
        : await createProblem(payload);

      router.push(`/problems/${savedProblem.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : genericUserErrorMessage,
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details du probleme</CardTitle>
        <CardDescription>
          Les champs obligatoires sont valides avant{" "}
          {isEdit ? "l'enregistrement" : "la creation"}.
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
                  placeholder="Two Sum"
                />
                <FieldError>{errors.title?.message}</FieldError>
              </Field>

              <FieldGroup className="grid sm:grid-cols-[1fr_180px]">
                <Field data-invalid={Boolean(errors.slug)}>
                  <FieldLabel htmlFor="slug">Slug</FieldLabel>
                  <Input
                    {...register("slug")}
                    aria-invalid={Boolean(errors.slug)}
                    id="slug"
                    placeholder="two-sum"
                  />
                  <FieldError>{errors.slug?.message}</FieldError>
                </Field>

                <Controller
                  control={control}
                  name="difficulty"
                  render={({ field }) => (
                    <Field data-invalid={Boolean(errors.difficulty)}>
                      <FieldLabel htmlFor="difficulty">Difficulte</FieldLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          aria-invalid={Boolean(errors.difficulty)}
                          className="w-full"
                          id="difficulty"
                        >
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={Difficulty.EASY}>Facile</SelectItem>
                            <SelectItem value={Difficulty.MEDIUM}>
                              Intermediaire
                            </SelectItem>
                            <SelectItem value={Difficulty.HARD}>
                              Difficile
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FieldError>{errors.difficulty?.message}</FieldError>
                    </Field>
                  )}
                />
              </FieldGroup>

              <Field data-invalid={Boolean(errors.createdById)}>
                <FieldLabel htmlFor="createdById">ID createur</FieldLabel>
                <Input
                  {...register("createdById")}
                  aria-invalid={Boolean(errors.createdById)}
                  id="createdById"
                  placeholder="00000000-0000-0000-0000-000000000000"
                />
                <FieldDescription>
                  UUID du recruteur proprietaire du probleme.
                </FieldDescription>
                <FieldError>{errors.createdById?.message}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.description)}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...register("description")}
                  aria-invalid={Boolean(errors.description)}
                  className="min-h-36 resize-y"
                  id="description"
                  placeholder="Explique l'objectif, les entrees attendues et le resultat a produire."
                />
                <FieldError>{errors.description?.message}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.examples)}>
                <FieldLabel htmlFor="examples">Exemples JSON</FieldLabel>
                <Textarea
                  {...register("examples")}
                  aria-describedby="examples-description"
                  aria-invalid={Boolean(errors.examples)}
                  className="min-h-28 resize-y font-mono"
                  id="examples"
                  placeholder='[{"input":"nums = [2,7,11,15], target = 9","output":"[0,1]"}]'
                />
                <FieldDescription id="examples-description">
                  Optionnel. Doit etre un tableau JSON si renseigne.
                </FieldDescription>
                <FieldError>{errors.examples?.message}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.constraints)}>
                <FieldLabel htmlFor="constraints">Contraintes</FieldLabel>
                <Textarea
                  {...register("constraints")}
                  aria-invalid={Boolean(errors.constraints)}
                  className="min-h-24 resize-y"
                  id="constraints"
                  placeholder="1 <= nums.length <= 10^4"
                />
                <FieldError>{errors.constraints?.message}</FieldError>
              </Field>

              <Controller
                control={control}
                name="starterCode"
                render={({ field }) => (
                  <Field data-invalid={Boolean(errors.starterCode)}>
                    <FieldLabel>Starter code</FieldLabel>
                    <StarterCodeEditor
                      disabled={isSubmitting}
                      invalid={Boolean(errors.starterCode)}
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <FieldError>{errors.starterCode?.message}</FieldError>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button asChild variant="outline">
            <Link href={problem ? `/problems/${problem.id}` : "/problems"}>
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
              "Creer le probleme"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
