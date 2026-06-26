"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";

import { login, register } from "@/api/auth";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { genericUserErrorMessage } from "@/utils/api-error";
import type { LoginDto, RegisterDto } from "@cinp/api";

type AuthMode = "login" | "register";

type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type AuthFormProps = {
  mode: AuthMode;
};

const authTokenStorageKey = "cinp_access_token";

/**
 * Builds the validation schema used by the auth form for the selected mode.
 *
 * @param mode The form mode that determines whether password confirmation is required.
 * @returns A Zod schema matching the form fields.
 */
function getAuthSchema(mode: AuthMode) {
  return z
    .object({
      email: z.string().trim().email("Saisis une adresse email valide."),
      password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caracteres."),
      confirmPassword:
        mode === "register"
          ? z.string().min(1, "Confirme ton mot de passe.")
          : z.string().optional(),
    })
    .superRefine((values, context) => {
      if (
        mode === "register" &&
        values.password !== values.confirmPassword
      ) {
        context.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Les mots de passe ne correspondent pas.",
        });
      }
    });
}

/**
 * Maps form state to the login DTO expected by the API.
 *
 * @param values Raw form values collected from the login view.
 * @returns The DTO sent to the login endpoint.
 */
function getLoginPayload(values: AuthFormValues): LoginDto {
  return {
    email: values.email.trim(),
    password: values.password,
  };
}

/**
 * Maps form state to the registration DTO expected by the API.
 *
 * @param values Raw form values collected from the registration view.
 * @returns The DTO sent to the registration endpoint.
 */
function getRegisterPayload(values: AuthFormValues): RegisterDto {
  return {
    email: values.email.trim(),
    password: values.password,
  };
}

/**
 * Client-side authentication form shared by the login and registration pages.
 *
 * @param mode Determines whether the form renders login or registration fields.
 * @returns The rendered authentication form.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isRegister = mode === "register";

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(getAuthSchema(mode)),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Submits the form, stores the access token, and redirects to the dashboard.
   *
   * @param values Validated auth form values.
   * @returns A promise that resolves once the submission flow completes.
   * @throws {Error} When the API call fails or returns a user-facing error.
   */
  async function onSubmit(values: AuthFormValues) {
    setSubmitError(null);

    try {
      const authResponse = isRegister
        ? await register(getRegisterPayload(values))
        : await login(getLoginPayload(values));

      window.localStorage.setItem(
        authTokenStorageKey,
        authResponse.accessToken,
      );
      router.push("/dashboard");
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
        <CardTitle>
          {isRegister ? "Creer un compte" : "Connexion"}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Cree un compte recruteur pour preparer tes evaluations."
            : "Connecte-toi pour retrouver ton espace recruteur."}
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
              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...registerField("email")}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  id="email"
                  placeholder="recruteur@example.com"
                  type="email"
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.password)}>
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Input
                  {...registerField("password")}
                  aria-invalid={Boolean(errors.password)}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  id="password"
                  type="password"
                />
                <FieldError>{errors.password?.message}</FieldError>
              </Field>

              {isRegister ? (
                <Field data-invalid={Boolean(errors.confirmPassword)}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </FieldLabel>
                  <Input
                    {...registerField("confirmPassword")}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    autoComplete="new-password"
                    id="confirmPassword"
                    type="password"
                  />
                  <FieldError>{errors.confirmPassword?.message}</FieldError>
                </Field>
              ) : null}
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {isRegister ? "Deja un compte ?" : "Pas encore de compte ?"}{" "}
            <Link
              className="font-medium text-foreground underline-offset-4 hover:underline"
              href={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Se connecter" : "Creer un compte"}
            </Link>
          </p>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                {isRegister ? "Creation..." : "Connexion..."}
              </>
            ) : isRegister ? (
              "Creer le compte"
            ) : (
              "Se connecter"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
