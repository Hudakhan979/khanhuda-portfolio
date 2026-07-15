const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String },
    icon:        { type: String },
    year:        { type: Number },
    url:         { type: String },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
