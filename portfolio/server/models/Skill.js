const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Cloud', 'Tools', 'AI', 'Languages', 'Other'],
      required: true,
    },
    proficiency: { type: Number, min: 0, max: 100, default: 80 },
    icon:        { type: String },   // e.g. "SiReact"
    color:       { type: String },   // hex or CSS color
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
