export async function getApiErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: unknown };

    if (Array.isArray(body.message)) {
      return body.message.join(" ");
    }

    if (typeof body.message === "string") {
      return body.message;
    }
  } catch {
    // Fall back to a generic HTTP message below.
  }

  return `L'API a retourne une erreur ${response.status}.`;
}
