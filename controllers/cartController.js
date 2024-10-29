const Cart = require('../models/cartModel');
const cartService = require('../services/cartService');

// 1. Get Cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// 2. Add Item to Cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || quantity === undefined || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID and valid quantity are required' });
    }

    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            // If no cart exists for the user, create one
            cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
        } else {
            // Check if product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex !== -1) {
                // If product is already in the cart, update its quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // If product is not in the cart, add it
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// 3. Remove Item from Cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;

    // Validate input
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        if (cart.items.length === initialLength) {
            return res.status(400).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to remove item' });
    }
};

// 4. Clear Cart
exports.clearCart = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const response = await cartService.clearCart(userId);
        return res.status(200).json(response);
    } catch (error) {
        if (error.message === 'Cart not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
