import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";
import type { Problem } from "@cinp/api";

export type ProblemsResult =
  | {
      ok: true;
      problems: Problem[];
    }
  | {
      ok: false;
      message: string;
    };

export type ProblemResult =
  | {
      ok: true;
      problem: Problem;
    }
  | {
      ok: false;
      message: string;
    };

export async function getProblems(): Promise<ProblemsResult> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/problem`, {
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      message:
        "Impossible de joindre l'API. Verifie que le serveur NestJS est lance.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      message: `L'API a retourne une erreur ${response.status}.`,
    };
  }

  const problems = (await response.json()) as Problem[];

  return { ok: true, problems };
}

export async function getProblem(id: string): Promise<ProblemResult> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/problem/${id}`, {
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      message:
        "Impossible de joindre l'API. Verifie que le serveur NestJS est lance.",
    };
  }

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    return {
      ok: false,
      message: `L'API a retourne une erreur ${response.status}.`,
    };
  }

  const problem = (await response.json()) as Problem;

  return { ok: true, problem };
}
