import { Document, Types } from 'mongoose';

export interface IHistory extends Document {
  user: Types.ObjectId; // Ref to User
  movie: Types.ObjectId; // Ref to Movie
  progress: number; // in seconds
  watchedAt: Date;
  isFinished: boolean;
} 