import { z } from 'zod';
import { schema } from './schema';

// Generate Zod schema dynamically from the udyamSchema
const createFieldSchema = (field: any) => {
  let fieldSchema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
      let textSchema = z.string();
      if (field.validationRegex) {
        textSchema = textSchema.regex(new RegExp(field.validationRegex));
      }
      if (field.maxLength) {
        textSchema = textSchema.max(field.maxLength);
      }
      fieldSchema = textSchema;
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
      let stringSchema = z.string();
      stringSchema = stringSchema.min(1, `${field.label} is required`);
      fieldSchema = stringSchema;
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
