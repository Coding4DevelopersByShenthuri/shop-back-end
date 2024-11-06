const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { ObjectId } = require('mongodb');
const path = require('path');
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
router.post('/upload-product', async (req, res) => {
  try {
    const data = req.body;
    const result = await productService.addProduct(data);
    res.status(201).send(result);
  } catch (error) {
    console.error("Error uploading product:", error);
    res.status(500).send({ error: "Failed to upload product" });
  }
});

// Get all products
router.get('/all-products', async (req, res) => {
  console.log("Fetching all products...");
  try {
    const products = await productService.getAllProducts();
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

// Update a product by ID
router.patch('/product/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid product ID format' });
  }

  try {
    const updatedProductData = req.body;
    const result = await productService.updateProduct(id, updatedProductData);

    if (!result) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ error: "Failed to update product" });
  }
});

// Delete a product by ID
router.delete('/product/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid product ID format' });
  }

  try {
    const result = await productService.deleteProduct(id);
    if (!result) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ error: "Failed to delete product" });
  }
});

// Get a single product by ID
router.get('/product/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid product ID format' });
  }

  try {
    const result = await productService.getProductById(id);
    if (!result) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ error: "Failed to fetch product" });
  }
});

// Route for uploading product image and storing image URL and path in MongoDB
router.post('/upload-product-image', upload.single('image'), async (req, res) => {
  const productId = req.body.productId;  // Get the product ID from the request

  if (!ObjectId.isValid(productId)) {
    return res.status(400).send({ error: 'Invalid product ID format' });
  }

  try {
    // Extract the necessary details from the uploaded file
    const filePath = req.file.path; // The path where the file is stored on the server
    const fileName = req.file.filename; // The uploaded file's name
    const baseUrl = `${req.protocol}://${req.get('host')}`; // Base URL of the server

    // Create the desired imageUrl format
    const imageUrl = `${baseUrl}/uploads/${fileName}`;


    // Upload the file to Vercel Blob Storage
    const { url } = await put(filePath, req.file.buffer, {
      access: 'public', // Public access to the file
    });


    // Update the product document with image URL and path
    const updateDoc = {
      $set: {
        imageURL: imageUrl,
        imagePath: filePath,
      },
    };

    const result = await productService.updateProduct(productId, updateDoc);

    if (!result) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.status(200).send({
      message: 'Product image uploaded successfully',
      imageURL: imageUrl,
      imagePath: filePath,
    });
  } catch (error) {
    console.error("Error uploading product image:", error);
    res.status(500).send({ error: "Failed to upload product image" });
  }
});

module.exports = router;
