import type { Movie } from './movie';
import type { User } from './user';

interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

export interface Review extends TimeStamps {
  _id: string;
  user: User;
  movie: Movie;
  rating: number;
  comment?: string;
}

export interface PopulatedReview extends Omit<Review, 'movie'> {
  movie: Movie;
} 