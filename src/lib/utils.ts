/**
 * Centralized utilities for error handling, sanitization, and safety.
 * Used across hooks and components for consistency.
 */

/** Maximum length for user text fields sent to the API (prevents abuse and overflow) */
export const MAX_INPUT_LENGTH = {
  name: 200,
  dosage: 200,
  frequency: 100,
  notes: 1000,
  full_name: 200,
  phone: 30,
} as const

/**
 * Normalize unknown errors (e.g. from Supabase, fetch) into a plain Error.
 * Use in catch blocks and queryFn/mutationFn for consistent error handling.
 */
export function toError(e: unknown): Error {
  if (e instanceof Error) return e
  if (typeof e === 'object' && e !== null && 'message' in e) {
    const msg = (e as { message?: unknown }).message
    return new Error(msg != null ? String(msg) : JSON.stringify(e))
  }
  return new Error(String(e))
}

/**
 * Get a safe display message from an error (for UI). Never exposes stack or internal details.
 */
export function getErrorMessage(e: unknown): string {
  const err = toError(e)
  return err.message
}

/**
 * Sanitize string for form submission: trim and enforce max length.
 * Use before sending user input to the API. Does not escape HTML (React escapes when rendering).
 */
export function sanitizeFormString(
  value: string,
  maxLength: number = 500
): string {
  const trimmed = value.trim()
  if (trimmed.length > maxLength) return trimmed.slice(0, maxLength)
  return trimmed
}

/**
 * Sanitize for display in DOM. React's default text content is safe;
 * use this only when you need to enforce max length for display or pass to attributes.
 * For user-generated content rendered as text (e.g. medication name), React already escapes.
 */
export function sanitizeForDisplay(value: string, maxLength: number = 500): string {
  const trimmed = value.trim()
  if (trimmed.length > maxLength) return trimmed.slice(0, maxLength) + '…'
  return trimmed
}
