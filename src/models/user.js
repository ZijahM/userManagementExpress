const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
    constructor(username, email, password, role = 'USER') {
        this.id = uuidv4();
        this.username = username;
        this.email = email;
        this.password = bcrypt.hashSync(password, 10);
        this.profileImageUrl = null;
        this.emailVerified = true; 
        this.devices = [];
        this.role = role;
        this.refreshToken = null;
    }

    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

    addDevice(deviceInfo) {
        const deviceId = uuidv4();
        const device = {
            id: deviceId,
            name: deviceInfo.deviceName,
            type: deviceInfo.deviceType,
            active: true,
            lastLogin: new Date()
        };
        this.devices.push(device);
        return deviceId;
    }

    updateProfile(profileData) {
        if (profileData.username) this.username = profileData.username;
        if (profileData.email) this.email = profileData.email;
        return this;
    }

    setRefreshToken(token) {
        this.refreshToken = token;
    }

    logoutDevice(deviceId) {
        const deviceIndex = this.devices.findIndex(device => device.id === deviceId);
        if (deviceIndex !== -1) {
            this.devices[deviceIndex].active = false;
        }
    }
}

module.exports = User;
