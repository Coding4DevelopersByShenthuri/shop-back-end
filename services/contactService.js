// services/contactService.js
const Contact = require('../models/contactModel');

// Function to create a new contact message
const createContact = async (contactData) => {
  try {
    const newContact = new Contact(contactData);
    await newContact.save();

    return {
      success: true,
      message: 'Contact message saved successfully!'
    };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return {
      success: false,
      message: 'Error saving contact message',
      error
    };
  }
};

module.exports = {
  createContact
};
