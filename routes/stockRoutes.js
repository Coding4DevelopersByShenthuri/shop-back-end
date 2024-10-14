const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

// Add task
router.get('/stock_quantity', async (req, res) => {
  try {
    const result = await stockService.getStockQuantity(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Failed to add task" });
  }
});