import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/services/movieApi';
import { MovieCard } from '@/components/common/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';

const MovieSection = ({ title, movies, isLoading }: { title: string; movies: any; isLoading: boolean }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-6">{title}</h2>
    {isLoading ? (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-[450px] w-full" />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies?.results.map((movie: any) => <MovieCard key={movie._id} movie={movie} />)}
      </div>
    )}
  </section>
);

const HomePage = () => {
  const { data: nowShowingMovies, isLoading: isLoadingNowShowing } = useQuery({
    queryKey: ['movies', { status: 'NOW_SHOWING', limit: 10 }],
    queryFn: () => getMovies({ status: 'NOW_SHOWING', limit: 10 }),
  });

  const { data: comingSoonMovies, isLoading: isLoadingComingSoon } = useQuery({
    queryKey: ['movies', { status: 'COMING_SOON', limit: 10 }],
    queryFn: () => getMovies({ status: 'COMING_SOON', limit: 10 }),
  });

  return (
    <div className="container mx-auto py-8">
      <MovieSection title="Now Showing" movies={nowShowingMovies} isLoading={isLoadingNowShowing} />
      <MovieSection title="Coming Soon" movies={comingSoonMovies} isLoading={isLoadingComingSoon} />
    </div>
  );
};

export default HomePage; 