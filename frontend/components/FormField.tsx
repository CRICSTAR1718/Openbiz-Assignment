import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField as FormFieldType } from '../lib/schema';

interface FormFieldProps {
  field: FormFieldType;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch?: any;
}

export default function FormField({ field, register, errors, watch }: FormFieldProps) {
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
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
          <div className="flex items-start">
            <input
              type="checkbox"
              id={field.id}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              {...register(field.id)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <label 
        htmlFor={field.id} 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {field.label}
        {field.required === true && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}
      
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-pulse">
          {errorMessage}
        </p>
      )}
      
      {field.type === 'checkbox' && field.label !== 'REPLACE_WITH_EXACT_TEXT_FROM_LIVE_SITE' && (
        <p className="mt-1 text-xs text-gray-500">
          {field.label}
        </p>
      )}
    </div>
  );
}
