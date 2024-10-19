// services/attendanceService.js
const Attendance = require("../models/attendanceModel");

// Function to mark attendance with staff ID and token validation
const markAttendance = async (staffId, token) => {
  // Add your token validation logic here if necessary
  // For example: if (!isValidToken(token)) throw new Error('Invalid token');

  const attendanceRecord = await Attendance.findOneAndUpdate(
    { staffId: staffId },
    { present: true, date: new Date() },
    { new: true, upsert: true }
  );

  return attendanceRecord;
};

// Mark attendance API handler
const markAttendanceHandler = async (req, res) => {
  const { staffId, status, checkInTime, checkOutTime } = req.body;

  try {
    const attendance = new Attendance({
      staffId,
      status,
      checkInTime,
      checkOutTime,
    });
    
    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error });
  }
};

// Get attendance by staff ID
const getAttendanceByStaff = async (req, res) => {
  const { staffId } = req.params;
  
  try {
    const attendanceRecords = await Attendance.find({ staffId });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

// Get attendance by date
const getAttendanceByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ date: new Date(date) });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

module.exports = { 
  markAttendance, 
  markAttendanceHandler, 
  getAttendanceByStaff, 
  getAttendanceByDate 
};
