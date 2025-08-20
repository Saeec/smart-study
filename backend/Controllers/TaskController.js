// backend/Controllers/TaskController.js

const Task = require('../Models/Task');

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 }); // Sort by deadline
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// Add a new task
exports.addTask = async (req, res) => {
    const { title, subject, deadline, priority } = req.body;

    if (!title || !subject) {
        return res.status(400).json({ message: 'Title and subject are required' });
    }

    try {
        const newTask = new Task({
            title,
            subject,
            deadline,
            priority,
            user: req.user.id,
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
    }
};

// Update a task (e.g., mark as complete)
exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, user: req.user.id }, // Ensure user can only update their own tasks
            { completed },
            { new: true } // Return the updated document
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, user: req.user.id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};
