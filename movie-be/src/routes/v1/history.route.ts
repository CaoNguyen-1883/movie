import { Router } from 'express';
import historyController from '@/controllers/history.controller';
import { PermissionType } from '@/interfaces/permission.interface';
import { auth } from '@/middleware/auth.middleware';

const router = Router();

// Route to get all of my history records
router.get(
  '/',
  auth(PermissionType.READ_OWN_HISTORY),
  historyController.getMyHistory,
);

// Route to get my history for a specific movie
router.get(
  '/movie/:movieId',
  auth(PermissionType.READ_OWN_HISTORY),
  historyController.getMyHistoryForMovie,
);

// Route to update (create or edit) my history for a movie
router.put(
  '/',
  auth(PermissionType.UPDATE_OWN_HISTORY),
  historyController.updateMyHistory,
);

// Route to delete a history record
router.delete(
  '/:historyId',
  auth(PermissionType.DELETE_OWN_HISTORY),
  historyController.deleteMyHistory,
);

export default router; 