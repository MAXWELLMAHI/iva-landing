// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log') 
    })
  ]
});

const app = express();
const port = process.env.PORT || 5000;

// Apply security middleware
app.use(helmet());

// Configure CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for API calls
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes by default
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', apiLimiter);
app.use(bodyParser.json());

// Database connection pool with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info('Database connection successful');
    connection.release();

    // Create table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('Contact submissions table is ready');
  } catch (error) {
    logger.error('Database connection failed:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

testDbConnection();

// Test route
app.get('/api/test', (req, res) => {
  logger.info('API test endpoint accessed');
  res.json({ message: 'API server is running' });
});

// Contact form validation rules
const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
];

// Contact form submission route with validation
app.post('/api/contact', contactValidationRules, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Contact form validation failed', { errors: errors.array() });
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;
    
    // Insert data into database with prepared statement for security
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    logger.info('Form data saved to database', { id: result.insertId, email });

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Message received successfully',
      id: result.insertId
    });
  } catch (error) {
    logger.error('Error saving contact form:', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving your message'
    });
  }
});

// Route to get all submissions (for admin purposes) with pagination
app.get('/api/contact', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM contact_submissions');
    const totalItems = countResult[0].total;
    
    // Get paginated data
    const [rows] = await pool.execute(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    logger.info('Submissions fetched', { page, limit, total: totalItems });
    
    return res.json({
      success: true,
      data: rows,
      pagination: {
        totalItems,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(totalItems / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching submissions:', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching submissions'
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  pool.end().then(() => {
    logger.info('Database connections closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  pool.end().then(() => {
    logger.info('Database connections closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection:', { reason: reason.message, stack: reason.stack });
});