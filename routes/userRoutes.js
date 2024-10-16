const express = require('express');
const router = express.Router();
const { createUser } = require('../services/userService');

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, birthday } = req.body;

    try {
        const newUser = await createUser(email, password, birthday);
        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
