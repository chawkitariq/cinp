import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

/**
 * Metadata for the recruiter registration page.
 */
export const metadata: Metadata = {
  title: "Inscription | CInP",
  description: "Cree ton compte recruteur CInP.",
};

/**
 * Recruiter registration page.
 */
export default function RegisterPage() {
  return (
    <main className="flex min-h-screen bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-8">
        <header className="flex flex-col gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">CInP</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Creer ton espace recruteur
          </h1>
          <p className="text-muted-foreground">
            Prepare tes evaluations techniques et invite tes candidats.
          </p>
        </header>

        <AuthForm mode="register" />
      </div>
    </main>
  );
}
