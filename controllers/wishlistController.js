const Wishlist = require('../models/wishlistModel');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// 1. Get Wishlist
exports.getWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('items.productId');
        if (!wishlist) {
            return sendError(res, 'Wishlist not found', 404);
        }
        sendSuccess(res, wishlist, 'Wishlist fetched successfully');
    } catch (error) {
        next(error);
    }
};

// 2. Add Item to Wishlist
exports.addToWishlist = async (req, res, next) => {
    const { productId } = req.body;

    if (!productId) {
        return sendError(res, 'Product ID is required', 400);
    }

    try {
        let wishlist = await Wishlist.findOne({ userId: req.user.id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user.id, items: [{ productId }] });
        } else if (!wishlist.items.some(item => item.productId.toString() === productId)) {
            wishlist.items.push({ productId });
        } else {
            return sendError(res, 'Product already in wishlist', 400);
        }
        
        await wishlist.save();
        sendSuccess(res, wishlist, 'Product added to wishlist successfully', 201);
    } catch (error) {
        next(error);
    }
};

// 3. Remove Item from Wishlist
exports.removeFromWishlist = async (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
        return sendError(res, 'Product ID is required', 400);
    }

    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id });
        if (!wishlist) {
            return sendError(res, 'Wishlist not found', 404);
        }

        const initialLength = wishlist.items.length;
        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

        if (wishlist.items.length === initialLength) {
            return sendError(res, 'Product not found in wishlist', 400);
        }

        await wishlist.save();
        sendSuccess(res, null, 'Item removed from wishlist');
    } catch (error) {
        next(error);
    }
};

// 4. Clear Wishlist
exports.clearWishlist = async (req, res, next) => {
    try {
        const result = await Wishlist.findOneAndUpdate(
            { userId: req.user.id },
            { items: [] },
            { new: true }
        );

        if (!result) {
            return sendError(res, 'Wishlist not found', 404);
        }

        sendSuccess(res, null, 'Wishlist cleared successfully');
    } catch (error) {
        next(error);
    }
};
