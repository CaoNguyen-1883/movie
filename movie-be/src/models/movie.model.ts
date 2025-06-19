import { model, Schema, Types, Document } from 'mongoose';
import slugify from 'slugify';
import { IMovie, IMovieCast } from '@/interfaces/movie.interface';

const MovieCastSchema = new Schema<IMovieCast>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    characterName: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    posterUrl: String,
    backdropUrls: [String],
    trailerUrl: String,
    videoUrl: String,
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
    cast: [MovieCastSchema],
    directors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Person',
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ['COMING_SOON', 'NOW_SHOWING', 'RELEASED'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to generate slug from title
MovieSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Movie = model<IMovie>('Movie', MovieSchema);
export default Movie; 