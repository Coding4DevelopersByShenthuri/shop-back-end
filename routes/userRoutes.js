const express = require('express');
const router = express.Router();
const { createUser, getUserDetails, findUserByUid, updateUserByUid } = require('../services/userService');
const User = require('../models/userModel');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Signup route
router.post('/createuser/:uid', async (req, res, next) => {
    const { uid } = req.params;
    const { email, birthday, name } = req.body;

    try {
        const existingUser = await findUserByUid(uid);
        
        if (existingUser) {
            const updatedUser = await updateUserByUid(uid, { email, birthday, name });
            sendSuccess(res, updatedUser, 'User updated successfully');
        } else {
            const newUser = await createUser(uid, email, birthday, name);
            sendSuccess(res, newUser, 'User created successfully', 201);
        }
    } catch (error) {
        next(error);
    }
});

// Get user details route
router.get('/userdetail/:uid', async (req, res, next) => {
    const { uid } = req.params;

    try {
        const userDetails = await getUserDetails(uid);
        if (!userDetails) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, userDetails, 'User details fetched successfully');
    } catch (error) {
        next(error);
    }
});

// Get upcoming birthdays route
router.get('/upcoming-birthdays', async (req, res, next) => {
    try {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const upcomingBirthdays = await User.find({
            birthday: { $gte: today, $lte: nextWeek },
        });

        sendSuccess(res, upcomingBirthdays, 'Upcoming birthdays fetched successfully');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
