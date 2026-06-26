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
 *
 * @returns A promise that resolves to either the assessment list or an error message.
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
 *
 * @param id The assessment UUID to load.
 * @returns A promise that resolves to either the assessment payload or an error message.
 * @throws {never} Calls Next.js `notFound()` when the assessment does not exist.
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
 *
 * @param payload Assessment fields to persist.
 * @returns A promise that resolves to the saved assessment.
 * @throws {Error} When the service is unavailable or returns a non-OK status.
 */
export async function createAssessment(payload: CreateAssessmentDto) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(serviceUnavailableMessage);
  }

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response));
  }

  return (await response.json()) as Assessment;
}

/**
 * Updates an existing assessment through the API and returns the saved entity.
 *
 * @param id The UUID of the assessment to update.
 * @param payload Updated assessment fields to persist.
 * @returns A promise that resolves to the saved assessment.
 * @throws {Error} When the service is unavailable or returns a non-OK status.
 */
export async function updateAssessment(
  id: string,
  payload: UpdateAssessmentDto,
) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/assessments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(serviceUnavailableMessage);
  }

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response));
  }

  return (await response.json()) as Assessment;
}

/**
 * Deletes an assessment by API UUID.
 *
 * @param id The UUID of the assessment to delete.
 * @returns A promise that resolves when the deletion request succeeds.
 * @throws {Error} When the service is unavailable or returns a non-OK status.
 */
export async function deleteAssessment(id: string) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/assessments/${id}`, {
      method: "DELETE",
    });
  } catch {
    throw new Error(serviceUnavailableMessage);
  }

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response));
  }
}
