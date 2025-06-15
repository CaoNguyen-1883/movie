import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { userService } from '@/services/user.service';
import { catchAsync } from '@/utils/catchAsync';
import { pick } from '@/utils/pick';
import { AppError } from '@/utils/AppError';
import { IUser } from '@/models/user.model';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['username', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.findUserById(req.params.userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  res.send(user);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  // The 'auth' middleware ensures req.user is defined.
  res.send(req.user);
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  // The 'auth' middleware ensures req.user is defined.
  // We explicitly cast req.user to IUser to resolve the stubborn compiler error.
  const userId = (req.user as IUser)._id;
  const user = await userService.updateUserById(userId.toString(), req.body);
  res.send(user);
});

export const userController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
}; 