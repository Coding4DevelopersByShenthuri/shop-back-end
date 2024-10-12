const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  imagePath: String,
});

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;
