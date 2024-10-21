// routes/birthdayRoutes.js
const express = require('express');
const { getUpcomingBirthdays } = require('../services/birthdayService');
const User = require('../models/userModel'); // Assuming you already have userModel.js
const router = express.Router();

// Route to get upcoming birthdays
router.get('/upcoming-birthdays', async (req, res) => {
  const today = new Date();
  const upcomingDate = new Date(today);
  upcomingDate.setDate(today.getDate() + 30); // Get birthdays within the next 30 days

  try {
    // Fetch birthdays from the user model directly (if needed)
    const birthdays = await User.find({
      birthday: { $gte: today, $lte: upcomingDate }
    });
    
    // Alternatively, use the getUpcomingBirthdays service function
    const birthdayData = await getUpcomingBirthdays();
    
    // Respond with fetched data (choose either birthdays or birthdayData depending on logic)
    res.status(200).json(birthdays); // or res.status(200).json(birthdayData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load birthdays' });
  }
});

module.exports = router;
