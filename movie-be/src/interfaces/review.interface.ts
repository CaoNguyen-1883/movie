import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId; // Ref to User
  movie: Types.ObjectId; // Ref to Movie
  rating: number;
  comment?: string;
} 