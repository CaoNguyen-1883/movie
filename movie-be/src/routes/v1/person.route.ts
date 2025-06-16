import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { personController } from '@/controllers/person.controller';
import { PermissionType } from '@/interfaces/permission.interface';

const router = express.Router();

router
  .route('/')
  .post(auth(PermissionType.CREATE_PEOPLE), personController.createPerson)
  .get(auth(PermissionType.READ_PEOPLE), personController.getPeople);

router
  .route('/:personId')
  .get(auth(PermissionType.READ_PEOPLE), personController.getPerson)
  .patch(auth(PermissionType.UPDATE_PEOPLE), personController.updatePerson)
  .delete(auth(PermissionType.DELETE_PEOPLE), personController.deletePerson);

export default router; 