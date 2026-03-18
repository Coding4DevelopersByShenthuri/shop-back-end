const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');
const { sendSuccess } = require('../utils/responseHelper');

router.get('/stock_quantity', async (req, res, next) => {
  try {
    const products = await stockService.getStockQuantity();
    
    // Accumulate stock quantities by category
    const stockQuantities = products.reduce((acc, product) => {
      const category = product.category;
      const quantity = parseInt(product.stock_quantity, 10);

      if (acc[category]) {
        acc[category] += quantity;
      } else {
        acc[category] = quantity;
      }
      
      return acc;
    }, {});

    sendSuccess(res, stockQuantities, 'Stock quantities fetched successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;