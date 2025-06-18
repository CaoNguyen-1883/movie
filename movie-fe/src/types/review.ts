import type { User } from './user';
import type { Movie } from './movie';

export interface Review {
  _id: string;
  user: User;
  movie: Movie;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
} 