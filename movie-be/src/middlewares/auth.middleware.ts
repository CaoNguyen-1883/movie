import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppException } from '../exceptions/AppException';
import { ITokenPayload } from '../interfaces/auth.interface';

declare global {
    namespace Express {
        interface Request {
            user?: ITokenPayload;
        }
    }
}

export const authMiddleware = {
    // Verify access token
    verifyToken: (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new AppException('No token provided', 401, 'UNAUTHORIZED');
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret') as ITokenPayload;

            // Add user info to request
            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                next(new AppException('Token expired', 401, 'TOKEN_EXPIRED'));
            } else if (error instanceof jwt.JsonWebTokenError) {
                next(new AppException('Invalid token', 401, 'INVALID_TOKEN'));
            } else {
                next(error);
            }
        }
    },

    // Check if user has required role
    hasRole: (roles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppException('User not authenticated', 401, 'UNAUTHORIZED');
            }

            const hasRole = req.user.roles.some(role => roles.includes(role));
            if (!hasRole) {
                throw new AppException('Insufficient permissions', 403, 'FORBIDDEN');
            }

            next();
        };
    }
}; 