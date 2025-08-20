// backend/Middlewares/verifyToken.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user's ID to the request object for use in other routes
        req.user = { id: decoded._id };
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken;
