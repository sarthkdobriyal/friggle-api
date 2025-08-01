const mongoose = require('mongoose');
const api_config = require('../config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(api_config.DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
