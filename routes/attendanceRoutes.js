const express = require('express');
const router = express.Router();
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLibDocument } = require('pdf-lib'); // Importing pdf-lib
const Attendance = require('../models/attendanceModel'); // Ensure this is the correct path

// Function to generate attendance PDF
const generateAttendancePDF = async (attendanceList, selectedDate, reportDate, doc) => {
  // Title
  doc.fontSize(20).text('Staff Attendance Report', { align: 'center' });

  // Attendance date (selected by the user)
  doc.moveDown();
  doc.fontSize(12).text(`Attendance Date: ${selectedDate}`, { align: 'left' });

  // Report generation date (current date)
  doc.fontSize(12).text(`Report Generated on: ${reportDate}`, { align: 'left' });

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

  return doc; // Return the updated PDF document object
};

// Route for marking attendance and generating a PDF
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
      const selectedDate = new Date().toLocaleDateString(); // Set the selected date to today's date
      const reportDate = new Date().toLocaleDateString(); // Set report date to today's date
      const formattedDate = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD
      const pdfFilePath = `./attendance/attendance_report_${formattedDate}.pdf`; // Unique PDF file per date

      let doc = new PDFDocument(); // Create a new PDF document
      
      // Check if the PDF already exists
      if (fs.existsSync(pdfFilePath)) {
        // Read the existing PDF
        const existingPdfBytes = fs.readFileSync(pdfFilePath);
        const existingPdfDoc = await PDFLibDocument.load(existingPdfBytes);

        // Create a new PDF document to hold the merged content
        const newPdfDoc = await PDFLibDocument.create();
        const copiedPages = await newPdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());

        // Add copied pages to the new PDF document
        copiedPages.forEach((page) => {
          newPdfDoc.addPage(page);
        });

        // Now generate the new attendance PDF
        await generateAttendancePDF([attendanceEntry], selectedDate, reportDate, doc);

        // Pipe the new document to a writable stream
        const writeStream = fs.createWriteStream(pdfFilePath);
        doc.pipe(writeStream);
        doc.end();
        
      } else {
        // If PDF does not exist, create a new one
        await generateAttendancePDF([attendanceEntry], selectedDate, reportDate, doc);
      }

      // Pipe the PDF to the write stream
      const writeStream = fs.createWriteStream(pdfFilePath);
      doc.pipe(writeStream);

      // Finalize the PDF and close the stream
      doc.end();

      writeStream.on('finish', () => {
        res.status(201).json({ message: 'Attendance recorded successfully, and PDF generated/updated' });
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
    const { attendanceEntries, selectedDate } = req.body; // Expecting an array of { staffId, name, present }

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

    // Set file path based on the selected date
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
    const pdfFilePath = `./attendance/attendance_report_${formattedDate}.pdf`; // Unique PDF file per date

    let doc = new PDFDocument(); // Create a new PDF document

    // Check if the PDF already exists
    if (fs.existsSync(pdfFilePath)) {
      // Read the existing PDF
      const existingPdfBytes = fs.readFileSync(pdfFilePath);
      const existingPdfDoc = await PDFLibDocument.load(existingPdfBytes);

      // Create a new PDF document to hold the merged content
      const newPdfDoc = await PDFLibDocument.create();
      const copiedPages = await newPdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());

      // Add copied pages to the new PDF document
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page);
      });

      // Generate the PDF with the merged attendance
      await generateAttendancePDF(attendanceEntries, selectedDate, new Date().toLocaleDateString(), doc);
    } else {
      // If PDF does not exist, create a new one
      await generateAttendancePDF(attendanceEntries, selectedDate, new Date().toLocaleDateString(), doc);
    }

    // Pipe the PDF to the write stream
    const writeStream = fs.createWriteStream(pdfFilePath);
    doc.pipe(writeStream);

    // Finalize the PDF and close the stream
    doc.end();

    writeStream.on('finish', () => {
      res.status(201).json({ message: 'Attendance recorded successfully, and PDF generated/updated' });
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
