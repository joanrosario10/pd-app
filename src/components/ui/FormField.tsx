import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

type BaseFieldProps = {
  label: string
  id: string
  error?: string
  hint?: string
}

type FormFieldInputProps = BaseFieldProps & {
  type?: 'text' | 'email' | 'password' | 'tel'
  inputProps: InputProps
}

type FormFieldTextareaProps = BaseFieldProps & {
  textareaProps: TextareaProps
}

const inputClass =
  'w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
const inputReadOnlyClass = 'w-full min-w-0 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed'

/**
 * Reusable form field: label, input, optional error and hint.
 * Use for consistent styling and accessibility (label[htmlFor], id).
 */
export function FormFieldInput({
  label,
  id,
  error,
  hint,
  type = 'text',
  inputProps,
}: FormFieldInputProps) {
  const { className, readOnly, ...rest } = inputProps
  const isReadOnly = readOnly === true
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={isReadOnly ? inputReadOnlyClass : inputClass}
        readOnly={isReadOnly}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  )
}

/**
 * Reusable textarea field: label, textarea, optional error and hint.
 */
export function FormFieldTextarea({
  label,
  id,
  error,
  hint,
  textareaProps,
}: FormFieldTextareaProps) {
  const { className, ...rest } = textareaProps
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${inputClass} resize-none`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  )
}
