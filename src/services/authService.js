const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

class AuthService {
    async register(username, email, password) {
        if (userRepository.existsByEmail(email)) {
            throw new Error('Email already exists');
        }

        const user = new User(username, email, password);
        return userRepository.create(user);
    }

    async authenticate(username, password, deviceInfo) {
        const user = userRepository.findByUsername(username);
        if (!user || !user.comparePassword(password)) {
            throw new Error('Invalid credentials');
        }

        const deviceId = user.addDevice(deviceInfo);
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return { 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            }, 
            accessToken, 
            refreshToken,
            deviceId
        };
    }

    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            const user = userRepository.findByEmail(decoded.email);

            if (!user || user.refreshToken !== refreshToken) {
                throw new Error('Invalid refresh token');
            }

            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            user.setRefreshToken(newRefreshToken);
            userRepository.save(user);

            return { 
                accessToken: newAccessToken, 
                refreshToken: newRefreshToken 
            };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    generateAccessToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    generateRefreshToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email 
            },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );
    }

    async logoutDevice(userId, deviceId) {
        const user = userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.logoutDevice(deviceId);
        return userRepository.save(user);
    }
}

module.exports = new AuthService();
