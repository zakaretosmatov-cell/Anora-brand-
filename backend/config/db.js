const mongoose = require('mongoose');

let useFallback = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.warn('WARNING: MONGO_URI is not defined in .env file.');
      console.log('--> Falling back to local JSON database storage.');
      useFallback = true;
      return;
    }
    
    // Set connection timeout to 3 seconds for quick fallback check
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('--> Falling back to local JSON database storage.');
    useFallback = true;
  }
};

const getUseFallback = () => useFallback;

module.exports = { connectDB, getUseFallback };
