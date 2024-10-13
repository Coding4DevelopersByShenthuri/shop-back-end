// models/taskModel.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  dueDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // Reference to staff member
});

const Task = mongoose.model('Task', TaskSchema,'task');

module.exports = Task;
