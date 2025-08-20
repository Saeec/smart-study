// backend/Controllers/AuthController.js

const User = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User with this email already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials." });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({
            message: "Login Successful",
            user: { _id: user._id, name: user.name, email: user.email },
            token: jwtToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { signup, login };
