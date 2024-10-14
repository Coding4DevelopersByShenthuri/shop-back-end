const Notifications = require('../models/notificationsModel');

const getStockQuantity = async () => {
  return await Notifications.find({});
};

module.exports = {
  getStockQuantity,
};
