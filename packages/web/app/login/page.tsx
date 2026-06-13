import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

/**
 * Metadata for the recruiter login page.
 */
export const metadata: Metadata = {
  title: "Connexion | CInP",
  description: "Connecte-toi a ton espace recruteur CInP.",
};

/**
 * Recruiter login page.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-8">
        <header className="flex flex-col gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">CInP</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Bon retour
          </h1>
          <p className="text-muted-foreground">
            Accede a tes problemes, assessments et sessions candidat.
          </p>
        </header>

        <AuthForm mode="login" />
      </div>
    </main>
  );
}
