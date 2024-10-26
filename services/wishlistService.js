const Wishlist = require('../models/wishlistModel'); // Adjust the path according to your project structure
const Product = require('../models/productModel'); // Assuming you have a Product model

// Fetch all wishlist items for a user
const getWishlistItems = async (userId) => {
    try {
        const wishlistItems = await Wishlist.find({ user: userId }).populate('products'); // Populate to get product details
        return wishlistItems;
    } catch (error) {
        throw new Error('Error fetching wishlist items');
    }
};

// Add a product to the wishlist
const addProductToWishlist = async (userId, productId) => {
    try {
        // Check if the product already exists in the user's wishlist
        const existingWishlist = await Wishlist.findOne({ user: userId });
        if (existingWishlist) {
            // If it exists, add the product ID to the wishlist
            if (!existingWishlist.products.includes(productId)) {
                existingWishlist.products.push(productId);
                await existingWishlist.save();
            }
        } else {
            // If not, create a new wishlist entry
            const newWishlist = new Wishlist({
                user: userId,
                products: [productId],
            });
            await newWishlist.save();
        }
        return { message: 'Product added to wishlist' };
    } catch (error) {
        throw new Error('Error adding product to wishlist');
    }
};

// Remove a product from the wishlist
const removeProductFromWishlist = async (userId, productId) => {
    try {
        const wishlist = await Wishlist.findOne({ user: userId });
        if (wishlist) {
            // Remove the product ID from the wishlist
            wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
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
