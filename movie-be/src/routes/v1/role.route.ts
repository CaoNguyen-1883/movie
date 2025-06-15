import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { roleValidation } from '@/validations/role.validation';
import { roleController } from '@/controllers/role.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('MANAGE_ROLES'), validate(roleValidation.createRole), roleController.createRole)
  .get(auth('MANAGE_ROLES'), roleController.getRoles);

router
  .route('/:roleId')
  .get(auth('MANAGE_ROLES'), validate(roleValidation.getRole), roleController.getRole)
  .patch(auth('MANAGE_ROLES'), validate(roleValidation.updateRole), roleController.updateRole)
  .delete(auth('MANAGE_ROLES'), validate(roleValidation.deleteRole), roleController.deleteRole);

export default router; 