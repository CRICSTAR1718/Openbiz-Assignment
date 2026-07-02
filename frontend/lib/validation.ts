import { z } from 'zod';
import { schema } from './schema';

// Generate Zod schema dynamically from the udyamSchema
const createFieldSchema = (field: any) => {
  let fieldSchema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
      fieldSchema = z.string();
      if (field.validationRegex) {
        fieldSchema = fieldSchema.regex(new RegExp(field.validationRegex));
      }
      if (field.maxLength) {
        fieldSchema = fieldSchema.max(field.maxLength);
      }
      break;
    case 'select':
      fieldSchema = z.string();
      break;
    case 'checkbox':
      fieldSchema = z.boolean().refine((val) => val === true, {
        message: 'This field must be checked',
      });
      break;
    default:
      fieldSchema = z.any();
  }

  if (field.required === true) {
    if (field.type === 'checkbox') {
      // Checkbox already has refine for true
    } else {
      fieldSchema = fieldSchema.min(1, `${field.label} is required`);
    }
  }

  return fieldSchema;
};

// Create step schemas
const stepSchemas = schema.steps.map((step) => {
  const stepFields: Record<string, z.ZodTypeAny> = {};
  
  step.fields.forEach((field) => {
    stepFields[field.id] = createFieldSchema(field);
  });

  return z.object(stepFields);
});

export const step1Schema = stepSchemas[0];
export const step2Schema = stepSchemas[1];

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type FormData = Step1FormData & Step2FormData;
