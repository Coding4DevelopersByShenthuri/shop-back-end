const express = require('express');
const router = express.Router();
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Attendance = require('../models/attendanceModel'); // Ensure this is the correct path
const attendanceController = require('../controllers/attendanceController');

let dailyToken = ""; // Assume you have some way of generating and storing a daily token

// Function to generate attendance PDF
const generateAttendancePDF = (attendanceList) => {
  const doc = new PDFDocument();

  // Title
  doc.fontSize(20).text('Staff Attendance Report', { align: 'center' });

  // Present staff
  doc.moveDown();
  doc.fontSize(14).text('Present Staff:', { underline: true });
  attendanceList
    .filter(staff => staff.present)
    .forEach(staff => doc.fontSize(12).text(staff.name));

  // Absent staff
  doc.moveDown();
  doc.fontSize(14).text('Absent Staff:', { underline: true });
  attendanceList
    .filter(staff => !staff.present)
    .forEach(staff => doc.fontSize(12).text(staff.name));

  return doc; // Return the PDF document object
};

// Route to mark attendance
router.get('/mark-attendance', async (req, res) => {
  const { staffId, token } = req.query;

  // Validate token here if needed
  if (token === dailyToken) {
    try {
      // Mark the staff as present in the database
      const attendanceEntry = await Attendance.findOneAndUpdate(
        { staffId: staffId }, // Find attendance by staff ID
        { present: true, date: new Date() }, // Update attendance status
        { new: true, upsert: true } // Create new record if not found
      );

      // Generate the PDF with the updated attendance list
      const attendanceList = [attendanceEntry]; // Replace with actual list if you maintain it elsewhere
      const doc = generateAttendancePDF(attendanceList);

      // Create a path to save the PDF file
      const pdfFilePath = './attendance/attendance_report.pdf';
      const writeStream = fs.createWriteStream(pdfFilePath);

      // Pipe the PDF to the write stream
      doc.pipe(writeStream);

      // Finalize the PDF and close the stream
      doc.end();

      writeStream.on('finish', () => {
        res.status(201).json({ message: 'Attendance recorded successfully, and PDF generated' });
      });

      writeStream.on('error', (err) => {
        console.error('Error writing PDF:', err);
        res.status(500).json({ message: 'Error generating PDF' });
      });

    } catch (error) {
      console.error("Error marking attendance:", error);
      res.status(500).json({ message: 'Error marking attendance' });
    }
  } else {
    res.status(403).json({ message: 'Invalid token' });
  }
});

// Route for saving attendance data and generating a PDF report
router.post('/', async (req, res) => {
  try {
    const attendanceEntries = req.body; // Expecting an array of { staffId, name, present }

    // Validate that each entry contains a valid ObjectId and a boolean for 'present'
    attendanceEntries.forEach((entry) => {
      if (!entry.staffId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`Invalid staffId: ${entry.staffId}`);
      }
      if (typeof entry.present !== 'boolean') {
        throw new Error(`Invalid present value for staffId ${entry.staffId}`);
      }
    });

    // Save the attendance data to the database
    await Attendance.insertMany(attendanceEntries);

    // Generate the PDF with present and absent staff
    const doc = generateAttendancePDF(attendanceEntries);

    // Create a path to save the PDF file
    const pdfFilePath = './attendance/attendance_report.pdf';
    const writeStream = fs.createWriteStream(pdfFilePath);

    // Pipe the PDF to the write stream
    doc.pipe(writeStream);

    // Finalize the PDF and close the stream
    doc.end();

    writeStream.on('finish', () => {
      res.status(201).json({ message: 'Attendance recorded successfully, and PDF generated' });
    });

    writeStream.on('error', (err) => {
      console.error('Error writing PDF:', err);
      res.status(500).json({ message: 'Error generating PDF' });
    });

  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
