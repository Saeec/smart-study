// backend/Routes/AuthRouter.js

const express = require('express');
const router = express.Router();

// We will create these files in the next steps
const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupValidation, signup);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, login);

module.exports = router;
