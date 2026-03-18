const express = require('express');
const router = express.Router();
const staffService = require('../services/staffService');
const taskService = require('../services/taskService');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { sendSuccess, sendError } = require('../utils/responseHelper');

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
router.post('/add-staff', async (req, res, next) => {
  try {
    const result = await staffService.addStaff(req.body);
    sendSuccess(res, result, "Staff added successfully", 201);
  } catch (error) {
    next(error);
  }
});

// Get all staffs
router.get('/all-staffs', async (req, res, next) => {
  try {
    const staffs = await staffService.getAllStaffs();
    sendSuccess(res, staffs, "Staffs fetched successfully");
  } catch (error) {
    next(error);
  }
});

router.get('/all-staff-with-task', async (req, res, next) => {
  try {
    const staffs = await staffService.getAllStaffs();

    // Fetch tasks for each staff member
    const tasksPromises = staffs.map(async (staff) => {
      const tasks = await taskService.findTaskByStaffId(staff._id);
      return {
        ...staff._doc,
        tasks,
      };
    });

    const staffsWithTasks = await Promise.all(tasksPromises);
    sendSuccess(res, staffsWithTasks, "Staffs with tasks fetched successfully");
  } catch (error) {
    next(error);
  }
});

// Update staff
router.patch('/staff/:id', async (req, res, next) => {
  try {
    const updatedStaff = await staffService.updateStaff(req.params.id, req.body);
    if (!updatedStaff) {
      return sendError(res, 'Staff not found', 404);
    }
    sendSuccess(res, updatedStaff, 'Staff updated successfully');
  } catch (error) {
    next(error);
  }
});

// Delete staff
router.delete('/staff/:id', async (req, res, next) => {
  try {
    const deletedStaff = await staffService.deleteStaff(req.params.id);
    if (!deletedStaff) {
      return sendError(res, 'Staff not found', 404);
    }
    sendSuccess(res, null, 'Staff deleted successfully');
  } catch (error) {
    next(error);
  }
});

// Get staff by ID
router.get('/staff/:id', async (req, res, next) => {
  try {
    const staff = await staffService.getStaffById(req.params.id);
    if (!staff) {
      return sendError(res, 'Staff not found', 404);
    }
    sendSuccess(res, staff, 'Staff fetched successfully');
  } catch (error) {
    next(error);
  }
});

// Route for uploading staff image
router.post('/upload-staff-image', upload.single('image'), async (req, res, next) => {
  const staffId = req.body.staffId;

  if (!ObjectId.isValid(staffId)) {
    return sendError(res, 'Invalid staff ID format', 400);
  }

  try {
    const fileName = req.file.filename;
    const filePath = req.file.path;
    const imageUrl = `/uploads/${fileName}`;

    const updateDoc = {
      $set: {
        imageUrl: imageUrl,
        imagePath: filePath,
      },
    };
    
    const result = await staffService.updateStaff(staffId, updateDoc);

    if (result && result.matchedCount === 0) {
      return sendError(res, 'Staff not found', 404);
    }

    sendSuccess(res, {
      imageUrl: imageUrl,
      imagePath: filePath,
    }, 'Staff image uploaded successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

module.exports = router;
