const express = require('express');
const { getUpcomingBirthdays } = require('../services/birthdayService');
const User = require('../models/userModel'); // Assuming you already have userModel.js
const router = express.Router();
const mailjet = require('node-mailjet').apiConnect('fe1daf5f7c106fcaeb9b31f6c5310103', '54e0acb17e4d1f0743729f0eb6fee740'); // Set API keys

// Route to get upcoming birthdays and send birthday wish mails
router.get('/upcoming-birthdays', async (req, res) => {
  const today = new Date();
  const upcomingDate = new Date(today);
  upcomingDate.setDate(today.getDate() + 30); // Get birthdays within the next 30 days

  try {
    // Fetch birthdays from the user model directly (if needed)
    const birthdays = await User.find({
      birthday: { $gte: today, $lte: upcomingDate }
    });
console.log(birthdays)
    // Alternatively, use the getUpcomingBirthdays service function
    const birthdayData = await getUpcomingBirthdays(); // You can use this or 'birthdays'

    // Iterate over each user with an upcoming birthday and send email
    for (const user of birthdays) {
      const subject = `Happy Birthday, ${user.email}! 🎉`;
      const messageBody = `
        <h1>Happy Birthday, ${user.email}!</h1>
        <p>We wish you all the best on your special day!</p>
        <p>Have an amazing year ahead 🎂🎉.</p>
      `;

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
                  Email: user.email, // Replace with user.email when ready
                  Name: user.name
                }
              ],
              Subject: subject,
              HTMLPart: messageBody
            }
          ]
        });

      try {
        const result = await request;
        console.log(`Mail sent successfully to: ${user.email}`, result.body);
      } catch (error) {
        console.error(`Error sending email to ${user.email}: `, error.response ? error.response.body : error);
      }
    }

    // Respond with fetched birthdays
    res.status(200).json(birthdays); // or res.status(200).json(birthdayData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load birthdays or send emails' });
  }
});

module.exports = router;
