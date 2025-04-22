import express from 'express';
import connectToDatabase from './config/database';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute';
import courseRouter from './routes/courseRoute';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4004;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:5173';

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);

// auth routes

// middleware to handle errors
app.use(errorHandler);

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT} in ${NODE_ENV} mode`);
  await connectToDatabase();
});