import { model, Schema } from 'mongoose';
import { IGenre } from '@/interfaces/genre.interface';

const GenreSchema = new Schema<IGenre>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Genre = model<IGenre>('Genre', GenreSchema);
export default Genre; 