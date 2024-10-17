// models/attendanceModel.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  present: {
    type: Boolean,
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
