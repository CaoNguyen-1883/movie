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
import { IPermission } from '@/interfaces/permission.interface';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
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
    // Deep populate user's roles and the permissions within those roles
    const user = await User.findById(payload.sub).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    });
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
export const auth =
  (...requiredPermissions: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, async (err: Error, user: IUser, info: any) => {
      try {
        if (err || info || !user) {
          return next(new AppError('Please authenticate', httpStatus.UNAUTHORIZED));
        }

        req.user = user;

        if (requiredPermissions.length > 0) {
          const userPermissionNames = new Set<string>();
          const populatedRoles = user.roles as unknown as IRole[];

          if (populatedRoles && Array.isArray(populatedRoles)) {
            populatedRoles.forEach((role) => {
              if (role.permissions && Array.isArray(role.permissions)) {
                // After deep population, each element is a full IPermission object.
                // We can directly access the name property.
                role.permissions.forEach((permission) => {
                  // Cast to unknown first, then to IPermission to satisfy TypeScript
                  userPermissionNames.add((permission as unknown as IPermission).name);
                });
              }
            });
          }

          const hasRequiredPermissions = requiredPermissions.every((requiredPerm) =>
            userPermissionNames.has(requiredPerm)
          );

          if (!hasRequiredPermissions) {
            const message = `Forbidden: You do not have the required permission(s): ${requiredPermissions.join(
              ', '
            )}`;
            return next(new AppError(message, httpStatus.FORBIDDEN));
          }
        }

        return next();
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }; 