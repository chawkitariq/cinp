/**
 * Formats a date using the short French locale pattern for UI display.
 *
 * @param value JavaScript date or a `Date`-compatible string.
 * @returns A readable date string or `Date inconnue` when the value is missing.
 */
export function formatDate(value?: Date | string) {
  if (!value) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
