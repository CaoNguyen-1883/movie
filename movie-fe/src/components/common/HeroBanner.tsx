import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/services/movieApi';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export const HeroBanner = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies', { status: 'NOW_SHOWING', sortBy: 'createdAt:desc', limit: 5 }],
    queryFn: () => getMovies({ status: 'NOW_SHOWING', sortBy: 'createdAt:desc', limit: 5 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="w-full aspect-[16/7] rounded-none" />;
  }

  if (error || !movies || movies.results.length === 0) {
    return <div className="text-center py-10">Could not load featured movies.</div>;
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {movies.results.map((movie) => (
          <CarouselItem key={movie._id}>
            <div className="relative aspect-[16/7]">
              <img
                src={movie.backdropUrls?.[0] || 'https://via.placeholder.com/1280x720?text=No+Image'}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 max-w-3xl text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
                  {movie.title}
                </h1>
                <p className="mt-4 text-sm md:text-base line-clamp-3 drop-shadow-md">
                  {movie.description}
                </p>
                <Link to={`/movie/${movie.slug}`}>
                  <Button className="mt-6" size="lg">
                    Watch Now
                  </Button>
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}; 