const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the order detail schema
const orderDetailSchema = new Schema({
  productId: { type: String, required: true }, // ID of the product
  quantity: { type: Number, required: true },  // Quantity of the product
  price: { type: Number, required: true }       // Price of the product
});

// Define the order schema
const orderSchema = new Schema({
  orderNumber: { type: Number, unique: true }, // Unique order number
  staffId: { type: String, required: true }, // Reference to the staff
  orderDetail: [orderDetailSchema], // Array of order detail objects
}, { timestamps: true });

// Pre-save hook to auto-generate orderNumber
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Find the last order and increment the orderNumber
    const lastOrder = await this.constructor.findOne().sort({ orderNumber: -1 });
    this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1; // Start from 1 if no orders exist
  }
  next();
});

// Create the model
const Order = mongoose.model('Order', orderSchema, 'orders'); // Order model

module.exports = { Order };
