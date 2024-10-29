const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');
const cartService = require('../services/cartService');

// Fetch cart items for the authenticated user
router.get('/get-cart/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const cartItems = await cartService.getCartItems(uid);
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get cart item count for the authenticated user
router.get('/cart-count/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const cartItems = await cartService.getCartItems(uid);
        res.status(200).json({
            count: cartItems.items.length // Assuming items is an array in the response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a product to the cart for the authenticated user
router.post('/add-cart', async (req, res) => {
    const { productId, userId, quantity } = req.body; // Expecting product ID and quantity in the request body
    try {
        const message = await cartService.addProductToCart(userId, productId, quantity);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove a specific product from the cart for the authenticated user
router.delete('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const { userId } = req.body; 

    try {
        const message = await cartService.removeProductFromCart(userId, productId);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clear the entire cart for the authenticated user
router.delete('/clear-cart', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Get user ID from the authenticated user

    try {
        const message = await cartService.clearCart(userId); // Implement clearCart in your service
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
