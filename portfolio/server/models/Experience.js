const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company:          { type: String, required: true },
    role:             { type: String, required: true },
    description:      { type: String },
    responsibilities: [{ type: String }],
    startDate:        { type: Date, required: true },
    endDate:          { type: Date },
    current:          { type: Boolean, default: false },
    companyUrl:       { type: String },
    location:         { type: String },
    techStack:        [{ type: String }],
    order:            { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
