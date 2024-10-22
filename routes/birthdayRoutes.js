const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import your user model
const mailjet = require('node-mailjet').apiConnect(
  'fe1daf5f7c106fcaeb9b31f6c5310103',
  '451b124e90f4deafbc2460152561c856'
); // Set API keys

// Fetch upcoming birthdays (within the next 7 days)
router.get('/upcoming-birthdays', async (req, res) => {
  try {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 7); // Look for birthdays within the next 7 days

    // Find users whose birthdays are between current date and the next 7 days
    const upcomingBirthdays = await User.find({
      birthday: {
        $gte: currentDate,
        $lte: futureDate
      }
    });

    res.status(200).json(upcomingBirthdays);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming birthdays', error });
  }
});

// Route to send birthday wish via email
router.post('/send-wish', async (req, res) => {
  const { email, message } = req.body;
  const subject = 'Birthday Wishes';

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
