const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await admin.comparePassword(password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = signToken({ id: admin._id, email: admin.email });
      res.json({
        token,
        admin: { id: admin._id, name: admin.name, email: admin.email },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
