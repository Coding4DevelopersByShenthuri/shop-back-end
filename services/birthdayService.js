// services/birthdayService.js
const User = require('../models/userModel');

// Service to fetch upcoming birthdays
const getUpcomingBirthdays = async () => {
  const today = new Date();
  const upcomingDate = new Date(today);
  upcomingDate.setDate(today.getDate() + 30); // Get birthdays within the next 30 days

  try {
    const birthdays = await User.find({
      birthday: { $gte: today, $lte: upcomingDate }
    }).sort({ birthday: 1 }); // Sort by upcoming birthdays
    return birthdays;
  } catch (error) {
    throw new Error('Error fetching upcoming birthdays');
  }
};

module.exports = {
  getUpcomingBirthdays,
};
