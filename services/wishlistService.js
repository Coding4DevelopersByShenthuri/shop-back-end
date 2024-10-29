const Wishlist = require('../models/wishlistModel'); // Adjust the path according to your project structure
const Product = require('../models/productModel'); // Assuming you have a Product model

// Fetch all wishlist items for a user
const getWishlistItems = async (userId) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: userId }).populate('items'); // Populate to get product details
        return wishlistItems;
    } catch (error) {
        throw new Error('Error fetching wishlist items');
    }
};

// Add a product to the wishlist
const addProductToWishlist = async (userId, productId) => {
    try {
        // Find the wishlist for the user
        const wishlist = await Wishlist.findOne({ userId });

        if (wishlist) {
            // Check if the product already exists in the user's wishlist
            if (wishlist.items.includes(productId)) {
                return { message: 'Product already in wishlist' };
            } else {
                // Add the product ID to the wishlist if it doesn't exist
                wishlist.items.push(productId);
                await wishlist.save();
                return { message: 'Product added to wishlist' };
            }
        } else {
            // If no wishlist exists, create a new one with the product ID
            const newWishlist = new Wishlist({
                userId,
                items: [productId],
            });
            await newWishlist.save();
            return { message: 'Product added to wishlist' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error adding product to wishlist');
    }
};


// Remove a product from the wishlist
const removeProductFromWishlist = async (userId, productId) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: userId });
        if (wishlist) {
            // Remove the product ID from the wishlist
            wishlist.items = wishlist.items.filter((id) => id.toString() !== productId);
            await wishlist.save();
            return { message: 'Product removed from wishlist' };
        }
        throw new Error('Wishlist not found');
    } catch (error) {
        throw new Error('Error removing product from wishlist');
    }
};

module.exports = {
    getWishlistItems,
    addProductToWishlist,
    removeProductFromWishlist,
};
