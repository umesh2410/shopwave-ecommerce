const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1 AND is_active = true', [decoded.id]);
    if (!result.rows[0]) return res.status(401).json({ error: 'User not found' });
    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'seller') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireManager = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'manager' && req.user?.role !== 'seller') {
    return res.status(403).json({ error: 'Manager or Admin access required' });
  }
  next();
};

module.exports = { authenticate, requireAdmin, requireManager };
