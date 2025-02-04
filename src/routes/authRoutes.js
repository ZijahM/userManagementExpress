const express = require('express');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
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

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await authService.register(username, email, password);
        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/authenticate', async (req, res) => {
    try {
        const { username, password, deviceName, deviceType } = req.body;
        const result = await authService.authenticate(username, password, { deviceName, deviceType });
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshToken(refreshToken);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.get('/devices', authenticateToken, async (req, res) => {
    try {
        const devices = userRepository.getUserDevices(req.user.id);
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/devices/:deviceId/logout', authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;
        await authService.logoutDevice(req.user.id, deviceId);
        res.json({ message: 'Device logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
