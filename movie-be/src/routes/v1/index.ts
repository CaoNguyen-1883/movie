import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import roleRoute from './role.route';
import permissionRoute from './permission.route';

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