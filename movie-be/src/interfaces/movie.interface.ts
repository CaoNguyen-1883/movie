import { Document, Types } from 'mongoose';

export interface IMovieCast {
  actor: Types.ObjectId; // Ref to Person
  characterName: string;
}

export interface IMovie extends Document {
  title: string;
  slug: string; // for SEO friendly urls
  description: string;
  releaseDate: Date;
  duration: number; // in minutes
  posterUrl?: string;
  trailerUrl?: string;
  videoUrl?: string;
  genres: Types.ObjectId[]; // Ref to Genre
  cast: IMovieCast[];
  directors: Types.ObjectId[]; // Ref to Person
  averageRating: number;
  status: 'COMING_SOON' | 'NOW_SHOWING' | 'RELEASED';
} 