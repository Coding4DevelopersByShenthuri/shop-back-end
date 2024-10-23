const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

router.post('/add-order', async (req, res) => {
    try {
        const result = await orderService.addOrder(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).json({ error: "Failed to add order" });
    }
});


module.exports = router;
