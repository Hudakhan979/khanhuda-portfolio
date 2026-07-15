const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    issuer:        { type: String, required: true },
    issueDate:     { type: Date },
    expiryDate:    { type: Date },
    credentialId:  { type: String },
    credentialUrl: { type: String },
    imageUrl:      { type: String },
    skills:        [{ type: String }],
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
