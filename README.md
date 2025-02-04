# User Management System - Express.js

## Overview
This is an Express.js implementation of a User Management System with in-memory storage, authentication, and device management.

## Features
- User registration
- Email verification
- JWT-based authentication
- Device login and management
- Profile management
- Refresh token support
- In-memory user storage
- Role-based access

## Prerequisites
- Node.js (v14 or later)
- npm

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application
- Development mode: `npm run dev`
- Production mode: `npm start`

## Environment Variables
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token generation
- `REFRESH_SECRET`: Secret key for refresh token generation

## API Endpoints
### Authentication
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/authenticate`: User login with device info
- `GET /api/v1/auth/verify-email/:token`: Verify user email
- `POST /api/v1/auth/refresh-token`: Refresh access token
- `GET /api/v1/auth/devices`: Get user's devices
- `POST /api/v1/auth/devices/:deviceId/logout`: Logout a specific device

### Profile
- `GET /api/v1/profile`: Get user profile
- `PUT /api/v1/profile`: Update user profile

## Postman Collection
Import the Postman collection to test all APIs.

## Testing
Coming soon...

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
