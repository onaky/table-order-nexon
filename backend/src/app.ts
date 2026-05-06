import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { routes } from './routes';
import { errorHandler } from './middleware/error-handler.middleware';
import { config } from './config';

const app = express();

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '..', config.upload.dir)));

// API Routes
app.use('/api', routes);

// Global error handler (must be last)
app.use(errorHandler);

export { app };
