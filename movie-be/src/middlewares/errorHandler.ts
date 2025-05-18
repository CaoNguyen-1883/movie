import { Request, Response, NextFunction } from 'express';
import { AppException } from '../exceptions/AppException';
import mongoose from 'mongoose';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    // Handle Mongoose validation errors
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            message: 'Validation Error',
            errors
        });
    }

    // Handle Mongoose duplicate key errors
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        return res.status(400).json({
            status: 'error',
            code: 'DUPLICATE_KEY_ERROR',
            message: 'Duplicate field value entered',
            errors: [{
                field: Object.keys((err as any).keyPattern)[0],
                message: 'This value already exists'
            }]
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            code: 'INVALID_TOKEN',
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            code: 'TOKEN_EXPIRED',
            message: 'Token expired'
        });
    }

    // Handle custom AppException
    if (err instanceof AppException) {
        return res.status(err.statusCode).json({
            status: 'error',
            code: err.code,
            message: err.message,
            errors: err.errors
        });
    }

    // Handle other errors
    return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong'
    });
}; 