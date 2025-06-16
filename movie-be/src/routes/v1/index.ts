import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import roleRoute from './role.route';
import permissionRoute from './permission.route';
import genreRoute from './genre.route';
import personRoute from './person.route';
import movieRoute from './movie.route';
import reviewRoute from './review.route';
import historyRoutes from './history.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/permissions',
    route: permissionRoute,
  },
  {
    path: '/genres',
    route: genreRoute,
  },
  {
    path: '/people',
    route: personRoute,
  },
  {
    path: '/movies',
    route: movieRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/history',
    route: historyRoutes,
  },
  // Add other v1 routes here in the future
  /*
  {
    path: '/users',
    route: userRoute,
  },
  */
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router; 