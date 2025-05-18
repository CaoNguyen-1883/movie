import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { AppException } from './exceptions/AppException';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Movie API' });
});

// Test error handler
app.get('/error', () => {
    throw new AppException('Test error', 400, 'TEST_ERROR');
});

// Error handling middleware (should be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
