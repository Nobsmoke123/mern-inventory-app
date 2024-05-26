const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const catch404Error = require('./middleware/catch_404_error');
const errorHandler = require('./middleware/custom_error_handler');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const contactRoutes = require('./routes/contact.routes');
const path = require('path');
dotenv.config();

const app = new express();

// Remove fingerprinting
app.disable('x-powered-by');

app.use(helmet());
app.use(compression());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load routes
app.get('/', (req, res) => {
  throw new Error('Broken');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/app', contactRoutes);

// Load 404 error handler
app.use(catch404Error);

// Load custom error handler
app.use(errorHandler);

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
