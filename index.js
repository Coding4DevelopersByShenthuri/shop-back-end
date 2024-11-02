const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const path = require('path');

// Import route files
const staffRoutes = require('./routes/staffRoutes');
const taskRoutes = require('./routes/taskRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const contactRoutes = require('./routes/contactRoutes');
const birthdayRoutes = require('./routes/birthdayRoutes');
const orderRoutes = require('./routes/orderRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // or specify the allowed origin(s)
}));
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'attendance')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MongoDB connection
connectDB().then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));
// Use routes
app.use('/staff', staffRoutes);
app.use('/tasks', taskRoutes);
app.use('/product', productRoutes);
app.use('/stock', stockRoutes);
app.use('/user', userRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/contact', contactRoutes);
app.use('/birthday', birthdayRoutes);
app.use('/order', orderRoutes);
app.use('/recipes', recipeRoutes);
app.use('/wishlists', wishlistRoutes);
app.use('/blogs', blogRoutes);
app.use('/carts', cartRoutes);
app.use('/upcoming-birthdays', birthdayRoutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

// Export the app (no need for app.listen on Vercel)
module.exports = app;
