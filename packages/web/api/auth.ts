import { API_BASE_URL } from "@/constants/api";
import {
  getApiErrorMessage,
  serviceUnavailableMessage,
} from "@/utils/api-error";
import type { AuthResponse, LoginDto, RegisterDto } from "@cinp/api";

async function fetchAuthMutation(
  path: "/auth/login" | "/auth/register",
  payload: LoginDto | RegisterDto,
) {
  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(serviceUnavailableMessage);
  }
}

/**
 * Authenticates a user with the API and returns the issued session payload.
 */
export async function login(payload: LoginDto) {
  const response = await fetchAuthMutation("/auth/login", payload);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response));
  }

  return (await response.json()) as AuthResponse;
}

/**
 * Creates a recruiter account with the API and returns the issued session payload.
 */
export async function register(payload: RegisterDto) {
  const response = await fetchAuthMutation("/auth/register", payload);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response));
  }

  return (await response.json()) as AuthResponse;
}
