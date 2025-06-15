import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import httpStatus from 'http-status';
import config from '@/config/config';
import { User, IUser } from '@/models/user.model';
import { IRole } from '@/models/role.model';
import { AppError } from '@/utils/AppError';
import { TokenTypes } from '@/config/tokens';
import { Request, Response, NextFunction } from 'express';

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
    // Find user and eager-load their role information
    const user = await User.findById(payload.sub).populate('role');
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
  passport.authenticate('jwt', { session: false }, (err: Error, user: IUser, info: any) => {
    if (err || info || !user) {
      return next(new AppError('Please authenticate', httpStatus.UNAUTHORIZED));
    }

    // Attach user to the request object
    req.user = user;

    if (requiredPermissions.length) {
      // user.role is now a populated Role document because of `.populate('role')` in jwtVerify
      const userPermissions = (user.role as IRole)?.permissions || [];
      const hasRequiredPermissions = requiredPermissions.every((requiredPermission) =>
        userPermissions.includes(requiredPermission)
      );

      if (!hasRequiredPermissions) {
        const message = `Forbidden: You need the following permission(s): ${requiredPermissions.join(', ')}`;
        return next(new AppError(message, httpStatus.FORBIDDEN));
      }
    }

    next();
  })(req, res, next);
}; 