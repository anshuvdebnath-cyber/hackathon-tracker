/**
 * ============================================================================
 * SECTION 29 & 30 – Express Server Application Configuration
 * ============================================================================
 * This file constructs and exports the core Express application instance.
 * As taught in Udemy Section 29 (Express Setup), Section 30 (Middlewares: CORS, Morgan),
 * and Section 34 (Error Handling):
 *
 * 1. Express initializes request handlers and pipeline middleware.
 * 2. `cors()` enables Cross-Origin Resource Sharing across origins.
 * 3. `morgan('dev')` provides concise, colorized HTTP request logging for development.
 * 4. `express.json()` and `express.urlencoded()` parse incoming JSON & form payloads.
 * 5. Mounted sub-routers handle domain routes (/api/hackathons).
 * 6. Error handling middleware intercepts and formats all operational errors.
 * 7. When deployed to Vercel, this serverless entry point exports the app directly.
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import hackathonRoutes from './routes/hackathons.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

// Section 29 – Initialize Express Application
const app = express();

// Section 30 – Middleware: Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Section 30 – Middleware: Morgan HTTP Request Logger
// In production or test, morgan can run in combined format; in dev it runs in 'dev' format
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Section 30 – Body Parser Middleware for JSON payloads
app.use(express.json({ limit: '10mb' }));

// Section 30 – Body Parser Middleware for URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Section 30 – Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Hackathon Tracker API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Section 30 & 33 – Mount Hackathons Resource Router
app.use('/api/hackathons', hackathonRoutes);

// Section 34 – Global 404 Route handler for unmapped /api routes
app.use('/api/*', notFoundHandler);

// Section 34 – Global Error Handling Middleware (4 arguments)
app.use(errorHandler);

// Export Express app for Vercel serverless function & server integration
export default app;
