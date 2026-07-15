const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio_dev_secret_change_in_prod';

/**
 * Sign a JWT token for an admin user.
 */
const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

/**
 * Middleware — verify the Bearer token and attach req.admin.
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { signToken, requireAuth };
