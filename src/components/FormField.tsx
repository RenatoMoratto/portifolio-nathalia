import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

interface BaseFormFieldProps {
  /** Field label text */
  label: string;
  /** Field name for form submission */
  name: string;
  /** Optional error message to display */
  error?: string;
}

interface TextInputFieldProps extends BaseFormFieldProps, Omit<InputProps, 'name'> {
  /** Input type - text or email */
  type?: 'text' | 'email';
}

interface TextareaFieldProps extends BaseFormFieldProps, Omit<TextareaProps, 'name'> {
  /** Textarea type */
  type: 'textarea';
}

type FormFieldProps = TextInputFieldProps | TextareaFieldProps;

/**
 * Standardized form field component with label, input/textarea, and error message
 *
 * Handles both text inputs and textareas with consistent styling and error states.
 * Uses the `input-field` utility class from index.css.
 *
 * @example
 * <FormField
 *   label="Name"
 *   name="name"
 *   type="text"
 *   value={formData.name}
 *   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 *   error={errors.name}
 * />
 */
export function FormField({
  label,
  name,
  error,
  type = 'text',
  ...props
}: FormFieldProps) {
  const isTextarea = type === 'textarea';

  const inputClassName = cn(
    'input-field',
    error &&
      'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/20',
  );

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
      >
        {label}
      </label>

      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          className={cn(inputClassName, 'resize-none')}
          {...(props as TextareaProps)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={inputClassName}
          {...(props as InputProps)}
        />
      )}

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
