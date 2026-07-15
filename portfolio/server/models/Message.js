const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ read: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
