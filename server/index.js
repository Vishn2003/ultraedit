'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const uploadRoutes = require('./routes/upload');
const mergeRoutes = require('./routes/merge');
const splitRoutes = require('./routes/split');
const compressRoutes = require('./routes/compress');
const convertRoutes = require('./routes/convert');
const watermarkRoutes = require('./routes/watermark');
const errorMiddleware = require('./middleware/error');
const { scheduleCleanup } = require('./utils/cleanup');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Logging
app.use(morgan('dev'));

// JSON body parsing
app.use(express.json());

// Global rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Serve processed files for download (no directory listing)
app.use('/files', express.static(path.join(__dirname, 'uploads'), { index: false }));

// API routes
app.use('/api/upload', uploadRoutes);
app.use('/api/merge', mergeRoutes);
app.use('/api/split', splitRoutes);
app.use('/api/compress', compressRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/watermark', watermarkRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Centralized error handler
app.use(errorMiddleware);

// Schedule automatic cleanup every 30 minutes (remove files older than 1 hour)
scheduleCleanup(path.join(__dirname, 'uploads'), 60 * 60 * 1000, 30 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`DocEase server running on port ${PORT}`);
});

module.exports = app;
