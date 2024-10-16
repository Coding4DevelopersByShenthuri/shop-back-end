const User = require('../models/userModel'); // Import the user schema

const createUser = async (uid, email, birthday) => {
    try {
        // Create new user instance
        const newUser = new User({ uid, email, birthday });
        // Save the user to the database
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

const getUserDetails = async (uid) => {
    try {
        // Find user by UID
        const user = await User.find({ uid }); // or use any method to find user based on your UID field
        if (!user) {
            return null; // User not found
        }
        return user; // Return user details
    } catch (error) {
        throw new Error('Error fetching user details: ' + error.message);
    }
};

module.exports = {
    createUser,
    getUserDetails
};
