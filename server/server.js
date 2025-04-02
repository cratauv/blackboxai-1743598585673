const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './server/.env' });
console.log('Environment variables loaded from:', path.resolve('./server/.env'));
console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'set' : 'not set'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'set' : 'not set'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// Connect to database
connectDB();

// Initialize Express
const app = express();
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join user-specific room
  socket.on('join', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} connected`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Attach io to app for controller access
app.set('io', io);

// Body parser middleware
app.use(express.json());

// Rate limiting
const limiter = require('./middleware/rateLimiter');
app.use(limiter);

// Input validation setup
require('./middleware/validate');

// Route files
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/booking-options', require('./routes/bookingOptionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Booking API' });
});

// Set port
const PORT = process.env.PORT || 5000;

// Error handling middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});