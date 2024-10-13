// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://shenthuri2001:Shenthu_Maran1007@cluster0.8q84a.mongodb.net/Develop"; // Include database name
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
    console.log(`Connected to database: ${mongoose.connection.name}`);

    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in the database:');
    collections.forEach(collection => {
      console.log(collection.name); // Print each collection name
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

module.exports = connectDB;
