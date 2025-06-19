import httpStatus from 'http-status';
import User from '@/models/user.model';
import { IUser, IUserMethods } from '@/interfaces/user.interface';
import { Token } from '@/models/token.model';
import { AppError } from '@/utils/AppError';
import { tokenService } from './token.service';
import { TokenTypes } from '@/config/tokens';
import Role from '@/models/role.model';
import { Types } from 'mongoose';

/**
 * Login with username/email and password.
 * @param {string} emailOrUsername - The user's email or username.
 * @param {string} password - The user's password.
 * @returns {Promise<IUser>} The user object if login is successful.
 * @throws {AppError} If login fails.
 */
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email }).select('+password').populate({
    path: 'roles',
    populate: {
      path: 'permissions',
      model: 'Permission'
    }
  });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', httpStatus.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError('User account is disabled', httpStatus.FORBIDDEN);
  }

  user.password = undefined;

  return user;
};

/**
 * Logout a user.
 * @param {string} refreshToken - The refresh token to invalidate.
 * @returns {Promise<void>}
 * @throws {AppError} If refresh token is not found.
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ 
    token: refreshToken, 
    type: TokenTypes.REFRESH, 
    blacklisted: false 
  });
  if (!refreshTokenDoc) {
    throw new AppError('Refresh token not found', httpStatus.NOT_FOUND);
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh authentication tokens.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<object>} A new set of auth tokens.
 * @throws {AppError} If refresh token is invalid or user not found.
 */
const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenTypes.REFRESH);
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new AppError('User not found', httpStatus.NOT_FOUND);
    }
    await refreshTokenDoc.deleteOne();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new AppError('Invalid refresh token', httpStatus.UNAUTHORIZED);
  }
};

const changePassword = async (userId: Types.ObjectId, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await (user as IUser & IUserMethods).isPasswordMatch(currentPassword))) {
    throw new AppError('Incorrect current password', httpStatus.UNAUTHORIZED);
  }

  // User model's pre-save hook will hash the new password
  user.password = newPassword;
  await user.save();
};

export const authService = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  changePassword,
}; 