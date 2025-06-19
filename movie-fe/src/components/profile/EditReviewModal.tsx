import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { PopulatedReview } from '@/types/review';
import { updateReview, type UpdateReviewPayload } from '@/services/reviewApi';
import { Star } from 'lucide-react';
import { useState } from 'react';

const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface EditReviewModalProps {
  review: PopulatedReview;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditReviewModal({ review, isOpen, onOpenChange }: EditReviewModalProps) {
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: review.rating,
      comment: review.comment || '',
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: UpdateReviewPayload) => updateReview(review._id, data),
    onSuccess: () => {
      alert('Review updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      onOpenChange(false);
    },
    onError: (error) => {
      alert(`Error updating review: ${error.message}`);
    },
  });

  const onSubmit = (values: ReviewFormValues) => {
    editMutation.mutate(values);
  };

  const currentRating = form.watch('rating');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your review for {review.movie.title}</DialogTitle>
          <DialogDescription>
            Update your rating and comment below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <Star
                            key={ratingValue}
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              ratingValue <= (hoverRating || currentRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() => field.onChange(ratingValue)}
                            onMouseEnter={() => setHoverRating(ratingValue)}
                            onMouseLeave={() => setHoverRating(0)}
                          />
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us more about your experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={editMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={editMutation.isPending}>
                {editMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 