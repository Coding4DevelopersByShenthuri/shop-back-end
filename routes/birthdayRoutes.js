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

    // Format the current and future dates to "yyyy-mm-dd" strings
    const currentDateString = currentDate.toISOString().split('T')[0];
    const futureDateString = futureDate.toISOString().split('T')[0];

    // Find users whose birthdays are between current date and the next 7 days, ignoring empty strings
    const upcomingBirthdays = await User.find({
      birthday: {
        $gte: currentDateString,
        $lte: futureDateString,
        $ne: '' // Exclude empty strings
      }
    });

    res.status(200).json(upcomingBirthdays);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming birthdays', error });
  }
});


// Route to send birthday wish via email
router.post('/send-wish', async (req, res) => {
  const { email, message, name } = req.body;
  const subject = '🎉 Happy Birthday Wishes! 🎉';
  
  // Basic birthday template with dynamic content
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
      <h1 style="color: #4CAF50;">🎂 Happy Birthday, Enjoy a 10% discount on your purchase!, ${name}! 🎂</h1>
      <p style="font-size: 18px;">We hope you have a fantastic day filled with joy, love, and laughter!</p>
      <p>${message}</p>
      <div style="margin-top: 20px;">
        <img src="https://handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg" alt="Birthday Cake" style="width: 200px;"/>
      </div>
      <p style="font-size: 16px; color: #555;">Best wishes, <br/> By: Team Shenthu MART</p>
    </div>
  `;

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
                Name: name
              }
            ],
            Subject: subject,
            HTMLPart: htmlTemplate
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
