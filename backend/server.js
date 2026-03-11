require('dotenv').config();
require('./config/db');   // connect database

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const pool = require('./config/db');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://shopwave-ecommerce-8eua.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Check if origin matches any of the allowed origins or ends with vercel.app
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('vercel.app') || 
                      origin.includes('localhost');
                      
    if (isAllowed) {
      return callback(null, true);
    } else {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Logging
app.use(morgan('dev'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------------- ROUTES ----------------

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// -------- DATABASE TEST ROUTE --------

app.get('/db-test', async (req, res) => {
  try {

    const result = await pool.query('SELECT NOW()');

    res.json({
      message: "✅ Database connected successfully",
      time: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "❌ Database connection failed"
    });

  }
});

// -------- ERROR HANDLING --------

app.use(notFound);
app.use(errorHandler);

// -------- START SERVER --------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});