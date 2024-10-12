const express = require('express');
const router = express.Router();
const staffService = require('../services/staffService');

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

module.exports = router;
