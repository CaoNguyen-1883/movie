import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';
import { catchAsync } from '../utils/catchAsync';
import { IUser } from '@/interfaces/user.interface';
import config from '@/config/config';
import User from '@/models/user.model';

/**
 * Handles the registration of a new local user.
 */
const register = catchAsync(async (req: Request, res: Response) => {
  // By default, new registrations are assigned the 'USER' role in the service
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'User registered successfully.',
    data: { user, tokens },
  });
});

/**
 * Handles user login with email and password.
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({
    success: true,
    message: 'Login successful.',
    data: { user, tokens },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Logout successful.',
  });
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({
    success: true,
    message: 'Tokens refreshed successfully.',
    data: { ...tokens },
  });
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const googleUser = req.user as IUser;

  // Re-fetch the user from the database to apply the necessary population
  const user = await User.findById(googleUser._id).populate({
    path: 'roles',
    populate: {
      path: 'permissions',
      model: 'Permission'
    }
  });

  if (!user) {
    // This should ideally not happen if the passport strategy is correct
    return res.redirect(`${config.clientUrl}/auth?error=UserNotFound`);
  }

  const tokens = await tokenService.generateAuthTokens(user);

  // Convert user object to a JSON string, then encode it in Base64
  const userString = JSON.stringify(user.toJSON());
  const encodedUser = Buffer.from(userString).toString('base64');

  // Construct the redirect URL with all necessary parameters
  const redirectUrl = new URL(`${config.clientUrl}/auth/google/callback`);
  redirectUrl.searchParams.set('accessToken', tokens.access.token);
  redirectUrl.searchParams.set('refreshToken', tokens.refresh.token);
  redirectUrl.searchParams.set('user', encodedUser); // Send the Base64 encoded user

  res.redirect(redirectUrl.toString());
});

export const authController = {
  register,
  login,
  logout,
  refreshTokens,
  googleCallback,
};
