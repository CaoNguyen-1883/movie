import { Types } from 'mongoose';
import History from '@/models/history.model';
import { IHistory } from '@/interfaces/history.interface';
import { AppError } from '@/utils/AppError';
import httpStatus from 'http-status';

class HistoryService {
  /**
   * Get all viewing history for a specific user
   * @param userId - The ID of the user
   * @returns A list of history records
   */
  public async getHistoryForUser(userId: string): Promise<IHistory[]> {
    const history = await History.find({ user: userId })
      .populate('movie', 'title posterUrl slug genres')
      .sort({ watchedAt: -1 });
    return history;
  }

  /**
   * Get viewing history for a specific movie for a specific user
   * @param userId - The ID of the user
   * @param movieId - The ID of the movie
   * @returns A single history record or null
   */
  public async getHistoryForMovie(userId: string, movieId: string): Promise<IHistory | null> {
    const historyRecord = await History.findOne({ user: userId, movie: movieId }).populate('movie', 'title poster');
    return historyRecord;
  }

  /**
   * Create or Update a history record.
   * Uses findOneAndUpdate with 'upsert' to create a new document if one doesn't exist.
   * @param userId - The ID of the user
   * @param movieId - The ID of the movie
   * @param progress - The progress in seconds
   * @param isFinished - Whether the movie is finished
   * @returns The created or updated history record
   */
  public async updateHistory(
    userId: string,
    movieId: string,
    progress: number,
    isFinished: boolean,
  ): Promise<IHistory> {
    const updateData = {
      user: userId,
      movie: movieId,
      progress,
      isFinished,
      watchedAt: new Date(), // Explicitly set watchedAt on update
    };

    const historyRecord = await History.findOneAndUpdate({ user: userId, movie: movieId }, updateData, {
      new: true, // Return the updated document
      upsert: true, // Create a new doc if no match is found
      setDefaultsOnInsert: true, // Apply schema defaults on insert
    }).populate('movie', 'title poster');

    if (!historyRecord) {
      // This should theoretically not be reached due to upsert: true
      throw new AppError('Could not update or create history record.', httpStatus.INTERNAL_SERVER_ERROR);
    }

    return historyRecord;
  }

  /**
   * Delete a history record for a user and movie.
   * @param userId - The ID of the user
   * @param historyId - The ID of the history record
   * @returns The deleted history record or null if not found
   */
  public async deleteHistory(userId: string, historyId: string): Promise<IHistory> {
    // Ensure the history record belongs to the user trying to delete it
    const historyRecord = await History.findOneAndDelete({ _id: historyId, user: userId });
    if (!historyRecord) {
      throw new AppError('History record not found or you do not have permission to delete it.', httpStatus.NOT_FOUND);
    }
    return historyRecord as unknown as IHistory;
  }
}

export default new HistoryService(); 