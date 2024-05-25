const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const URI =
      process.env.DEV_MODE !== 'NoNetwork'
        ? process.env.MONGO_URL
        : process.env.BAACKUP_MONGO_URL;
    await mongoose.connect(URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.log('MongoDB connection failed.');
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
