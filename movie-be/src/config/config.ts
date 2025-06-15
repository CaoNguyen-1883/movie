import dotenv from 'dotenv';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_app',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtAccessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || 900, 
  jwtRefreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800, 
  nodeEnv: process.env.NODE_ENV || 'development'
};