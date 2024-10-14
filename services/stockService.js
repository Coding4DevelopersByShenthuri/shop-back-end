const Product = require('../models/productModel');

const getStockQuantity = async () => {
  return await Product.find({});
};

module.exports = {
  getStockQuantity,
};
