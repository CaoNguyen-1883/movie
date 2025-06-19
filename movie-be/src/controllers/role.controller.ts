import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { roleService } from '@/services/role.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

const createRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Role created successfully.',
    data: role,
  });
});

const getRoles = catchAsync(async (req: Request, res: Response) => {
  const roles = await roleService.getRoles();
  res.send({
    success: true,
    data: roles,
  });
});

const getRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new AppError('Role not found', httpStatus.NOT_FOUND);
  }
  res.send({
    success: true,
    data: role,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  res.send({
    success: true,
    message: 'Role updated successfully.',
    data: role,
  });
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
  await roleService.deleteRoleById(req.params.roleId);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Role deleted successfully.',
  });
});

export const roleController = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
}; 