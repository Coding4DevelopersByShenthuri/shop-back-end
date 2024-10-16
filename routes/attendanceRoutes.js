// routes/attendanceRoutes.js
const express = require("express");
const { markAttendance, getAttendanceByStaff, getAttendanceByDate } = require("../services/attendanceService");
const router = express.Router();

// Mark attendance (POST request)
router.post("/mark", markAttendance);

// Get attendance for a staff member
router.get("/staff/:staffId", getAttendanceByStaff);

// Get attendance for a specific date
router.get("/date/:date", getAttendanceByDate);

module.exports = router;
