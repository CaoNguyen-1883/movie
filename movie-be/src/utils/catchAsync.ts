import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * A wrapper for async route handlers to catch errors and pass them to the global error handler.
 * This avoids the need for a try-catch block in every async controller.
 * @param fn The async function to be executed.
 * @returns A function that executes the provided async function and catches any errors.
 */
export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}; 