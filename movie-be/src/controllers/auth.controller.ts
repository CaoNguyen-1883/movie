import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';
import { catchAsync } from '../utils/catchAsync';

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

export const authController = {
  register,
  login,
  logout,
  refreshTokens,
};
