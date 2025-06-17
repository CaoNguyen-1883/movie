import dotenv from 'dotenv';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/movie',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || 900,
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  nodeEnv: process.env.NODE_ENV || 'development'
};