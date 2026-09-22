const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// Capture raw body for webhook HMAC validation
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PayTodo API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
