// backend/Routes/DashboardRouter.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/DashboardController');
const verifyToken = require('../Middlewares/verifyToken');

// Protect all dashboard routes
router.use(verifyToken);

// Define the route for getting dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
