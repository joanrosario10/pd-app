/**
 * Shared types used across the app.
 * Domain-specific types (e.g. Medication, Profile) stay in their hooks for colocation;
 * this file is for cross-cutting or API-bound types.
 */

/** Standard API error shape we normalize from Supabase/fetch */
export interface ApiError {
  message: string
  code?: string
}

/** Props for components that only accept React children */
export interface ChildrenProps {
  children: React.ReactNode
}
