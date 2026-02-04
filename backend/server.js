// Main Server File

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database and routes
const { db } = require('./config/database');
const authRoutes = require('./routes/auth');
const borrowRoutes = require('./routes/borrow');
const bookRoutes = require('./routes/book');
const memberRoutes = require('./routes/member');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost', 'http://localhost:3000', 'http://localhost:8000', 'http://127.0.0.1', 'http://127.0.0.1:8000', 'http://localhost:8000'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'APSZ Library Management System Backend',
    status: 'Server is running successfully',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Database: SQLite`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`${'='.repeat(50)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
