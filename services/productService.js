const Product = require('../models/productModel');

const addProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const getAllProducts = async () => {
  return await Product.find({});
};

const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};
