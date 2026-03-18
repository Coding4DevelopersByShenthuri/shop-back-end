const attendanceService = require('../services/attendanceService');
const Staff = require('../models/staffModel');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const markAttendance = async (req, res, next) => {
  const { staffId, token } = req.query;

  // Validate token
  if (!token) {
    return sendError(res, 'Token is required', 403);
  }

  if (token !== process.env.DAILY_TOKEN) {
    return sendError(res, "Invalid token", 403);
  }

  try {
    // Find staff by staffId
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return sendError(res, "Staff not found", 404);
    }

    // Mark attendance as present
    staff.attendance.push({ date: new Date(), status: 'present' });
    await staff.save();

    sendSuccess(res, staff, "Attendance marked successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
};
