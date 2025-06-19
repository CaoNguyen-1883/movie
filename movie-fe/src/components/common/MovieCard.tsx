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
        <Card className="overflow-hidden relative aspect-[2/3]">
            {/* Background Image */}
            <img
                src={movie.posterUrl || '/placeholder.png'}
                alt={movie.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay Content */}
            <CardContent className="absolute inset-0 p-0 flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="p-3 relative z-10">
                    <h3 className="text-white font-bold text-base leading-tight line-clamp-2">{movie.title}</h3>
                    {movie.genres?.[0] && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                        {movie.genres[0].name}
                    </Badge>
                    )}
                </div>
                 {children && <div className="relative z-10">{children}</div>}
            </CardContent>
        </Card>
        </Link>
    );
} 