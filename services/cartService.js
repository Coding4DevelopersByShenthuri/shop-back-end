const Cart = require('../models/cartModel'); 
const Product = require('../models/productModel'); 

// Fetch all cart items for a user
const getCartItems = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId: userId }).populate('items.productId'); // Populate to get product details
        return cart ? cart.items : []; // Return items or an empty array if cart doesn't exist
    } catch (error) {
        throw new Error('Error fetching cart items');
    }
};

// Add a product to the cart
const addProductToCart = async (userId, productId, quantity) => {
    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if the product already exists in the user's cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                // If the product exists, update its quantity
                existingItem.quantity += quantity;
            } else {
                // Add the product ID and quantity to the cart if it doesn't exist
                cart.items.push({ productId, quantity });
            }
            await cart.save();
            return { message: 'Product added to cart' };
        } else {
            // If no cart exists, create a new one with the product ID and quantity
            const newCart = new Cart({
                userId,
                items: [{ productId, quantity }],
            });
            await newCart.save();
            return { message: 'Product added to cart' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error adding product to cart');
    }
};

// Remove a product from the cart
const removeProductFromCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ userId: userId });
        if (cart) {
            // Remove the product ID from the cart
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
            return { message: 'Product removed from cart' };
        }
        throw new Error('Cart not found');
    } catch (error) {
        throw new Error('Error removing product from cart');
    }
};

// Clear the entire cart
const clearCart = async (userId) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: userId },
            { items: [] },
            { new: true } // Return the updated document
        );
        if (!cart) {
            throw new Error('Cart not found');
        }
        return { message: 'Cart cleared' };
    } catch (error) {
        throw new Error('Error clearing cart');
    }
};

module.exports = {
    getCartItems,
    addProductToCart,
    removeProductFromCart,
    clearCart,
};
