import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createReview, updateReview } from '@/services/reviewApi';
import type { Review } from '@/types/review';
import { useState } from 'react';

interface ReviewFormProps {
  movieId: string;
  existingReview?: Review | null;
  onSuccess?: () => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ReviewForm({ movieId, existingReview, onSuccess }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating ?? 0,
      comment: existingReview?.comment ?? '',
    },
  });

  const currentRating = watch('rating');

  const mutation = useMutation({
    mutationFn: (data: ReviewFormData) => {
      if (existingReview) {
        return updateReview(existingReview._id, data);
      } else {
        return createReview({ ...data, movieId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      if (onSuccess) {
        onSuccess();
      }
      if (!existingReview) {
        reset({ rating: 0, comment: '' });
      }
    },
    onError: (error) => {
      console.error('Failed to submit review:', error);
      // Here you could set a form error using `setError`
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <Star
                key={ratingValue}
                className={cn(
                  'h-8 w-8 cursor-pointer',
                  ratingValue <= (hoverRating || currentRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                )}
                onClick={() => setValue('rating', ratingValue, { shouldValidate: true })}
                onMouseEnter={() => setHoverRating(ratingValue)}
              />
            );
          })}
        </div>
        {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
        {/* Hidden input to register the rating field with react-hook-form */}
        <input type="hidden" {...register('rating')} />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Your Comment
        </label>
        <Textarea
          id="comment"
          {...register('comment')}
          placeholder="What did you think of the movie?"
          className="mt-1"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
      </Button>
    </form>
  );
} 