import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";
import {
  getApiErrorMessage,
  serviceUnavailableMessage,
} from "@/utils/api-error";
import type { CreateProblemDto, Problem, UpdateProblemDto } from "@cinp/api";

async function fetchProblemMutation(
  input: string,
  init: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new Error(serviceUnavailableMessage);
  }
}

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
    response = await fetch(`${API_BASE_URL}/problems`, {
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      message: serviceUnavailableMessage,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      message: getApiErrorMessage(response),
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
    response = await fetch(`${API_BASE_URL}/problems/${id}`, {
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      message: serviceUnavailableMessage,
    };
  }

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    return {
      ok: false,
      message: getApiErrorMessage(response),
    };
  }

  const problem = (await response.json()) as Problem;

  return { ok: true, problem };
}

/**
 * Creates a problem through the API and returns the saved entity.
 */
export async function createProblem(payload: CreateProblemDto) {
  const response = await fetchProblemMutation(`${API_BASE_URL}/problems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return (await response.json()) as Problem;
}

/**
 * Updates an existing problem through the API and returns the saved entity.
 */
export async function updateProblem(
  id: string,
  payload: UpdateProblemDto,
) {
  const response = await fetchProblemMutation(`${API_BASE_URL}/problems/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return (await response.json()) as Problem;
}

/**
 * Deletes a problem by API UUID.
 */
export async function deleteProblem(id: string) {
  const response = await fetchProblemMutation(`${API_BASE_URL}/problems/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }
}
