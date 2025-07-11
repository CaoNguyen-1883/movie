import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { getMovieBySlug } from '@/services/movieApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, PlayCircle } from 'lucide-react';
import { VideoPlayerModal } from '@/components/common/VideoPlayerModal';
import type { Movie } from '@/types/movie';
import type { Genre } from '@/types/genre';
import type { Person } from '@/types/person';
import type { MovieCast } from '@/types/movie';
import { useAuth } from '@/contexts/AuthContext';
import { getHistoryForMovie, updateHistory } from '@/services/historyApi';
import { ReviewSection } from '@/components/common/ReviewSection';

const MovieDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery<Movie>({
    queryKey: ['movie', slug],
    queryFn: () => {
      if (!slug) throw new Error('Slug is required');
      return getMovieBySlug(slug);
    },
    enabled: !!slug,
  });

  // Query to get the viewing history for this movie
  const { data: historyData } = useQuery({
    // The query will re-run if the movie ID or user ID changes
    queryKey: ['history', movie?._id, user?._id], 
    queryFn: () => {
      if (!movie?._id) throw new Error('Movie ID is required');
      return getHistoryForMovie(movie._id);
    },
    // Only enable this query if we have a movie and a logged-in user
    enabled: !!movie?._id && !!user,
  });


  // Mutation to update the viewing history
  const { mutate: updateHistoryMutation } = useMutation({
    mutationFn: updateHistory,
    onSuccess: () => {
      // After a successful update, invalidate the history query to refetch the progress
      queryClient.invalidateQueries({ queryKey: ['history', movie?._id, user?._id] });
    },
  });

  const handlePlay = (type: 'trailer' | 'movie') => {
    if (!movie) return;

    if (type === 'trailer' && movie.trailerUrl) {
      setVideoUrl(movie.trailerUrl);
      setVideoTitle(`${movie.title} - Trailer`);
      setIsModalOpen(true);
    } else if (type === 'movie' && movie.videoUrl) {
      setVideoUrl(movie.videoUrl);
      setVideoTitle(movie.title);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVideoUrl('');
    setVideoTitle('');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-[50vh] rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <Skeleton className="w-full h-[550px] rounded-lg" />
          </div>
          <div className="md:col-span-2 flex flex-col space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div>
              <Skeleton className="h-8 w-32 mb-3" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">404 - Movie Not Found</h1>
        <p>The movie you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {movie.backdropUrls && movie.backdropUrls.length > 0 && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src={movie.backdropUrls[0]}
            alt={`${movie.title} backdrop`}
            className="w-full h-auto object-cover max-h-[50vh]"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="md:col-span-2 flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-lg text-muted-foreground">
              {new Date(movie.releaseDate).getFullYear()} &bull; {movie.duration}{' '}
              min
            </p>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre: Genre) => (
                <Badge key={genre._id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {historyData && (
             <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-secondary-foreground">Viewing Progress</h3>
                <p className="text-secondary-foreground/80">
                  {historyData.isFinished 
                    ? "You have finished watching this movie."
                    : `You are ${Math.round((historyData.progress / (movie.duration * 60)) * 100)}% into this movie.`
                  }
                </p>
                <progress 
                  className="w-full mt-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-violet-400 [&::-moz-progress-bar]:bg-violet-400" 
                  value={historyData.progress} 
                  max={movie.duration * 60}>
                </progress>
             </div>
          )}

          <div className="flex items-center space-x-4">
            {movie.trailerUrl && (
              <Button onClick={() => handlePlay('trailer')}>
                <PlayCircle className="mr-2 h-4 w-4" /> Watch Trailer
              </Button>
            )}
            {movie.videoUrl && (
              <Button onClick={() => handlePlay('movie')}>
                <Play className="mr-2 h-4 w-4" /> Watch Movie
              </Button>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3 border-b pb-2">
              Description
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {movie.description}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Release</h3>
            <p className="text-foreground/80">
              {new Date(movie.releaseDate).getFullYear()}
            </p>
          </div>

          {movie.directors && movie.directors.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Directors</h3>
              <p className="text-foreground/80">
                {movie.directors.map((d: Person) => d.name).join(', ')}
              </p>
            </div>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Cast</h3>
              <p className="text-foreground/80">
                {movie.cast.map((c: MovieCast) => c.actor.name).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoUrl={videoUrl}
        title={videoTitle}
        movieId={movie?._id}
        onProgressUpdate={updateHistoryMutation}
      />

      <hr className="my-12 border-t" />

      <ReviewSection movieId={movie._id} />

    </div>
  );
};

export default MovieDetailPage; 