/**
 * ============================================================================
 * SECTION 35 – Server Execution & Port Binding (.env Configuration)
 * ============================================================================
 * This is the application entry point for running the full-stack server
 * with Express backend and Vite frontend integration.
 * ============================================================================
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './api/index.js';

// Section 35 – Load Port from Environment (.env) or fallback to 3000
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  // Vite middleware for development & SPA asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 and PORT
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Hackathon Tracker running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
