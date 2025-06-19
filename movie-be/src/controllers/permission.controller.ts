import { Request, Response } from 'express';
import { permissionService } from '@/services/permission.service';
import { catchAsync } from '@/utils/catchAsync';

const getPermissions = catchAsync(async (req: Request, res: Response) => {
  const permissions = await permissionService.getPermissions();
  res.send({
    success: true,
    data: permissions,
  });
});

export const permissionController = {
  getPermissions,
}; 