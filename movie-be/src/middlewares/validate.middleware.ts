import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppException } from '../exceptions/AppException';

export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            throw new AppException('Validation failed', 400, 'VALIDATION_ERROR', errors);
        }

        next();
    };
}; 