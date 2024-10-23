const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const taskService = require('../services/taskService');

// Email sending logic
router.post('/send-email', async (req, res) => {
    const { email, subject, text } = req.body;

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

// Add task
router.post('/upload-task', async (req, res) => {
    try {
        const result = await taskService.addTask(req.body);
        
        // Send email after task is added
        const emailData = {
            email: req.body.email, // Assuming the email is in the task data
            subject: `New Task Assigned: ${req.body.title}`, // Assuming title is in the task data
            text: `You have been assigned a new task: ${req.body.description}`, // Assuming description is in the task data
        };

        // Send email notification
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailData.email,
            subject: emailData.subject,
            text: emailData.text,
        });

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

module.exports = router;
