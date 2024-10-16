// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
const staffRoutes = require('./routes/staffRoutes');
const taskRoutes = require('./routes/taskRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
// import other routes...

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to the database
connectDB().then(() => {
  // Use routes
  app.use('/staff', staffRoutes);
  app.use('/tasks', taskRoutes);
  app.use('/product', productRoutes);
  app.use('/stock', stockRoutes);
  app.use('/user', userRoutes);
  // Add other route uses...
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error("Failed to start the server:", error);
});
