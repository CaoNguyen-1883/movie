import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { pick } from '@/utils/pick';
import { AppError } from '@/utils/AppError';
import httpStatus from 'http-status';

/**
 * Creates a middleware function that validates the request against a Joi schema.
 * @param schema The Joi schema to validate against.
 * @returns A middleware function.
 */
export const validate = (schema: object) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const objectToValidate = pick(req, Object.keys(validSchema));
  
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(objectToValidate);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new AppError(errorMessage, httpStatus.BAD_REQUEST));
  }

  Object.assign(req, value);
  return next();
}; 