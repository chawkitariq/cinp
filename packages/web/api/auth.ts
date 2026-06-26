import { API_BASE_URL } from "@/constants/api";
import {
  getApiErrorMessage,
  serviceUnavailableMessage,
} from "@/utils/api-error";
import type { AuthResponse, LoginDto, RegisterDto } from "@cinp/api";

/**
 * Authenticates a user with the API and returns the issued session payload.
 */
export async function login(payload: LoginDto) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
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

  return (await response.json()) as AuthResponse;
}

/**
 * Creates a recruiter account with the API and returns the issued session payload.
 */
export async function register(payload: RegisterDto) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
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

  return (await response.json()) as AuthResponse;
}
