const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Each user has one wishlist
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Reference to the Product model
        }
    ]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
