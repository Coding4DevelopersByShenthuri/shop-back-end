const express = require('express');
const nodemailer = require('nodemailer');
const { getUpcomingBirthdays } = require('../services/birthdayService');
const User = require('../models/userModel'); // Assuming you already have userModel.js
const router = express.Router();

// Route to get upcoming birthdays
router.get('/upcoming-birthdays', async (req, res) => {
  const today = new Date();
  const upcomingDate = new Date(today);
  upcomingDate.setDate(today.getDate() + 30); // Get birthdays within the next 30 days

  try {
    // Fetch birthdays from the user model directly
    const birthdays = await User.find({
      birthday: { $gte: today, $lte: upcomingDate },
    });

    res.status(200).json(birthdays);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load birthdays' });
  }
});

// Route to send birthday wish email
router.post('/send-wish', async (req, res) => {
  const { email, name, message } = req.body;

  // Configure your email transporter with Mailgun SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org', // Mailgun SMTP server
    port: 587, // Port for TLS
    auth: {
      user: 'your-mailgun-smtp-username', // Replace with your Mailgun SMTP username (e.g., postmaster@sandbox12345.mailgun.org)
      pass: 'your-mailgun-smtp-password',  // Replace with your Mailgun SMTP password
    },
  });

  const mailOptions = {
    from: 'your-email@your-domain.com', // Replace with the email from your Mailgun domain
    to: email,
    subject: 'Happy Birthday!',
    text: message || `Dear ${name},\n\nWishing you a very Happy Birthday! Have a great day ahead!\n\nBest regards,\nYour Company Name`, // Default message if not provided
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Birthday wish sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send birthday wish');
  }
});

module.exports = router;
