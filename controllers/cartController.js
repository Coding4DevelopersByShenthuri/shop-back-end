const Cart = require('../models/cartModel');
const cartService = require('../services/cartService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// 1. Get Cart
exports.getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            return sendError(res, 'Cart not found', 404);
        }
        sendSuccess(res, cart, 'Cart fetched successfully');
    } catch (error) {
        next(error);
    }
};

// 2. Add Item to Cart
exports.addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined || quantity <= 0) {
        return sendError(res, 'Product ID and valid quantity are required', 400);
    }

    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex !== -1) {
                cart.items[itemIndex].quantity += parseInt(quantity);
            } else {
                cart.items.push({ productId, quantity: parseInt(quantity) });
            }
        }

        await cart.save();
        sendSuccess(res, cart, 'Product added to cart successfully', 201);
    } catch (error) {
        next(error);
    }
};

// 3. Remove Item from Cart
exports.removeFromCart = async (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
        return sendError(res, 'Product ID is required', 400);
    }

    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return sendError(res, 'Cart not found', 404);
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        if (cart.items.length === initialLength) {
            return sendError(res, 'Product not found in cart', 400);
        }

        await cart.save();
        sendSuccess(res, null, 'Item removed from cart');
    } catch (error) {
        next(error);
    }
};

// 4. Clear Cart
exports.clearCart = async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return sendError(res, 'User ID is required.', 400);
    }

    try {
        const response = await cartService.clearCart(userId);
        sendSuccess(res, response, 'Cart cleared successfully');
    } catch (error) {
        if (error.message === 'Cart not found') {
            return sendError(res, error.message, 404);
        }
        next(error);
    }
};
