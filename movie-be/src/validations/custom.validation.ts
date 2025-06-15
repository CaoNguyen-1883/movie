import { CustomHelpers } from 'joi';

/**
 * Custom Joi validation for password strength.
 * The password must contain at least 8 characters, one letter, and one number.
 * @param value The password string to validate.
 * @param helpers Joi's helper functions.
 * @returns The validated value.
 * @throws {Error} If the password does not meet the criteria.
 */
export const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 8) {
    return helpers.error('any.invalid', { message: 'Password must be at least 8 characters long' });
  }
  if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
    return helpers.error('any.invalid', { message: 'Password must contain at least one letter and one number' });
  }
  return value;
}; 