import type { User } from './user';

interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

export interface Review extends TimeStamps {
  _id: string;
  user: User;
  movie: string; // Movie ID
  rating: number;
  comment?: string;
} 