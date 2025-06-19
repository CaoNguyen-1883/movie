import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReview, getMyReviews } from '@/services/reviewApi';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { MovieCard } from '@/components/common/MovieCard';
import type { Review, PopulatedReview } from '@/types/review';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditReviewModal } from './EditReviewModal';

export function UserReviewsTab() {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['myReviews'],
    queryFn: getMyReviews,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[450px]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Lỗi!</AlertTitle>
        <AlertDescription>Không thể tải các đánh giá của bạn. Vui lòng thử lại sau.</AlertDescription>
      </Alert>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Chưa có đánh giá</AlertTitle>
        <AlertDescription>Bạn chưa viết đánh giá cho bộ phim nào.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {reviews
        .filter(
          (review): review is PopulatedReview =>
            typeof review.movie === 'object' && review.movie !== null
        )
        .map((review: PopulatedReview) => (
          <ReviewItem key={review._id} review={review} />
        ))}
    </div>
  );
}

function ReviewItem({ review }: { review: PopulatedReview }) {
  const { movie } = review;
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteReview(review._id),
    onSuccess: () => {
      alert('Review deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      alert(`Error deleting review: ${error.message}`);
      setIsDeleteDialogOpen(false);
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <Link to={`/movie/${movie.slug}`}>
            <CardTitle className="hover:underline">{movie.title}</CardTitle>
          </Link>
          <CardDescription>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>
                {review.rating}/10 -{' '}
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            Sửa
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Đánh giá của bạn sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditReviewModal
        review={review}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
} 