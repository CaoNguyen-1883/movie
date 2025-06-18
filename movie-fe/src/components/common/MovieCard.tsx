import { Link } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movie/${movie.slug}`} className="block group">
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <img
            src={movie.posterUrl || '/placeholder.png'}
            alt={movie.title}
            className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-white font-bold text-lg leading-tight truncate">{movie.title}</h3>
            <div className="flex items-center mt-2 gap-2">
              <Badge variant="destructive">{movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}</Badge>
              {movie.genres[0] && <Badge variant="secondary">{movie.genres[0].name}</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 