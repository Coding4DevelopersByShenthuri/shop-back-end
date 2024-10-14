const express = require('express');
const router = express.Router();
const staffService = require('../services/staffService');
const multer = require('multer');
const { ObjectId } = require('mongodb');


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Naming the file
  },
});

const upload = multer({ storage });

// Add staff
router.post('/add-staff', async (req, res) => {
  try {
    const result = await staffService.addStaff(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({ error: "Failed to add staff" });
  }
});

// Get all staffs
router.get('/all-staffs', async (req, res) => {
  try {
    const staffs = await staffService.getAllStaffs();
    res.status(200).json(staffs);
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res.status(500).json({ error: "Failed to fetch staffs" });
  }
});

// Update staff
router.patch('/staff/:id', async (req, res) => {
  try {
    const updatedStaff = await staffService.updateStaff(req.params.id, req.body);
    if (!updatedStaff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ error: "Failed to update staff" });
  }
});

// Delete staff
router.delete('/staff/:id', async (req, res) => {
  try {
    const deletedStaff = await staffService.deleteStaff(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ error: "Failed to delete staff" });
  }
});

// Get staff by ID
router.get('/staff/:id', async (req, res) => {
  try {
    const staff = await staffService.getStaffById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// Route for uploading staff image and storing image URL and path in MongoDB
router.post('/upload-staff-image', upload.single('image'), async (req, res) => {
  const staffId = req.body.staffId;  // Get the staff ID from the request


  if (!ObjectId.isValid(staffId)) {
    return res.status(400).send({ error: 'Invalid staff ID format' });
  }

  try {
    // Extract the necessary details from the uploaded file
    const filePath = req.file.path; // The path where the file is stored on the server
    const fileName = req.file.filename; // The uploaded file's name
    const baseUrl = `${req.protocol}://${req.get('host')}`; // Base URL of the server

    // Create the desired imageUrl format
    const imageUrl = `/uploads/${fileName}`;

    // Update the staff document with image URL and path
    const updateDoc = {
      $set: {
        imageUrl: imageUrl,
        imagePath: filePath,
      },
    };
    
    const result = await staffService.updateStaff(staffId, updateDoc);
console.log(result)
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: 'Staff not found' });
    }

    res.status(200).send({
      message: 'Staff image uploaded successfully',
      imageUrl: imageUrl,
      imagePath: filePath,
    });
  } catch (error) {
    console.error("Error uploading staff image:", error);
    res.status(500).send({ error: "Failed to upload staff image" });
  }
});

module.exports = router;
