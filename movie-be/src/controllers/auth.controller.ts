import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '@/services/user.service';
import { authService } from '@/services/auth.service';
import { tokenService } from '@/services/token.service';
import { catchAsync } from '@/utils/catchAsync';

/**
 * Handles the registration of a new local user.
 */
const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerLocalUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  
  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  res.status(httpStatus.CREATED).send({ user: userResponse, tokens });
});

/**
 * Handles user login with email and password.
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  res.send({ user: userResponse, tokens });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send(tokens);
});

export const authController = {
  register,
  login,
  logout,
  refreshTokens,
};
