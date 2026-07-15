const express = require('express');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Testimonial = require('../models/Testimonial');
const Certificate = require('../models/Certificate');
const Achievement = require('../models/Achievement');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics — admin only
router.get('/', requireAuth, async (_req, res) => {
  try {
    const [
      projects,
      skills,
      experience,
      testimonials,
      certificates,
      achievements,
      totalMessages,
      unreadMessages,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Testimonial.countDocuments(),
      Certificate.countDocuments(),
      Achievement.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Message.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      counts: {
        projects,
        skills,
        experience,
        testimonials,
        certificates,
        achievements,
        messages: { total: totalMessages, unread: unreadMessages },
      },
      recentMessages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
