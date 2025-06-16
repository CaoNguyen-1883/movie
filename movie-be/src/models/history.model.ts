import { model, Schema } from 'mongoose';
import { IHistory } from '@/interfaces/history.interface';

const HistorySchema = new Schema<IHistory>(
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
    progress: {
      type: Number,
      required: true,
      default: 0,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // will add createdAt and updatedAt
  },
);

// To ensure each user has only one history entry per movie
HistorySchema.index({ user: 1, movie: 1 }, { unique: true });

// Update watchedAt timestamp before saving
HistorySchema.pre('save', function (next) {
  this.watchedAt = new Date();
  next();
});


const History = model<IHistory>('History', HistorySchema);
export default History; 