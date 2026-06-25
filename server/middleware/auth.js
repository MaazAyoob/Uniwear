const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role !== 'Customer') return next();
  return res.status(403).json({ success: false, message: 'Admin access required.' });
};

module.exports = { protect, adminOnly };
