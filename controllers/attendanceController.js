const attendanceService = require('../services/attendanceService');

const markAttendance = async (req, res) => {
  const { staffId, token } = req.query;

  // Here you could add token validation if needed
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  // Add your token validation logic here if needed
  // For example, you could check if the token matches a stored daily token

  try {
    // Mark attendance using the service
    const attendance = await attendanceService.markAttendance(staffId, token);
    
    // Redirect to the attendance page after marking attendance
    res.redirect('/attendance'); 
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

module.exports = {
  markAttendance,
};

