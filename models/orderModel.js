const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the order detail schema
const orderDetailSchema = new Schema({
  category: { type: String, required: true },  // Category of the product
  id: { type: String, required: true },        // Product ID
  imageURL: { type: String },                  // Image URL of the product
  name: { type: String, required: true },      // Name of the product
  origin: { type: String },                    // Origin of the product
  price: { type: Number, required: true },     // Price of the product
  quantity: { type: Number, required: true },  // Quantity ordered
  stock_quantity: { type: Number },            // Stock available
  unit: { type: String },                      // Unit of measurement (e.g., "Roll")
  _id: { type: String, required: true }        // Product unique identifier
});

// Define the order schema
const orderSchema = new Schema({
  orderNumber: { type: Number, unique: true },  // Unique order number
  userId: { type: String, required: true },    // Reference to the staff
  orderDetail: [orderDetailSchema],             // Array of order detail objects
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
const Order = mongoose.model('Order', orderSchema, 'order'); // Order model
module.exports = Order;
