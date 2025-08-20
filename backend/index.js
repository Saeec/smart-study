// backend/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./Models/db');

// Import routers
const authRoutes = require('./Routes/AuthRouter');
const timerRoutes = require('./Routes/TimerRouter');
const taskRoutes = require('./Routes/TaskRouter');
const dashboardRoutes = require('./Routes/DashboardRouter');
const noteRoutes = require('./Routes/NoteRouter'); // <-- Import new router

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notes', noteRoutes); // <-- Use new router

// Default route
app.get('/', (req, res) => {
    res.send('Smart Timer API is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
