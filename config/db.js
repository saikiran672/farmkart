const mongoose = require('mongoose');

let cached = null;

const connectDB = async () => {
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }
  try {
    cached = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${cached.connection.host}`);
    return cached;
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
