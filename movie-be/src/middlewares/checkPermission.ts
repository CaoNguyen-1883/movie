import { Request, Response, NextFunction } from 'express';
import { AppException } from '../exceptions/AppException';
import { User } from '../models/user.model';

export const checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req?.user?.id;
            if (!userId) {
                throw new AppException('Unauthorized', 401, 'UNAUTHORIZED');
            }

            const user = await User.findById(userId)
                .populate({
                    path: 'roles',
                    populate: {
                        path: 'permissions'
                    }
                });

            if (!user) {
                throw new AppException('User not found', 404, 'USER_NOT_FOUND');
            }

            const hasPermission = user.roles.some(role => 
                role.permissions.some(permission => 
                    permission.code === requiredPermission
                )
            );

            if (!hasPermission) {
                throw new AppException('Forbidden', 403, 'FORBIDDEN');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}; 