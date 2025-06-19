import { catchAsync } from '../utils/catchAsync';
import { dashboardService } from '../services/dashboard.service';

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.send(stats);
});

export const dashboardController = {
  getDashboardStats,
}; 