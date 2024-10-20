// routes/contactRoutes.js
const express = require('express');
const Contact = require('../models/contactModel');
const router = express.Router();

router.post('/upload-contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate incoming data
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new contact instance
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save the contact message to the database
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting contact form', error });
  }
});

module.exports = router;

