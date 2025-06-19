import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/services/movieApi';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export const HeroBanner = () => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies', { status: 'NOW_SHOWING', sortBy: 'createdAt:desc', limit: 5 }],
    queryFn: () => getMovies({ status: 'NOW_SHOWING', sortBy: 'createdAt:desc', limit: 5 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  if (isLoading) {
    return <Skeleton className="w-full aspect-[16/7] rounded-none" />;
  }

  if (error || !movies || movies.results.length === 0) {
    return <div className="text-center py-10">Could not load featured movies.</div>;
  }

  return (
    <div className="relative w-full" ref={emblaRef}>
      <div className="overflow-hidden">
        <div className="flex">
          {movies.results.map((movie) => (
            <div className="flex-[0_0_100%] relative aspect-[16/7]" key={movie._id}>
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
                <Link to={`/movies/${movie.slug}`}>
                  <Button className="mt-6" size="lg">
                    Watch Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.results.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              selectedIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}; 