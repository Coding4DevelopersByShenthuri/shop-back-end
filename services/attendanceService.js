// services/attendanceService.js
const Attendance = require("../models/attendanceModel");

// Mark attendance
const markAttendance = async (req, res) => {
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

module.exports = { markAttendance, getAttendanceByStaff, getAttendanceByDate };
