import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReview, getReviewsByMovie } from '@/services/reviewApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewForm } from './ReviewForm';
import { Button } from '../ui/button';
// import { useState } from 'react';
import type { Review } from '@/types/review';

interface ReviewSectionProps {
  movieId: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export function ReviewSection({ movieId }: ReviewSectionProps) {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reviews', movieId],
    queryFn: () => getReviewsByMovie(movieId),
    enabled: !!movieId,
  });

  const { user } = useAuth();
  const queryClient = useQueryClient();
  // const [isEditing, setIsEditing] = useState(false);

  // Find the user's existing review, if any
  // Important: Only try to find a review if the user is logged in
  const existingReview = user?._id
    ? reviews?.find((review) => {
        return review.user._id === user._id;
      })
    : undefined;

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
    }
  });

  const handleDelete = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      deleteMutation.mutate(reviewId);
    }
  }
  
  // const handleEditToggle = () => setIsEditing(!isEditing);

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (isError) {
    return <div>Error loading reviews.</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">Reviews ({reviews?.length ?? 0})</h2>
      
      {user && (
        <div className="mb-8 p-6 border rounded-lg">
           <h3 className="text-xl font-semibold mb-4">
             {existingReview ? 'Edit Your Review' : 'Write a Review'}
           </h3>
          <ReviewForm 
            movieId={movieId} 
            existingReview={existingReview}
          />
        </div>
      )}

      <div className="space-y-8">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <div key={review._id} className="flex items-start space-x-4 relative group">
              <Avatar>
                <AvatarImage src={review.user.avatarUrl} alt={review.user.fullName || review.user.username} />
                <AvatarFallback>
                  {(review.user.fullName || review.user.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.user.fullName || review.user.username}</p>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-foreground/90">{review.comment}</p>
              </div>
              {user?._id === review.user._id && (
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(review._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to write one!</p>
        )}
      </div>
    </div>
  );
} 