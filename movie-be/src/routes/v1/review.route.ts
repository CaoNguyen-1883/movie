import { Router } from 'express';
import { auth } from '@/middleware/auth.middleware';
import { reviewController } from '@/controllers/review.controller';
import { PermissionType } from '@/interfaces/permission.interface';

const reviewRoute = Router();

// For public consumption, no auth needed
reviewRoute.get('/movie/:movieId', reviewController.getReviewsByMovie);

// Logged-in users can create a review
reviewRoute
  .route('/')
  .post(auth(PermissionType.CREATE_OWN_REVIEW), reviewController.createReview);

reviewRoute
  .route('/:reviewId')
  // Users can update their own reviews, but we check ownership in the service layer
  .patch(auth(PermissionType.EDIT_OWN_REVIEW), reviewController.updateReview)
  // Admins can delete any review, users can delete their own (logic in service)
  .delete(
    auth(PermissionType.DELETE_OWN_REVIEW, PermissionType.DELETE_ANY_REVIEW),
    reviewController.deleteReview
  );

// For logged-in users to see their own reviews
reviewRoute.get('/me', auth(PermissionType.READ_OWN_REVIEWS), reviewController.getMyReviews);

export default reviewRoute; 