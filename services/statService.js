const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const getDashboardStats = async () => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        
        const allOrders = await Order.find();
        let totalSales = 0;
        allOrders.forEach(order => {
            order.orderDetail.forEach(item => {
                totalSales += (item.price * item.quantity);
            });
        });

        // Conversion rate (mocked for now, but based on real data if possible)
        // Usually: (orders / unique visitors) * 100
        const conversionRate = totalUsers > 0 ? ((allOrders.length / totalUsers) * 10).toFixed(1) : 0;

        return {
            totalSales: totalSales,
            totalUsers: totalUsers,
            totalProducts: totalProducts,
            conversionRate: conversionRate + '%',
            orderCount: allOrders.length
        };
    } catch (error) {
        throw new Error('Error fetching dashboard stats: ' + error.message);
    }
};

const getSalesOverview = async () => {
    try {
        const allOrders = await Order.find().sort({ createdAt: 1 });
        
        // Group by month for example
        const monthlySales = {};
        allOrders.forEach(order => {
            const date = new Date(order.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });
            
            let orderTotal = 0;
            order.orderDetail.forEach(item => {
                orderTotal += (item.price * item.quantity);
            });

            if (!monthlySales[month]) {
                monthlySales[month] = 0;
            }
            monthlySales[month] += orderTotal;
        });

        const salesData = Object.keys(monthlySales).map(month => ({
            name: month,
            sales: monthlySales[month]
        }));

        return salesData;
    } catch (error) {
        throw new Error('Error fetching sales overview: ' + error.message);
    }
};

const getCategoryDistribution = async () => {
    try {
        const products = await Product.find();
        const distribution = {};

        products.forEach(p => {
            if (!distribution[p.category]) {
                distribution[p.category] = 0;
            }
            distribution[p.category]++;
        });

        const distributionData = Object.keys(distribution).map(category => ({
            name: category,
            value: distribution[category]
        }));

        return distributionData;
    } catch (error) {
        throw new Error('Error fetching category distribution: ' + error.message);
    }
};

const getRecentOrders = async (limit = 5) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(limit);
        return orders;
    } catch (error) {
        throw new Error('Error fetching recent orders: ' + error.message);
    }
};

module.exports = {
    getDashboardStats,
    getSalesOverview,
    getCategoryDistribution,
    getRecentOrders
};
