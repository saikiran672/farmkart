const mongoose = require('mongoose');

let cached = null;

const connectDB = async () => {
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }

  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!mongoURI) {
    console.error('MongoDB connection error: environment variable MONGODB_URI, MONGO_URI, or DATABASE_URL is not defined.');
    process.exit(1);
  }

  try {
    cached = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${cached.connection.host}`);
    return cached;
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
