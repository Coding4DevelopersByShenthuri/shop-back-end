const express = require('express');
const router = express.Router();
const statService = require('../services/statService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

router.get('/dashboard-stats', async (req, res) => {
    try {
        const stats = await statService.getDashboardStats();
        sendSuccess(res, stats, 'Dashboard stats fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
});

router.get('/sales-overview', async (req, res) => {
    try {
        const data = await statService.getSalesOverview();
        sendSuccess(res, data, 'Sales overview fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
});

router.get('/category-distribution', async (req, res) => {
    try {
        const data = await statService.getCategoryDistribution();
        sendSuccess(res, data, 'Category distribution fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
});

router.get('/recent-orders', async (req, res) => {
    try {
        const data = await statService.getRecentOrders();
        sendSuccess(res, data, 'Recent orders fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
});

module.exports = router;
