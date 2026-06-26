# Error Matrix

## Default Mapping

| Scenario | Web behavior |
| --- | --- |
| Read request, resource exists | Return `ok: true` result or parsed data |
| Read request, resource missing | Call `notFound()` for single resources |
| Read request, backend down | Return `ok: false` result with `serviceUnavailableMessage` when the page handles inline states |
| Mutation request, request fails | Throw `Error(serviceUnavailableMessage)` |
| Mutation request, API returns 4xx/5xx | Throw `Error(getApiErrorMessage(response))` |
| Form submit fails | Catch locally and show a submit error |
| Route segment should own 404 UI | Add `not-found.tsx` |
| Route segment should own fatal error UI | Add `error.tsx` |

## Practical Guidance

- Use result unions for list/detail pages that want to render empty/error states inline.
- Use thrown errors for form submissions and destructive actions.
- Do not add a shared mutation wrapper unless the task explicitly asks for one.
- Keep HTTP-to-message mapping in `utils/api-error.ts`; do not duplicate strings in feature files.
