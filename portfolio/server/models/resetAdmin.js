require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await Admin.findOne({
      email: 'admin@portfolio.dev'
    });

    if (!admin) {
      console.log('Admin not found');
      process.exit(1);
    }

    admin.passwordHash = 'admin123';
    await admin.save();

    console.log('Password reset successfully!');
    console.log('Email: admin@portfolio.dev');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

resetAdmin();