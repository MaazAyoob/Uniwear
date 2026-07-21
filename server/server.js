require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const productRoutes = require('./routes/productRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const blogRoutes = require('./routes/blogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Security & Optimization Middlewares ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to allow external CDNs loaded in frontend HTMLs
  crossOriginEmbedderPolicy: false
}));

// API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', apiLimiter);

// Gzip Compression
app.use(compression());

// Dynamic CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow server-to-server or programmatic calls

    // Allow localhost/local files in dev, or if allowedOrigins list is empty
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.length === 0) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));   // Support base64 logo payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Serve static frontend files ─────────────────────────────────────────────
// Adjust this path if your frontend sits elsewhere relative to server/
app.use(express.static(path.join(__dirname, '..')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/company-settings', settingsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'UNIWEAR API is running.', timestamp: new Date().toISOString() });
});

// ─── Catch-All: serve index.html for direct navigation ───────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] UNIWEAR API running on http://localhost:${PORT}`);
});

module.exports = app;
