import { useQuery } from '@tanstack/react-query';
import { getMyHistory } from '@/services/historyApi';
import { MovieCard } from '@/components/common/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { History } from '@/types/history';
import type { Movie } from '@/types/movie';

export const UserHistoryTab = () => {
  // The API likely returns History[] directly, not a paginated object
  const { data: historyItems, isLoading, isError, error } = useQuery<History[]>({
    queryKey: ['myHistory'],
    queryFn: () => getMyHistory({ limit: 50 }) as any, // Cast to any to bypass PaginatedResponse type mismatch in api fn
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p>Error loading history: {error.message}</p>;
  }
  
  if (!historyItems || historyItems.length === 0) {
    return <p>You haven't watched any movies yet.</p>;
  }


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {historyItems
        .filter((historyItem): historyItem is History & { movie: Movie } => 
          typeof historyItem.movie === 'object' && historyItem.movie !== null
        )
        .map((historyItem) => (
        <MovieCard key={historyItem._id} movie={historyItem.movie}>
          {historyItem.progress > 0 && !historyItem.isFinished && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-500/50">
              <div 
                className="h-full bg-red-600"
                style={{ width: `${(historyItem.progress / (historyItem.movie.duration * 60)) * 100}%`}}
              />
            </div>
          )}
        </MovieCard>
      ))}
    </div>
  );
}; 