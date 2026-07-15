const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name:                    { type: String, required: true },
    title:                   { type: String, required: true },
    bio:                     { type: String },
    location:                { type: String },
    email:                   { type: String },
    phone:                   { type: String },
    github:                  { type: String },
    linkedin:                { type: String },
    twitter:                 { type: String },
    website:                 { type: String },
    resumeUrl:               { type: String },
    avatarUrl:               { type: String },
    tagline:                 { type: String },
    yearsOfExperience:       { type: Number, default: 0 },
    projectsCompleted:       { type: Number, default: 0 },
    happyClients:            { type: Number, default: 0 },
    openSourceContributions: { type: Number, default: 0 },
    availableForWork:        { type: Boolean, default: false },
    services: [
      {
        title:       String,
        description: String,
        icon:        String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
