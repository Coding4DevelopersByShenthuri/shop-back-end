const attendanceService = require('../services/attendanceService');
const Staff = require('../models/staffModel');

const markAttendance = async (req, res) => {
  const { staffId, token } = req.query; // Extract staffId and token from query parameters

  // Validate token
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  if (token !== process.env.DAILY_TOKEN) {
    return res.status(403).json({ error: "Invalid token" });
  }

  try {
    // Find staff by staffId
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    // Mark attendance as present
    staff.attendance.push({ date: new Date(), status: 'present' });
    await staff.save();

    // Optionally call an attendance service if needed
    // await attendanceService.markAttendance(staffId, token); // Uncomment if you want to use the service

    // Respond with success message and staff details
    res.status(200).json({ message: "Attendance marked", staff });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  markAttendance,
};
