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

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'attendance')));

// Connect to the database
connectDB().then(() => {
  // Use routes
  app.use('/staff', staffRoutes);
  app.use('/tasks', taskRoutes);
  app.use('/product', productRoutes);
  app.use('/stock', stockRoutes);
  app.use('/user', userRoutes);
  app.use('/attendance', attendanceRoutes);
  app.use('/contact', contactRoutes);
  app.use('/birthday', birthdayRoutes);
  
  // New birthday route for fetching upcoming birthdays
  app.use('/upcoming-birthdays', birthdayRoutes); 
  
  // Add other route uses...

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error("Failed to start the server:", error);
});
