// controllers/productController.js
const productService = require('../services/productService');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { ObjectId } = require('mongodb');

const uploadProduct = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await productService.addProduct(data);
        sendSuccess(res, result, 'Product uploaded successfully', 201);
    } catch (error) {
        next(error);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        sendSuccess(res, products, 'Products fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return sendError(res, 'Invalid product ID format', 400);
        }
        const updatedProductData = req.body;
        const result = await productService.updateProduct(id, updatedProductData);
        if (!result) {
            return sendError(res, 'Product not found', 404);
        }
        sendSuccess(res, result, 'Product updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return sendError(res, 'Invalid product ID format', 400);
        }
        const result = await productService.deleteProduct(id);
        if (!result) {
            return sendError(res, 'Product not found', 404);
        }
        sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return sendError(res, 'Invalid product ID format', 400);
        }
        const result = await productService.getProductById(id);
        if (!result) {
            return sendError(res, 'Product not found', 404);
        }
        sendSuccess(res, result, 'Product fetched successfully');
    } catch (error) {
        next(error);
    }
};

const uploadProductImage = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        if (!ObjectId.isValid(productId)) {
            return sendError(res, 'Invalid product ID format', 400);
        }

        const filePath = req.file.path;
        const fileName = req.file.filename;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/${fileName}`;

        const updateDoc = {
            $set: {
                imageURL: imageUrl,
                imagePath: filePath,
            },
        };

        const result = await productService.updateProduct(productId, updateDoc);
        if (!result) {
            return sendError(res, 'Product not found', 404);
        }

        sendSuccess(res, { imageURL: imageUrl, imagePath: filePath }, 'Product image uploaded successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductById,
    uploadProductImage
};
