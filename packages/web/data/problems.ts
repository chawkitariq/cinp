import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";
import type { Problem } from "@cinp/api";

/**
 * Result shape returned by the problems list fetcher without throwing in pages.
 */
export type ProblemsResult =
  | {
      ok: true;
      problems: Problem[];
    }
  | {
      ok: false;
      message: string;
    };

/**
 * Result shape returned by the single-problem fetcher after 404 handling.
 */
export type ProblemResult =
  | {
      ok: true;
      problem: Problem;
    }
  | {
      ok: false;
      message: string;
    };

/**
 * Fetches all problems from the API without using the Next.js data cache.
 */
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

/**
 * Fetches one problem by API UUID and delegates 404 responses to Next.js.
 */
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
