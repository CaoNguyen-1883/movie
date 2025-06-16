import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import httpStatus from 'http-status';
import config from '@/config/config';
import User from '@/models/user.model';
import { IUser } from '@/interfaces/user.interface';
import { IRole } from '@/interfaces/role.interface';
import { AppError } from '@/utils/AppError';
import { TokenTypes } from '@/config/tokens';
import { Request, Response, NextFunction } from 'express';
import Permission from '@/models/permission.model';
import { Types } from 'mongoose';

const jwtOptions = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/**
 * JWT verification callback.
 * This function is called when a token has been verified.
 * It finds the user by ID and populates their role information.
 * @param {object} payload - The decoded JWT payload.
 * @param {function} done - The callback to pass control to the next middleware.
 */
const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== TokenTypes.ACCESS) {
      return done(new AppError('Invalid token type', httpStatus.UNAUTHORIZED), false);
    }
    // Find user and populate their roles
    const user = await User.findById(payload.sub).populate('roles');
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

/**
 * Middleware to authenticate requests using JWT.
 * It also provides a callback to check for required permissions against the user's populated role.
 * @param {...string} requiredPermissions - The list of required permissions.
 * @returns An authentication middleware.
 */
export const auth = (...requiredPermissions: string[]) => (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, async (err: Error, user: IUser, info: any) => {
    try {
      if (err || info || !user) {
        return next(new AppError('Please authenticate', httpStatus.UNAUTHORIZED));
      }

      req.user = user;

      if (requiredPermissions.length) {
        const userPermissionIds = new Set<string>();
        // After .populate('roles'), user.roles is an array of IRole objects
        const populatedRoles = user.roles as unknown as IRole[];

        if (populatedRoles && Array.isArray(populatedRoles)) {
          populatedRoles.forEach((role) => {
            if (role.permissions && Array.isArray(role.permissions)) {
              role.permissions.forEach((permissionId: Types.ObjectId) => {
                userPermissionIds.add(permissionId.toString());
              });
            }
          });
        }

        const requiredPermsDocs = await Permission.find({ name: { $in: requiredPermissions } });

        if (requiredPermsDocs.length !== requiredPermissions.length) {
          // This indicates a misconfiguration in a route's required permissions
          return next(new AppError('Invalid permission defined for this route', httpStatus.INTERNAL_SERVER_ERROR));
        }

        const hasRequiredPermissions = requiredPermsDocs.length > 0 && requiredPermsDocs.some((perm) => userPermissionIds.has(perm._id.toString()));

        if (!hasRequiredPermissions) {
          const message = `Forbidden: You do not have the required permission(s): ${requiredPermissions.join(', ')}`;
          return next(new AppError(message, httpStatus.FORBIDDEN));
        }
      }

      return next();
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}; 