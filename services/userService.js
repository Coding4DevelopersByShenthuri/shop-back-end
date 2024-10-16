const User = require('../models/userModel'); // Import the user schema

const createUser = async (email, password, birthday) => {
    try {
        // Create new user instance
        const newUser = new User({ email, password, birthday });
        // Save the user to the database
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

module.exports = {
    createUser
};
