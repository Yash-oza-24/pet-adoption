const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('MongoDB connecting...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected successfully..');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process with failure
  }
}

module.exports = connectDB;