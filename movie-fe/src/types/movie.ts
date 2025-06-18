// A simplified version based on movie.interface.ts
// We can expand this as needed.

export interface Movie {
  _id: string;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  posterUrl: string;
  backdropUrl: string;
  genres: any[]; // Replace with Genre type later
  cast: any[]; // Replace with Person type later
  crew: any[]; // Replace with Person type later
  trailerUrl?: string;
  tmdbId: number;
  slug: string;
} 