const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const wishlistController = require('../controllers/wishlistController');
const wishlistService = require('../services/wishlistService');

// Fetch wishlist items for the authenticated user
router.get('/get-list', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is set in the request by the auth middleware
        const wishlistItems = await wishlistService.getWishlistItems(userId);
        res.status(200).json(wishlistItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a product to the wishlist for the authenticated user
router.post('/add-list', authMiddleware, async (req, res) => {
    const { productId } = req.body; // Expecting product ID in the request body
    const userId = req.user.id; // Get user ID from the authenticated user

    try {
        const message = await wishlistService.addProductToWishlist(userId, productId);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove a specific product from the wishlist for the authenticated user
router.delete('/:productId', authMiddleware, async (req, res) => {
    const { productId } = req.params; // Get product ID from the URL parameters
    const userId = req.user.id; // Get user ID from the authenticated user

    try {
        const message = await wishlistService.removeProductFromWishlist(userId, productId);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clear the entire wishlist for the authenticated user
router.delete('/clear', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Get user ID from the authenticated user

    try {
        const message = await wishlistService.clearWishlist(userId); // Implement clearWishlist in your service
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

