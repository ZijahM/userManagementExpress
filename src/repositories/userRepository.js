const User = require('../models/user');

class UserRepository {
    constructor() {
        // In-memory implementation
        this.users = [];
    }

    create(user) {
        this.users.push(user);
        return user;
    }

    findByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    findByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    findById(id) {
        return this.users.find(user => user.id === id);
    }

    findByVerificationToken(token) {
        return this.users.find(user => user.verificationToken === token);
    }

    existsByEmail(email) {
        return this.users.some(user => user.email === email);
    }

    save(user) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
        return user;
    }

    getUserDevices(userId) {
        const user = this.findById(userId);
        return user ? user.devices : [];
    }

    updateUserProfile(userId, profileData) {
        const user = this.findById(userId);
        if (user) {
            return user.updateProfile(profileData);
        }
        throw new Error('User not found');
    }

    // COMMENTED MONGODB IMPLEMENTATION
    /*
    const mongoose = require('mongoose');
    const UserSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: String,
        emailVerified: { type: Boolean, default: true },
        devices: [{
            id: String,
            name: String,
            type: String,
            active: Boolean,
            lastLogin: Date
        }],
        role: { type: String, default: 'USER' },
        refreshToken: String
    });

    const MongoUser = mongoose.model('User', UserSchema);

    class MongoUserRepository {
        async create(user) {
            const mongoUser = new MongoUser({
                username: user.username,
                email: user.email,
                password: user.password,
                devices: user.devices,
                role: user.role
            });
            await mongoUser.save();
            return mongoUser;
        }

        async findByEmail(email) {
            return await MongoUser.findOne({ email });
        }

        async findByUsername(username) {
            return await MongoUser.findOne({ username });
        }

        async findById(id) {
            return await MongoUser.findById(id);
        }

        async existsByEmail(email) {
            return await MongoUser.exists({ email });
        }

        async save(user) {
            return await MongoUser.findByIdAndUpdate(user.id, user, { new: true });
        }

        async getUserDevices(userId) {
            const user = await this.findById(userId);
            return user ? user.devices : [];
        }

        async updateUserProfile(userId, profileData) {
            return await MongoUser.findByIdAndUpdate(
                userId, 
                { $set: profileData }, 
                { new: true }
            );
        }
    }

    // Connection example
    mongoose.connect('mongodb://localhost:27017/usermanagement', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    */
}

module.exports = new UserRepository();
