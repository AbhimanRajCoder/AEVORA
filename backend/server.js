// Main entry point for the Express backend server.

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { sendSuccess } from './utils/responseHelper.js';
import { logInfo, logError } from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

// Configure CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Base health check endpoint under /api/v1
app.get('/api/v1/health', (_req, res) => {
  return sendSuccess(res, {
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all route for unhandled endpoints
app.use(notFoundHandler);

// Central error handling middleware
app.use((err, req, res, next) => {
  logError(`Unhandled error: ${err.message}`);
  return errorHandler(err, req, res, next);
});

// Start listening for incoming HTTP requests
const server = app.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`);
});

export { app, server };

