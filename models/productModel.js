const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  imageURL: { type: String, required: false },
  stock_quantity: { type: Number, required: true },
  origin: { type: String, required: true },
});

const Product = mongoose.model('Product', ProductSchema, 'product');
module.exports = Product;
