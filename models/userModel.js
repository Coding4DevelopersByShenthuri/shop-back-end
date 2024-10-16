const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'user',
        immutable: true // Prevents mutation after creation
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type: Date,
        required: true
    }
});

const User = mongoose.model('User', userSchema,'user');
module.exports = User;
