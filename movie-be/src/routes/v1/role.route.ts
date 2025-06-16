import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { roleValidation } from '@/validations/role.validation';
import { roleController } from '@/controllers/role.controller';
import { PermissionType } from '@/interfaces/permission.interface';

const router = express.Router();

router
  .route('/')
  .post(auth(PermissionType.CREATE_ROLES), validate(roleValidation.createRole), roleController.createRole)
  .get(auth(PermissionType.READ_ROLES), roleController.getRoles);

router
  .route('/:roleId')
  .get(auth(PermissionType.READ_ROLES), validate(roleValidation.getRole), roleController.getRole)
  .patch(auth(PermissionType.UPDATE_ROLES), validate(roleValidation.updateRole), roleController.updateRole)
  .delete(auth(PermissionType.DELETE_ROLES), validate(roleValidation.deleteRole), roleController.deleteRole);

export default router;