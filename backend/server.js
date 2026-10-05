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

// Extended Routes
const exportRoutes = require('./routes/exportRoutes');
const customerProductRoutes = require('./routes/customerProductRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Trust reverse proxy for client IP detection & rate limiting
app.set('trust proxy', true);

const jwt = require('jsonwebtoken');

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim()).filter(Boolean);
    if (ips.length > 0) return ips[0];
  }
  return req.headers['x-real-ip'] || req.ip || (req.socket && req.socket.remoteAddress) || '127.0.0.1';
};

// 1. Strict Auth Limiter (Prevents brute-force on login/register/password change)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  message: { success: false, message: 'Too many authentication attempts from this IP, please try again after 15 minutes.' }
});

// 2. Public submission limiter (Leads / Chatbot)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  message: { success: false, message: 'Too many submissions from this IP, please try again later.' }
});

const isStaffUser = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      const allowedRoles = ['Super Admin', 'Admin', 'Sales Executive', 'Production Manager'];
      if (decoded && allowedRoles.includes(decoded.role)) {
        return true; // Staff are never throttled during admin operations
      }
    } catch (_) {}
  }
  return false;
};

// 3. General API Limiter (Production tier: 1500 req/15min, bypass for authenticated staff)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  skip: (req) => {
    // Never rate limit internal health checks
    if (req.path === '/health' || req.originalUrl === '/api/health') return true;
    return isStaffUser(req);
  },
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/change-password', authLimiter);
app.use('/api/leads', writeLimiter);


app.use(compression());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
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
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve persistent storage files (/var/www/uniwear/storage)
const fs = require('fs');
const primaryStorage = path.resolve(__dirname, '..', 'storage');
const fallbackStorage = path.resolve(__dirname, 'storage');
const activeStorageDir = fs.existsSync(primaryStorage) ? primaryStorage : fallbackStorage;
if (!fs.existsSync(activeStorageDir)) {
  fs.mkdirSync(activeStorageDir, { recursive: true });
}
app.use('/storage', express.static(activeStorageDir));

// API Routes
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
app.use('/api/export', exportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api', customerProductRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'UNIWEAR Production API is running.', timestamp: new Date().toISOString() });
});

// Unmatched API route handler (returns JSON 404 instead of index.html)
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found.` });
});

// 301 Permanent Redirect for legacy /about-us
app.get(['/about-us', '/about-us.html'], (req, res) => {
  res.redirect(301, '/about.html');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] UNIWEAR API running on http://localhost:${PORT}`);
});

module.exports = app;
