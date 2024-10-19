const express = require('express');
const router = express.Router();
const crypto = require('crypto');

let dailyToken = "";

// Function to generate a random daily token
const generateDailyToken = () => {
  dailyToken = crypto.randomBytes(16).toString('hex'); // Generate a new random token
  console.log(`New token for today: ${dailyToken}`);
};

// Run this function every 24 hours to change the token
setInterval(generateDailyToken, 24 * 60 * 60 * 1000); // Change the token every 24 hours
generateDailyToken(); // Initialize the token when server starts

// Route to get the daily token
router.get('/get-daily-token', (req, res) => {
  res.json({ token: dailyToken });
});

module.exports = router;
