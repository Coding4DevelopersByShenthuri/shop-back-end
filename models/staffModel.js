const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the attendance schema
const attendanceSchema = new Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['present', 'absent'], default: 'absent' }
});

// Define the staff schema
const StaffSchema = new Schema({
  staffId: { type: String, required: true }, // Staff ID for QR identification
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email with unique constraint
  phone: { type: String, required: true }, // Phone number
  role: { type: String, required: true }, // Staff role
  department: { type: String, required: true }, // Department information
  location: { type: String, required: true }, // Location of the staff
  message: { type: String }, // Optional message field
  imageUrl: { type: String }, // Optional image URL for the staff photo
  attendance: [attendanceSchema] // Embed the attendance records
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create the Staff model
const Staff = mongoose.model('Staff', StaffSchema, 'staff');

module.exports = Staff;

