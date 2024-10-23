const Order = require('../models/orderModel');

const addOrder = async (data) => {
  const order = new Order(data);
  return await order.save();
};

module.exports = {
  aaddOrder
};