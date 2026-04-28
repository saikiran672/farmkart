const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  console.log('Database connection established');
}).catch(err => {
  console.error('Database connection failed:', err.message);
  if (process.env.NODE_ENV === 'production') {
    console.error('Continuing without database in production...');
  } else {
    process.exit(1);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    if (dbState === 1) {
      res.status(200).json({ status: 'OK', database: 'connected' });
    } else {
      res.status(503).json({ status: 'Service Unavailable', database: 'disconnected' });
    }
  } catch (err) {
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`FarmKart server running on port ${PORT}`);
  });
}

module.exports = app;
