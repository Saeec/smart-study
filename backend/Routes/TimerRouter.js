// backend/Routes/TimerRouter.js

const express = require('express');
const router = express.Router();
const timerController = require('../Controllers/TimerController');

const verifyToken = require('../Middlewares/verifyToken'); // <-- Import the new middleware

// Use the verifyToken middleware for all routes in this file
// This ensures that a user must be logged in to access any of these endpoints.
router.use(verifyToken);

// Subject Routes
router.get('/subjects', timerController.getSubjects);
router.post('/subjects', timerController.addSubject);

// Session Routes
router.get('/sessions', timerController.getSessions);
router.post('/sessions', timerController.addSession);

module.exports = router;
