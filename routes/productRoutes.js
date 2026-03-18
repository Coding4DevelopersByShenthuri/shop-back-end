const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Naming the file
  },
});

const upload = multer({ storage });

// Upload a product
router.post('/upload-product', productController.uploadProduct);

// Get all products
router.get('/all-products', productController.getAllProducts);

// Update a product by ID
router.patch('/product/:id', productController.updateProduct);

// Delete a product by ID
router.delete('/product/:id', productController.deleteProduct);

// Get a single product by ID
router.get('/product/:id', productController.getProductById);

// Route for uploading product image
router.post('/upload-product-image', upload.single('image'), productController.uploadProductImage);

module.exports = router;

module.exports = router;
