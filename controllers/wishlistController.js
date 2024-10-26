const Wishlist = require('../models/wishlistModel');

// 1. Get Wishlist
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('items.productId');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

// 2. Add Item to Wishlist
exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;

    // Validate input
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        let wishlist = await Wishlist.findOne({ userId: req.user.id });
        
        if (!wishlist) {
            // If no wishlist exists for the user, create one
            wishlist = new Wishlist({ userId: req.user.id, items: [{ productId }] });
        } else if (!wishlist.items.some(item => item.productId.toString() === productId)) {
            // If product is not already in wishlist, add it
            wishlist.items.push({ productId });
        } else {
            // If the product is already in the wishlist
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        
        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (error) {
        console.error('Error adding to wishlist:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};

// 3. Remove Item from Wishlist
exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;

    // Validate input
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const initialLength = wishlist.items.length;
        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

        if (wishlist.items.length === initialLength) {
            return res.status(400).json({ message: 'Product not found in wishlist' });
        }

        await wishlist.save();
        res.json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing item from wishlist:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to remove item' });
    }
};

// 4. Clear Wishlist
exports.clearWishlist = async (req, res) => {
    try {
        const result = await Wishlist.findOneAndUpdate(
            { userId: req.user.id },
            { items: [] },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.json({ message: 'Wishlist cleared' });
    } catch (error) {
        console.error('Error clearing wishlist:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to clear wishlist' });
    }
};
