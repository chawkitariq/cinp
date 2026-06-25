import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";
import {
  getApiErrorMessage,
  serviceUnavailableMessage,
} from "@/utils/api-error";
import type {
  Assessment,
  CreateAssessmentDto,
  UpdateAssessmentDto,
} from "@cinp/api";

async function fetchAssessmentMutation(
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
 * Result shape returned by the assessments list fetcher without throwing in pages.
 */
export type AssessmentsResult =
  | {
      ok: true;
      assessments: Assessment[];
    }
  | {
      ok: false;
      message: string;
    };

/**
 * Result shape returned by the single-assessment fetcher after 404 handling.
 */
export type AssessmentResult =
  | {
      ok: true;
      assessment: Assessment;
    }
  | {
      ok: false;
      message: string;
    };

/**
 * Fetches all assessments from the API without using the Next.js data cache.
 */
export async function getAssessments(): Promise<AssessmentsResult> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/assessments`, {
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

  const assessments = (await response.json()) as Assessment[];

  return { ok: true, assessments };
}

/**
 * Fetches one assessment by API UUID and delegates 404 responses to Next.js.
 */
export async function getAssessment(id: string): Promise<AssessmentResult> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/assessments/${id}`, {
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

  const assessment = (await response.json()) as Assessment;

  return { ok: true, assessment };
}

/**
 * Creates an assessment through the API and returns the saved entity.
 */
export async function createAssessment(payload: CreateAssessmentDto) {
  const response = await fetchAssessmentMutation(
    `${API_BASE_URL}/assessments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return (await response.json()) as Assessment;
}

/**
 * Updates an existing assessment through the API and returns the saved entity.
 */
export async function updateAssessment(
  id: string,
  payload: UpdateAssessmentDto,
) {
  const response = await fetchAssessmentMutation(
    `${API_BASE_URL}/assessments/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return (await response.json()) as Assessment;
}

/**
 * Deletes an assessment by API UUID.
 */
export async function deleteAssessment(id: string) {
  const response = await fetchAssessmentMutation(
    `${API_BASE_URL}/assessments/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }
}
