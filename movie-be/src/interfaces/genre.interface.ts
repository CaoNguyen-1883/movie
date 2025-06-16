import { Document } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  description?: string;
} 