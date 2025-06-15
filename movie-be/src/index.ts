import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '@/config/config';
import connectDB from '@/config/database';
import { AppError } from '@/utils/AppError';
import { errorHandler } from '@/middleware/error.middleware';
import v1Routes from '@/routes/v1';
import passport from 'passport';
import { jwtStrategy } from '@/middleware/auth.middleware';

const app = express();

// --- JWT Strategy ---
passport.use('jwt', jwtStrategy);

// --- Middleware Setup ---
// Enable CORS
app.use(cors());
// Secure HTTP headers
app.use(helmet());
// HTTP request logger
app.use(morgan('dev'));
// Initialize passport
app.use(passport.initialize());
// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Routes ---
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Movie API' });
});

// v1 API routes
app.use('/api/v1', v1Routes);


// Global error handling middleware 
app.use(errorHandler);



const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode.`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
