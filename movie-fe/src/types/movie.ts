// A simplified version based on movie.interface.ts
// We can expand this as needed.

import type { Genre } from './genre';
import type { Person } from './person';

export type MovieCast = Person;

export interface Movie {
  _id: string;
  title: string;
  slug: string;
  description: string;
  releaseDate: string; // ISO String date
  duration: number; // in minutes
  posterUrl?: string;
  backdropUrls?: string[];
  trailerUrl?: string;
  videoUrl?: string;
  genres: Genre[];
  cast: MovieCast[];
  directors: Person[];
  averageRating: number;
  status: 'COMING_SOON' | 'NOW_SHOWING' | 'RELEASED';
  createdAt?: string;
  updatedAt?: string;
} 