/**
 * Message shown when a request cannot reach the service.
 */
export const serviceUnavailableMessage =
  "Le service est momentanement indisponible. Reessaie dans quelques instants.";

/**
 * Message shown when an unexpected request failure reaches the UI.
 */
export const genericUserErrorMessage =
  "Une erreur est survenue. Reessaie dans quelques instants.";

/**
 * Maps technical HTTP failures to product-facing messages.
 *
 * @param response The failed response returned by the backend.
 * @returns A localized message safe to show in the UI.
 */
export function getApiErrorMessage(response: Response) {
  if (response.status === 400) {
    return "Certaines informations sont invalides. Verifie le formulaire et reessaie.";
  }

  if (response.status === 401) {
    return "Identifiants invalides. Verifie ton email et ton mot de passe.";
  }

  if (response.status === 404) {
    return "L'element demande est introuvable.";
  }

  if (response.status === 409) {
    return "Ces informations sont deja utilisees.";
  }

  if (response.status >= 500) {
    return serviceUnavailableMessage;
  }

  return genericUserErrorMessage;
}
