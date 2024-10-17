// routes/attendanceRoutes.js
const express = require('express');
const Attendance = require('../models/attendanceModel');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const attendanceData = req.body; // Expecting an object like { staffId: "xxx", present: true/false }

    const attendanceEntries = Object.entries(attendanceData).map(([staffId, present]) => ({
      staffId,
      present,
    }));

    await Attendance.insertMany(attendanceEntries); // Bulk insert if you are sending multiple records
    res.status(201).json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

