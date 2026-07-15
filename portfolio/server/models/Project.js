const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true },
    description:     { type: String, required: true },
    longDescription: { type: String },
    category:        {
      type: String,
      enum: ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'DevOps', 'Other'],
      default: 'Full Stack',
    },
    techStack:  [{ type: String }],
    imageUrl:   { type: String },
    liveUrl:    { type: String },
    githubUrl:  { type: String },
    featured:   { type: Boolean, default: false },
    order:      { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'archived'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ order: 1 });

module.exports = mongoose.model('Project', projectSchema);
