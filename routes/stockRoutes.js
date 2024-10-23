const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

router.get('/stock_quantity', async (req, res) => {
  try {
    const products = await stockService.getStockQuantity();
    
    // Accumulate stock quantities by category
    const stockQuantities = products.reduce((acc, product) => {
      const category = product.category;
      const quantity = parseInt(product.stock_quantity, 10); // Convert stock_quantity to a number

      // If the category already exists in the accumulator, sum the quantity
      if (acc[category]) {
        acc[category] += quantity;
      } else {
        // Otherwise, initialize it with the current product's stock quantity
        acc[category] = quantity;
      }
      
      return acc;
    }, {});

    res.json(stockQuantities); // Send the accumulated stock quantities as JSON response
  } catch (error) {
    console.error("Error fetching stock quantities:", error);
    res.status(500).send({ error: "Failed to fetch stock quantities" });
  }
});


module.exports = router;