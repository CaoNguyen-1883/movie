import Movie from '@/models/movie.model';
import User from '@/models/user.model';

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalMovies = await Movie.countDocuments();
  // We can add more stats here later
  return {
    totalUsers,
    totalMovies,
  };
};

export const dashboardService = {
  getDashboardStats,
}; 