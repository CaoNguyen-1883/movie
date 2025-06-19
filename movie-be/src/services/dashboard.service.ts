import Movie from '@/models/movie.model';
import User from '@/models/user.model';

const getDashboardStats = async () => {
  // Use aggregation to get multiple stats in one query for users
  const userStats = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: 'count' }],
        monthlySignups: [
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          {
            $project: {
              _id: 0,
              // Format date as 'YYYY-MM'
              name: {
                $concat: [
                  { $toString: '$_id.year' },
                  '-',
                  {
                    $cond: {
                      if: { $lt: ['$_id.month', 10] },
                      then: { $concat: ['0', { $toString: '$_id.month' }] },
                      else: { $toString: '$_id.month' },
                    },
                  },
                ],
              },
              'New Users': '$count',
            },
          },
        ],
      },
    },
  ]);

  const totalMovies = await Movie.countDocuments();

  const stats = {
    totalUsers: userStats[0]?.totalUsers[0]?.count || 0,
    totalMovies,
    monthlySignups: userStats[0]?.monthlySignups || [],
  };

  return stats;
};

export const dashboardService = {
  getDashboardStats,
}; 