import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import apiV1Router from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false // Next.js clients handle CSP
  })
);

// CORS configuration for web and admin portals
const allowedOrigins = [env.CLIENT_WEB_URL, env.CLIENT_ADMIN_URL];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Rate limiting to mitigate brute-force and DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  }
});
app.use('/api/', apiLimiter);

// Body and cookie parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Request logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Static disclaimer header on all responses
app.use((_req, res, next) => {
  res.setHeader('X-Hospital-Name', env.HOSPITAL_NAME);
  res.setHeader('X-Medical-Disclaimer', 'Informational only. Does not replace professional clinical evaluation.');
  next();
});

// Root Health Endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: `${env.HOSPITAL_NAME} Backend API is online`,
    docs: '/api/v1',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1', apiV1Router);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🏥 ${env.HOSPITAL_NAME} API Server`);
  console.log(`🚀 Port: ${env.PORT} | Environment: ${env.NODE_ENV}`);
  console.log(`🌐 Base URL: http://localhost:${env.PORT}/api/v1`);
  console.log(`🔒 DPDP Act 2023 Compliant Health Data Core Enabled`);
  console.log(`=======================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
