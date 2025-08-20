// backend/Routes/TaskRouter.js

const express = require('express');
const router = express.Router();
const taskController = require('../Controllers/TaskController');
const verifyToken = require('../Middlewares/verifyToken');

// Protect all task routes to ensure only logged-in users can access them
router.use(verifyToken);

// Route to get all tasks for a user
router.get('/', taskController.getTasks);

// Route to add a new task
router.post('/', taskController.addTask);

// Route to update a specific task (e.g., mark as complete)
router.put('/:taskId', taskController.updateTask);

// Route to delete a specific task
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
