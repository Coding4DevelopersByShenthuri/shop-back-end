// models/staffModel.js
const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  staffId: { type: String, required: true }, // Added staffId
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added email with unique constraint
  phone: { type: String, required: true }, // Added phone
  role: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true }, // Added location
  message: { type: String }, // Added message
  imageUrl: { type: String }, // Added imageUrl
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const Staff = mongoose.model('staffs', StaffSchema);

module.exports = Staff;
