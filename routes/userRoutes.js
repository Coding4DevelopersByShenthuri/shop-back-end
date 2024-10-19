const express = require('express');
const router = express.Router();
const { createUser, getUserDetails } = require('../services/userService');
const User = require('../models/userModel'); // Assuming you have a User model

// Signup route
router.post('/createuser/:uid', async (req, res) => {
    const { uid } = req.params;
    const { email, birthday } = req.body;

    try {
        const newUser = await createUser(uid, email, birthday);
        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user details route
router.get('/userdetail/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const userDetails = await getUserDetails(uid);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User details fetched successfully', userDetails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get upcoming birthdays route
router.get('/upcoming-birthdays', async (req, res) => {
    try {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const upcomingBirthdays = await User.find({
            birthday: { $gte: today, $lte: nextWeek },
        });

        res.status(200).json(upcomingBirthdays);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upcoming birthdays' });
    }
});

module.exports = router;
