// routes/birthdayRoutes.js
const express = require('express');
const { getUpcomingBirthdays } = require('../services/birthdayService');
const User = require('../models/userModel'); // Assuming you already have userModel.js
const router = express.Router();
const mailjet = require('node-mailjet').apiConnect('fe1daf5f7c106fcaeb9b31f6c5310103', '451b124e90f4deafbc2460152561c856'); // Set API keys

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

router.post('/send-wish', async (req, res) => {
  const { email, message } = req.body;
  const subject = 'test subject';

  try {
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'shenthurimaran@gmail.com',
              Name: 'Birthday Wishes'
            },
            To: [
              {
                Email: email,
                Name: email
              }
            ],
            Subject: subject,
            HTMLPart: message
          }
        ]
      });

    const result = await request;
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      result: result.body // Optional: Include result details
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message // Optional: Include error details
    });
  }
});


module.exports = router;
