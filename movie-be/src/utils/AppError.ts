/**
 * Custom error class for handling operational errors.
 * Extends the built-in Error class to include an HTTP status code and an operational flag.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  /**
   * Creates an instance of AppError.
   * @param message The error message.
   * @param statusCode The HTTP status code.
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
} 