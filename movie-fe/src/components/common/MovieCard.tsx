import { Link } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: Movie;
  children?: React.ReactNode;
}

export function MovieCard({ movie, children }: MovieCardProps) {
    return (
        <Link to={`/movie/${movie.slug}`} className="block group">
        <Card className="overflow-hidden h-full">
            <CardContent className="p-0 relative">
            <img
                src={movie.posterUrl || '/placeholder.png'}
                alt={movie.title}
                className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3">
                <h3 className="text-white font-bold text-base leading-tight line-clamp-2">{movie.title}</h3>
                {movie.genres?.[0] && (
                <Badge variant="secondary" className="mt-2 text-xs">
                    {movie.genres[0].name}
                </Badge>
                )}
            </div>
            {children}
            </CardContent>
        </Card>
        </Link>
    );
} 