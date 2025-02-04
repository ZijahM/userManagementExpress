const express = require('express');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = userRepository.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            profileImageUrl: user.profileImageUrl
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/', authenticateToken, async (req, res) => {
    try {
        const { username, email } = req.body;
        const updatedUser = userRepository.updateUserProfile(req.user.id, { username, email });
        
        res.json({
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
