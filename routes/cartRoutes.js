const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');
const cartService = require('../services/cartService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Fetch cart items for the authenticated user
router.get('/get-cart/:uid', async (req, res, next) => {
    const { uid } = req.params;
    try {
        const cartItems = await cartService.getCartItems(uid);
        sendSuccess(res, cartItems, 'Cart items fetched successfully');
    } catch (error) {
        next(error);
    }
});

// Get cart item count for the authenticated user
router.get('/cart-count/:uid', async (req, res, next) => {
    const { uid } = req.params;
    try {
        const cartItems = await cartService.getCartItems(uid);
        sendSuccess(res, { count: cartItems.length }, 'Cart count fetched successfully');
    } catch (error) {
        next(error);
    }
});

// Add a product to the cart for the authenticated user
router.post('/add-cart', async (req, res, next) => {
    const { productId, userId, quantity } = req.body;
    try {
        const result = await cartService.addProductToCart(userId, productId, quantity);
        sendSuccess(res, result, 'Product added to cart successfully', 201);
    } catch (error) {
        next(error);
    }
});

// Remove a specific product from the cart for the authenticated user
router.delete('/product/:productId', async (req, res, next) => {
    const productId = req.params.productId;
    const { userId } = req.body; 
    try {
        const result = await cartService.removeProductFromCart(userId, productId);
        sendSuccess(res, result, 'Product removed from cart successfully');
    } catch (error) {
        next(error);
    }
});

// Clear the entire cart for the authenticated user
router.delete('/clear-cart', async (req, res, next) => {
    const userId = req.body.userId;
    try {
        const result = await cartService.clearCart(userId);
        sendSuccess(res, result, 'Cart cleared successfully');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
