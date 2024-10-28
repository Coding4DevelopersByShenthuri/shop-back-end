const Cart = require('../models/cartModel'); // Change to the correct model

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
    const { productId, quantity } = req.body; // Including quantity for cart

    // Validate input
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        
        if (!cart) {
            // If no cart exists for the user, create one
            cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
        } else {
            // Check if product already exists in cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                // If product exists, update the quantity
                existingItem.quantity += quantity; // Adjust this logic as needed
            } else {
                // If product is not already in cart, add it
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
    try {
        const result = await Cart.findOneAndUpdate(
            { userId: req.user.id },
            { items: [] },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};
