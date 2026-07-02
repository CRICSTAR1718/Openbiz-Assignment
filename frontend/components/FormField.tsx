import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { FormField as FormFieldType } from '../lib/schema';

interface FormFieldProps {
  field: FormFieldType;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch?: any;
  fieldNumber?: number;
}

export default function FormField({ field, register, errors, fieldNumber }: FormFieldProps) {
  const error = errors[field.id];
  const errorMessage = error?.message as string;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900 placeholder-slate-500"
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
            {...register(field.id)}
          />
        );

      case 'select':
        // Parse options if they're in a specific format
        let options: string[] = [];
        if (field.options === 'TBD - inspect <option> tags on live site') {
          options = ['Select an option', 'Proprietorship', 'Partnership', 'Limited Liability Partnership', 'Private Limited Company', 'Public Limited Company', 'Others'];
        } else if (typeof field.options === 'string') {
          options = field.options.split(',').map(opt => opt.trim());
        }

        return (
          <select
            id={field.id}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900 bg-white"
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
            {...register(field.id)}
          >
            {options.map((option, index) => (
              <option key={index} value={index === 0 ? '' : option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={field.id}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-200 cursor-pointer"
              aria-checked={false}
              aria-invalid={!!error}
              {...register(field.id)}
            />
            <label htmlFor={field.id} className="text-sm text-slate-900 font-medium">
              {field.label} {field.required === true && <span className="text-red-500">*</span>}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      {field.type !== 'checkbox' && (
        <label htmlFor={field.id} className="block text-sm font-semibold text-slate-900 mb-2">
          {fieldNumber && `${fieldNumber}. `}{field.label}
          {field.required === true && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderField()}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2" role="alert">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </p>
      )}

    </div>
  );
}
