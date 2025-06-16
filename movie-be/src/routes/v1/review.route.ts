import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { reviewController } from '@/controllers/review.controller';
import { PermissionType } from '@/interfaces/permission.interface';
// import { validate } from '@/middleware/validate.middleware';
// import { reviewValidation } from '@/validations/review.validation';

const router = express.Router();

// Anyone with the permission can get reviews for a movie
router.route('/movie/:movieId').get(auth(PermissionType.READ_REVIEWS), reviewController.getReviewsByMovie);

// Logged-in users can create a review
router.route('/').post(auth(PermissionType.CREATE_OWN_REVIEW), reviewController.createReview);

router
  .route('/:reviewId')
  // Users can update their own reviews, but we check ownership in the service layer
  .patch(auth(PermissionType.CREATE_OWN_REVIEW), reviewController.updateReview)
  // Admins can delete any review, users can delete their own (logic in service)
  .delete(
    auth(PermissionType.CREATE_OWN_REVIEW, PermissionType.DELETE_ANY_REVIEW),
    reviewController.deleteReview
  );

export default router; 