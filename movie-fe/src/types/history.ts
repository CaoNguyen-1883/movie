import type { Movie } from './movie';

interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

export interface History extends TimeStamps {
  _id: string;
  user: string; // User ID
  movie: Movie | string; // Movie object or Movie ID
  progress: number; // in seconds
  watchedAt: string; // Date string
  isFinished: boolean;
} 