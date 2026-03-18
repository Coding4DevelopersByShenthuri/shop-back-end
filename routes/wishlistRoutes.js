const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const wishlistController = require('../controllers/wishlistController');
const wishlistService = require('../services/wishlistService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Fetch wishlist items for the authenticated user
router.get('/get-list/:uid', async (req, res, next) => {
    const { uid } = req.params;
    try {
        const wishlistItems = await wishlistService.getWishlistItems(uid);
        sendSuccess(res, wishlistItems, 'Wishlist items fetched successfully');
    } catch (error) {
        next(error);
    }
});

router.get('/wish-count/:uid', async (req, res, next) => {
    const { uid } = req.params;
    try {
        const wishlistItems = await wishlistService.getWishlistItems(uid);
        const count = (wishlistItems && wishlistItems[0] && wishlistItems[0].items) ? wishlistItems[0].items.length : 0;
        sendSuccess(res, { count }, 'Wishlist count fetched successfully');
    } catch (error) {
        next(error);
    }
});

// Add a product to the wishlist for the authenticated user
router.post('/add-list', async (req, res, next) => {
    const { productId, userId } = req.body;
    try {
        const result = await wishlistService.addProductToWishlist(userId, productId);
        sendSuccess(res, result, 'Product added to wishlist successfully', 201);
    } catch (error) {
        next(error);
    }
});

// Remove a specific product from the wishlist for the authenticated user
router.delete('/product/:productId', async (req, res, next) => {
    const { productId } = req.params;
    const { userId } = req.body; 
    try {
        const result = await wishlistService.removeProductFromWishlist(userId, productId);
        sendSuccess(res, result, 'Product removed from wishlist successfully');
    } catch (error) {
        next(error);
    }
});

// Clear the entire wishlist for the authenticated user
router.delete('/clear', authMiddleware, async (req, res, next) => {
    const userId = req.user.id;
    try {
        const result = await wishlistService.clearWishlist(userId);
        sendSuccess(res, result, 'Wishlist cleared successfully');
    } catch (error) {
        next(error);
    }
});

module.exports = router;

