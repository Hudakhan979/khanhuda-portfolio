const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Strict rate limit on contact form — 5 submissions per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Try again later.' },
});

// POST /api/contact — public
router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, subject, message } = req.body;

      // Persist to DB
      const doc = await Message.create({ name, email, subject, message });

      // Optional email notification — only if SMTP env vars are set
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${name}" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          replyTo: email,
          subject: subject || `Portfolio Contact: ${name}`,
          text: message,
          html: `
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || '—'}</p>
            <hr />
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
      }

      res.status(201).json({ success: true, id: doc._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/contact/messages — admin
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const { read, page = 1, limit = 20 } = req.query;
    const filter = read !== undefined ? { read: read === 'true' } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Message.countDocuments(filter);
    res.json({ messages, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/contact/messages/:id — admin
router.patch('/messages/:id', requireAuth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: 'Not found' });
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/contact/messages/:id — admin
router.delete('/messages/:id', requireAuth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
