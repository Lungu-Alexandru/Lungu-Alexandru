import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Import route handlers
import { paymentRoutes } from './routes/payments';
import { ticketRoutes } from './routes/tickets';
import { emailRoutes } from './routes/emails';
import { analyticsRoutes } from './routes/analytics';
import { webhookRoutes } from './routes/webhooks';

// API Routes
app.use('/payments', paymentRoutes);
app.use('/tickets', ticketRoutes);
app.use('/emails', emailRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/webhooks', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Export the Express app as a Firebase Function
export const api = functions.region('europe-west1').https.onRequest(app);

// Import Cloud Functions
import './functions/auth';
import './functions/events';
import './functions/orders';
import './functions/notifications';
import './functions/analytics';
import './functions/cleanup';