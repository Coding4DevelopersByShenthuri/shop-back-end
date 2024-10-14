const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

// Add task
router.get('/stock_quantity', async (req, res) => {
  try {
    const products = await stockService.getStockQuantity()
    const stockQuantities = products.reduce((acc, product) => {
      acc[product.category] = product.stock_quantity; // Assuming each product has category and quantity
      return acc;
    }, {});

    res.json(stockQuantities); // Send the stock quantities as JSON response
  } catch (error) {
    console.error("Error fetching stock quantities:", error);
    res.status(500).send({ error: "Failed to fetch stock quantities" });
  }
});

module.exports = router;