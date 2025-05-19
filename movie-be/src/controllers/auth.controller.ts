import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const authController = {
    // Login
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.login(req.body);

            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                status: 'success',
                data: {
                    user: result.user,
                    accessToken: result.accessToken
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Refresh token
    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error('No refresh token provided');
            }

            const result = await authService.refreshToken(refreshToken);

            res.json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    // Logout
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Clear refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            res.json({
                status: 'success',
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}; 