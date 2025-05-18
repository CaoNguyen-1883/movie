import { IError } from '../interfaces/error.interface';

export class AppException extends Error implements IError {
    statusCode: number;
    code: string;
    errors?: any[];

    constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_SERVER_ERROR', errors?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        
        // This clips the constructor invocation from the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
} 