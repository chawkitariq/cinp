"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { editor } from "monaco-editor";
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
import { API_BASE_URL } from "@/constants/api";

const difficultyValues = ["easy", "medium", "hard"] as const;

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

const defaultValues: ProblemFormValues = {
  title: "",
  slug: "",
  difficulty: "easy",
  description: "",
  examples: "",
  constraints: "",
  starterCode: "",
};

function getOptionalString(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function getExamples(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  return JSON.parse(trimmedValue) as Record<string, unknown>[];
}

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: unknown };

    if (Array.isArray(body.message)) {
      return body.message.join(" ");
    }

    if (typeof body.message === "string") {
      return body.message;
    }
  } catch {
    // Fall back to a generic HTTP message below.
  }

  return `L'API a retourne une erreur ${response.status}.`;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const modelRef = useRef<editor.ITextModel | null>(null);
  const onChangeRef = useRef(onChange);
  const initialDisabledRef = useRef(disabled);
  const initialValueRef = useRef(value);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let disposed = false;
    let subscription: { dispose: () => void } | undefined;

    async function loadEditor() {
      try {
        const monaco = await import("monaco-editor");

        if (disposed || !containerRef.current) {
          return;
        }

        const model = monaco.editor.createModel(
          initialValueRef.current,
          "javascript",
        );
        const codeEditor = monaco.editor.create(containerRef.current, {
          automaticLayout: true,
          fontSize: 13,
          lineNumbers: "on",
          minimap: { enabled: false },
          model,
          padding: { bottom: 12, top: 12 },
          readOnly: initialDisabledRef.current,
          renderLineHighlight: "line",
          scrollBeyondLastLine: false,
          tabSize: 2,
          theme: "vs",
          wordWrap: "on",
        });

        subscription = model.onDidChangeContent(() => {
          onChangeRef.current(model.getValue());
        });
        editorRef.current = codeEditor;
        modelRef.current = model;
        setIsReady(true);
      } catch {
        if (!disposed) {
          setLoadError("Impossible de charger l'editeur Monaco.");
        }
      }
    }

    loadEditor();

    return () => {
      disposed = true;
      subscription?.dispose();
      editorRef.current?.dispose();
      modelRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const model = modelRef.current;

    if (model && value !== model.getValue()) {
      model.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    editorRef.current?.updateOptions({ readOnly: disabled });
  }, [disabled]);

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

export default function NewProblemPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues,
  });

  async function onSubmit(values: ProblemFormValues) {
    setSubmitError(null);

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      difficulty: values.difficulty,
      description: values.description.trim(),
      examples: getExamples(values.examples),
      constraints: getOptionalString(values.constraints),
      starterCode: getOptionalString(values.starterCode),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/problem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setSubmitError(await getErrorMessage(response));
        return;
      }

      router.push("/problems");
      router.refresh();
    } catch {
      setSubmitError(
        "Impossible de joindre l'API. Verifie que le serveur NestJS est lance.",
      );
    }
  }

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

        <Card>
          <CardHeader>
            <CardTitle>Details du probleme</CardTitle>
            <CardDescription>
              Les champs obligatoires sont valides avant la creation.
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

                  <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
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
                          <FieldLabel htmlFor="difficulty">
                            Difficulte
                          </FieldLabel>
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
                                <SelectItem value="easy">Facile</SelectItem>
                                <SelectItem value="medium">
                                  Intermediaire
                                </SelectItem>
                                <SelectItem value="hard">Difficile</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FieldError>{errors.difficulty?.message}</FieldError>
                        </Field>
                      )}
                    />
                  </div>

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
                <Link href="/problems">Annuler</Link>
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Creation...
                  </>
                ) : (
                  "Creer le probleme"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
