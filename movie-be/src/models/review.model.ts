import { model, Schema, Types } from 'mongoose';
import { IReview } from '@/interfaces/review.interface';
import Movie from '@/models/movie.model';

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Add index for faster queries
ReviewSchema.index({ movie: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.calculateAverageRating = async function (movieId: Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { movie: movieId },
    },
    {
      $group: {
        _id: '$movie',
        numRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: stats[0].avgRating,
    });
  } else {
    // If no reviews, reset to 0
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: 0,
    });
  }
};

// Hook to update average rating on save
ReviewSchema.post('save', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.constructor as any).calculateAverageRating(this.movie);
});

// Hook to update average rating on remove (or findByIdAndUpdate/Delete with { new: true })
// Need to get the movie ID *before* the document is removed.
ReviewSchema.pre('findOneAndDelete', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this as any)._doc = await this.model.findOne(this.getFilter());
  next();
});

ReviewSchema.post('findOneAndDelete', async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((this as any)._doc) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (this as any)._doc.constructor.calculateAverageRating((this as any)._doc.movie);
  }
});

const Review = model<IReview>('Review', ReviewSchema);

export default Review; 