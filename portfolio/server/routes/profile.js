const express = require('express');
const Profile = require('../models/Profile');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/profile — public
router.get('/', async (_req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        name: 'Alex Johnson',
        title: 'Full Stack Developer',
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/profile — admin only
router.patch('/', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
