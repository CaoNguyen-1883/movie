import type { User } from './user';
import type { Movie } from './movie';

export interface History {
  _id: string;
  user: User;
  movie: Movie;
  progress: number; // e.g., in seconds
  watchedAt: string;
} 