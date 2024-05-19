const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB');

dotenv.config();

const app = new express();

app.use(cors());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend server started on PORT:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
