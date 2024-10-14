const Staff = require('../models/staffModel');

const addStaff = async (data) => {
  try {
    const staff = new Staff(data);
    return await staff.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};


const getAllStaffs = async () => {
  return await Staff.find({});
};

const updateStaff = async (id, data) => {
  return await Staff.findByIdAndUpdate(id, data, { new: true });
};

const deleteStaff = async (id) => {
  return await Staff.findByIdAndDelete(id);
};

const getStaffById = async (id) => {
  return await Staff.findById(id);
};

module.exports = {
  addStaff,
  getAllStaffs,
  updateStaff,
  deleteStaff,
  getStaffById,
};
