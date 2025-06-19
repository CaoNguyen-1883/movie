import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/services/movieApi';
import { MovieCard } from '@/components/common/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroBanner } from '@/components/common/HeroBanner';

const MovieSection = ({ title, movies, isLoading }: { title: string; movies: any; isLoading: boolean }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {isLoading ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-80" />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies?.results.map((movie: any) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
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
    <div>
      <HeroBanner />
      <div className="container mx-auto py-8">
        <MovieSection title="Now Showing" movies={nowShowingMovies} isLoading={isLoadingNowShowing} />
        <MovieSection title="Coming Soon" movies={comingSoonMovies} isLoading={isLoadingComingSoon} />
      </div>
    </div>
  );
};

export default HomePage; 