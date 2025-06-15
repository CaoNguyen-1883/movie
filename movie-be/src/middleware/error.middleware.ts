import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import config from '@/config/config';

// Handles sending detailed error response in the development environment
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Handles sending generic, user-friendly error response in the production environment
const sendErrorProd = (err: AppError, res: Response) => {
  // For operational, trusted errors, send a clear message to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  
  // For programming or other unknown errors, log the error and send a generic message
  console.error('ERROR 💥:', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

/**
 * Global error handling middleware.
 * Catches errors and sends a structured JSON response based on the environment.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const appError = err instanceof AppError
    ? err
    : new AppError(err.message || 'An unexpected error occurred', 500);

  if (config.nodeEnv === 'development') {
    sendErrorDev(appError, res);
  } else {
    sendErrorProd(appError, res);
  }
}; 