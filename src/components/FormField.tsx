import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

interface BaseFormFieldProps {
  label: string;
  name: string;
  error?: string;
}

interface TextInputFieldProps extends BaseFormFieldProps, Omit<InputProps, 'name'> {
  type?: 'text' | 'email';
}

interface TextareaFieldProps extends BaseFormFieldProps, Omit<TextareaProps, 'name'> {
  type: 'textarea';
}

type FormFieldProps = TextInputFieldProps | TextareaFieldProps;

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
