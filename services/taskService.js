const Task = require('../models/taskModel');

const addTask = async (data) => {
  const task = new Task(data);
  return await task.save();
};

const getAllTasks = async () => {
  return await Task.find({});
};

const updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { new: true });
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const findTaskByStaffId = async (id) => {
  return await Task.find({staffId:id});
};

module.exports = {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskById,
  findTaskByStaffId
};
