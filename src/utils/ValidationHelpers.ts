// Filename: ValidationHelpers.ts
// Role: Form validation utilities and helpers
// Purpose: Provides reusable validation functions for forms and user input
// Integration: Used by forms and components for consistent validation logic

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Email validation using a comprehensive regex pattern
 */
export function validateEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Password validation with configurable requirements
 */
export interface PasswordRequirements {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export function validatePassword(
  password: string,
  requirements: PasswordRequirements = {}
): ValidationResult {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = requirements;

  const errors: ValidationError[] = [];

  if (password.length < minLength) {
    errors.push({
      field: "password",
      message: `Password must be at least ${minLength} characters long`,
    });
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least one uppercase letter",
    });
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least one lowercase letter",
    });
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least one number",
    });
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least one special character",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that two passwords match
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errors: [
        {
          field: "confirmPassword",
          message: "Passwords do not match",
        },
      ],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
}

/**
 * Validates required fields
 */
export function validateRequired(
  value: any,
  fieldName: string
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      isValid: false,
      errors: [
        {
          field: fieldName,
          message: `${fieldName} is required`,
        },
      ],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
}

/**
 * Validates string length constraints
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): ValidationResult {
  const errors: ValidationError[] = [];

  if (minLength !== undefined && value.length < minLength) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters long`,
    });
  }

  if (maxLength !== undefined && value.length > maxLength) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be no more than ${maxLength} characters long`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates phone number format (simple validation)
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Basic phone number validation - adjust regex as needed for your requirements
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ""));
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Composite validator that runs multiple validation functions
 */
export function validateField(
  value: any,
  fieldName: string,
  validators: Array<(value: any, fieldName: string) => ValidationResult>
): ValidationResult {
  const allErrors: ValidationError[] = [];

  for (const validator of validators) {
    const result = validator(value, fieldName);
    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validates an entire form object
 */
export function validateForm<T extends Record<string, any>>(
  formData: T,
  validationRules: Record<
    keyof T,
    (value: any, fieldName: string) => ValidationResult
  >
): ValidationResult {
  const allErrors: ValidationError[] = [];

  for (const [fieldName, validator] of Object.entries(validationRules)) {
    const value = formData[fieldName];
    const result = validator(value, fieldName);

    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
