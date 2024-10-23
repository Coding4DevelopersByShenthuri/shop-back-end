const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const mailjet = require('node-mailjet').apiConnect(
  'fe1daf5f7c106fcaeb9b31f6c5310103',
  '451b124e90f4deafbc2460152561c856'
); // Set API keys

// Add task
router.post('/upload-task', async (req, res) => {
  try {
    const result = await taskService.addTask(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Get all tasks
router.get('/all-tasks', async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Update task
router.put('/task/:id', async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete('/task/:id', async (req, res) => {
  try {
    const deletedTask = await taskService.deleteTask(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Get task by ID
router.get('/task/:id', async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.post('/send-task-assignment-mail', async (req, res) => {
  const { title, staffId, description, priority, dueDate, status, staffMail } = req.body;
  const subject = `🔔 New Task Assigned: ${title}`;
  
  // Basic task assignment template with dynamic content
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
      <h1 style="color: #4CAF50;">🚨 Task Assigned: ${title}</h1>
      <p style="font-size: 18px;">You have been assigned a new task. Please see the details below:</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${status}</p>
      <div style="margin-top: 20px;">
        <p style="font-size: 16px; color: #555;">Best regards, <br/> Task Management Team</p>
      </div>
    </div>
  `;

  try {
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'shenthurimaran@gmail.com',
              Name: 'Task Assignment'
            },
            To: [
              {
                Email: staffMail, // Replace with staff's email
                Name: staffId // Optionally, replace with staff's name
              }
            ],
            Subject: subject,
            HTMLPart: htmlTemplate
          }
        ]
      });

    const result = await request;
    res.status(200).json({
      success: true,
      message: 'Task assignment email sent successfully',
      result: result.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send task assignment email',
      error: error.message
    });
  }
});


module.exports = router;