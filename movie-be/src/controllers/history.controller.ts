import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import historyService from '@/services/history.service';
import { AppError } from '@/utils/AppError';

class HistoryController {
  public getMyHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required.', httpStatus.UNAUTHORIZED);
      }
      const userId = req.user._id;
      const history = await historyService.getHistoryForUser(userId.toString());
      res.status(httpStatus.OK).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };

  public getMyHistoryForMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required.', httpStatus.UNAUTHORIZED);
      }
      const userId = req.user._id;
      const { movieId } = req.params;
      const historyRecord = await historyService.getHistoryForMovie(userId.toString(), movieId);
      res.status(httpStatus.OK).json({
        success: true,
        data: historyRecord,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateMyHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required.', httpStatus.UNAUTHORIZED);
      }
      const userId = req.user._id;
      const { movieId, progress, isFinished } = req.body;
      const updatedHistory = await historyService.updateHistory(userId.toString(), movieId, progress, isFinished);
      res.status(httpStatus.OK).json({
        success: true,
        message: 'History updated successfully.',
        data: updatedHistory,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteMyHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required.', httpStatus.UNAUTHORIZED);
      }
      const userId = req.user._id;
      const { historyId } = req.params;
      await historyService.deleteHistory(userId.toString(), historyId);
      res.status(httpStatus.OK).json({
        success: true,
        message: 'History record deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new HistoryController(); 