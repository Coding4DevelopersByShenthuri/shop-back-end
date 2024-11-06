const express = require('express');
const router = express.Router();
const fs = require('fs');
const PDFDocument = require('pdfkit');
const attendanceController = require('../controllers/attendanceController');
const { PDFDocument: PDFLibDocument } = require('pdf-lib'); // Importing pdf-lib
const Attendance = require('../models/attendanceModel'); // Ensure this is the correct path
const Staff = require('../models/staffModel');
const staffService = require('../services/staffService');
const path = require('path');
const { put } = require('@vercel/blob');



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

router.post('/mark-attendance', async (req, res) => {
  const { staffId } = req.body;

  const selectedDate = new Date().toLocaleDateString();
  const istDate = new Date(selectedDate).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });


  const [day, month, year] = istDate.split(',')[0].split('/');
  const formattedDate = `${year}-${month}-${day}`;
  const pdfFilePath = `./attendance/attendance_report_${formattedDate}.pdf`; // Unique PDF file per date

  if (staffId) {
    try {
      // Find staff details using staffId
      const staffObj = await Staff.findById(staffId);
      if (!staffObj) {
        return res.status(404).json({ message: 'Staff not found' });
      }


      // Mark the staff as present in the attendance collection
      await Attendance.findOneAndUpdate(
        { staffId: staffId },
        { present: true, date: formattedDate },
        { new: true, upsert: true }
      );

      try {
        const allEntriesForDate = await Staff.aggregate([
          {
            $lookup: {
              from: 'attendances', // Name of the Attendant collection
              localField: '_id', // The field from the Staff model (usually _id)
              foreignField: 'staffId', // The field from the Attendant model
              as: 'attendances' // Alias for the array that will contain the joined data
            }
          },
          {
            $project: {
              _id: 1, // Include staffId
              name: 1, // Include staff name (assuming there's a 'name' field)
              attendances: {
                $filter: {
                  input: "$attendances", // The array to filter
                  as: "attendance", // Variable name for each element in the array
                  cond: {
                    $eq: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$$attendance.date" } }, // Convert attendance date to string format (YYYY-MM-DD)
                      { $dateToString: { format: "%Y-%m-%d", date: new Date() } } // Convert formattedDate to string format (YYYY-MM-DD)
                    ]
                  } // Filter condition
                }
              } // Keep the filtered attendances for the specified date
            }
          }
        ]);
        const attendanceEntries = allEntriesForDate.map(item => {
          return {
            date: formattedDate,
            staffId: item._id,
            name: item.name,
            present: item?.attendances[0]?.present || false
          }
        }
        )
  
        let doc = new PDFDocument();

        try {
          await generateAttendancePDF(attendanceEntries, formattedDate, new Date().toLocaleDateString(), doc);
        
          if (process.env.VERCEL_ENV === 'production') {
            // Vercel production: Store the PDF in Blob Storage
            const pdfChunks = [];
            doc.on('data', chunk => pdfChunks.push(chunk));
            doc.end();
        
            doc.on('end', async () => {
              try {
                const pdfBuffer = Buffer.concat(pdfChunks);
                const contentLength = pdfBuffer.length;
        
                console.log("Attempting to upload PDF to Blob Storage");
        
                const { url } = await put(pdfFilePath, pdfBuffer, {
                  access: 'public',
                  headers: {
                    'Content-Length': contentLength,
                  },
                });
        
                res.status(201).json({
                  message: 'Attendance recorded successfully, and PDF generated/updated on Blob Storage',
                  url: url,
                  data: attendanceEntries.find(e => e.staffId == req.body.staffId),
                });
              } catch (error) {
                console.error('Error uploading PDF to Blob Storage:', error);
                res.status(500).json({ message: 'Error uploading PDF to Blob Storage' });
              }
            });
          } else {
            // Local environment: Store the PDF locally
            const writeStream = fs.createWriteStream(pdfFilePath);
            doc.pipe(writeStream);
            doc.end();
        
            writeStream.on('finish', () => {
              res.status(201).json({
                message: 'Attendance recorded successfully, and PDF generated/updated locally',
                data: attendanceEntries.find(e => e.staffId == req.body.staffId),
              });
            });
        
            writeStream.on('error', (error) => {
              console.error('Failed to write PDF locally:', error);
              res.status(500).json({ message: 'Error generating PDF locally' });
            });
          }
        } catch (error) {
          console.error('Failed to generate attendance PDF:', error);
          res.status(500).json({ message: 'Error generating attendance PDF' });
        }
        
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
        // You can also handle the error further, like returning an error response in an Express app
      }

    } catch (error) {
      console.log("Error marking attendance:", error);
      res.status(500).json({ message: 'Error marking attendance' });
    }
  } else {
    res.status(403).json({ message: 'Invalid staffId' });
  }
});



// Route for saving attendance data and generating a PDF report
router.post('/', async (req, res) => {
  try {
    const { attendanceEntries, selectedDate } = req.body;

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
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    const pdfFilePath = `./attendance/attendance_report_${formattedDate}.pdf`;

    let doc = new PDFDocument();

    // Check if the PDF already exists
    if (fs.existsSync(pdfFilePath)) {
      const existingPdfBytes = fs.readFileSync(pdfFilePath);
      const existingPdfDoc = await PDFLibDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFLibDocument.create();
      const copiedPages = await newPdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
      copiedPages.forEach((page) => newPdfDoc.addPage(page));

      await generateAttendancePDF(attendanceEntries, selectedDate, new Date().toLocaleDateString(), doc);
    } else {
      await generateAttendancePDF(attendanceEntries, selectedDate, new Date().toLocaleDateString(), doc);
    }

    if (process.env.VERCEL_ENV === 'production') {
      // Vercel production: Store the PDF in Blob Storage
      const pdfChunks = [];
      doc.on('data', chunk => pdfChunks.push(chunk));
      doc.end();

      doc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(pdfChunks);
          const contentLength = pdfBuffer.length;

          console.log("Attempting to upload PDF to Blob Storage");

          const { url } = await put(pdfFilePath, pdfBuffer, {
            access: 'public',
            headers: {
              'Content-Length': contentLength,
            },
          });

          res.status(201).json({
            message: 'Attendance recorded successfully, and PDF generated/updated on Blob Storage',
            url: url,
            data: attendanceEntries.find(e => e.staffId == req.body.staffId),
          });
        } catch (error) {
          console.error('Error uploading PDF to Blob Storage:', error);
          res.status(500).json({ message: 'Error uploading PDF to Blob Storage' });
        }
      });
    } else {
      // Local environment: Store the PDF locally
      const writeStream = fs.createWriteStream(pdfFilePath);
      doc.pipe(writeStream);
      doc.end();

      writeStream.on('finish', () => {
        res.status(201).json({
          message: 'Attendance recorded successfully, and PDF generated/updated locally',
          data: attendanceEntries.find(e => e.staffId == req.body.staffId),
        });
      });

      writeStream.on('error', (error) => {
        console.error('Failed to write PDF locally:', error);
        res.status(500).json({ message: 'Error generating PDF locally' });
      });
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
