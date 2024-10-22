const User = require('../models/userModel'); // Import the user schema

const createUser = async (uid, email, birthday , name) => {
    try {
        // Create new user instance
        const newUser = new User({ uid, email, birthday , name });
        // Save the user to the database
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

const findUserByUid = async (uid) => {
    try {
        const user = await User.findOne({ uid }); // Find one user by UID
        if (!user) {
            return null; // User not found
        }
        return user; // Return user details
    } catch (error) {
        throw new Error('Error finding user by UID: ' + error.message);
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

// Update user by UID
const updateUserByUid = async (uid, updates) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { uid },
            { $set: updates }, // Use $set to update specific fields
            { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return null; // User not found
        }
        return updatedUser; // Return updated user details
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};

module.exports = {
    createUser,
    getUserDetails,
    findUserByUid,
    updateUserByUid
};
