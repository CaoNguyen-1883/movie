import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '@/utils/catchAsync';
import { reviewService } from '@/services/review.service';
import { IUser } from '@/interfaces/user.interface';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.body, req.user as IUser);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Review created successfully.',
    data: review,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const reviews = await reviewService.getReviewsByUserId(user._id);
  res.send({
    success: true,
    data: reviews,
  });
});

const getReviewsByMovie = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.getReviewsByMovie(req.params.movieId);
  res.send({
    success: true,
    data: reviews,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.updateReviewById(req.params.reviewId, req.body, req.user as IUser);
  res.send({
    success: true,
    message: 'Review updated successfully.',
    data: review,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await reviewService.deleteReviewById(req.params.reviewId, req.user as IUser);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Review deleted successfully.',
  });
});

export const reviewController = {
  createReview,
  getMyReviews,
  getReviewsByMovie,
  updateReview,
  deleteReview,
}; 