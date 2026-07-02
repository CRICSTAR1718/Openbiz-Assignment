export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SubmitFormData {
  aadhaar_number: string;
  owner_name: string;
  declaration: boolean;
  type_of_organisation: string;
  pan_number?: string;
}

const validationRules = {
  aadhaar_number: {
    regex: /^[0-9]{12}$/,
    message: 'Aadhaar number must be exactly 12 digits',
  },
  owner_name: {
    regex: /^[A-Za-z ]{2,100}$/,
    message: 'Name must be 2-100 characters and contain only letters and spaces',
  },
  declaration: {
    required: true,
    message: 'Declaration must be accepted',
  },
  type_of_organisation: {
    required: true,
    message: 'Type of organisation is required',
  },
  pan_number: {
    regex: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
    message: 'PAN number must be in format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)',
  },
};

export function validateSubmitData(data: SubmitFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate Aadhaar number
  if (!data.aadhaar_number) {
    errors.aadhaar_number = 'Aadhaar number is required';
  } else if (!validationRules.aadhaar_number.regex.test(data.aadhaar_number)) {
    errors.aadhaar_number = validationRules.aadhaar_number.message;
  }

  // Validate owner name
  if (!data.owner_name) {
    errors.owner_name = 'Owner name is required';
  } else if (!validationRules.owner_name.regex.test(data.owner_name)) {
    errors.owner_name = validationRules.owner_name.message;
  }

  // Validate declaration
  if (!data.declaration) {
    errors.declaration = validationRules.declaration.message;
  }

  // Validate type of organisation
  if (!data.type_of_organisation) {
    errors.type_of_organisation = validationRules.type_of_organisation.message;
  }

  // Validate PAN number (conditional - only required if organisation type is not '1')
  if (data.type_of_organisation !== '1') {
    if (!data.pan_number) {
      errors.pan_number = 'PAN number is required for this organisation type';
    } else if (!validationRules.pan_number.regex.test(data.pan_number)) {
      errors.pan_number = validationRules.pan_number.message;
    }
  } else if (data.pan_number && !validationRules.pan_number.regex.test(data.pan_number)) {
    // If PAN is provided but invalid, still show error
    errors.pan_number = validationRules.pan_number.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
