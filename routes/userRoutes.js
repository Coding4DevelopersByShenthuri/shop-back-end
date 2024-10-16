const express = require('express');
const router = express.Router();
const { createUser, getUserDetails } = require('../services/userService');

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

module.exports = router;
