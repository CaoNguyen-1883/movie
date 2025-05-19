# Movie Backend

Backend application for the Movie platform built with Node.js, Express, and TypeScript.

## Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Error Codes](docs/API.md#error-codes) - List of error codes and their meanings
- [Authentication](docs/API.md#authentication) - Authentication requirements and process

## Project Structure

```
movie-be/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── exceptions/     # Custom exceptions
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # Custom middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── app.ts          # Express application
├── docs/              # Documentation
└── tests/             # Test files
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-be
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the following variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-app
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:5000`.

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/logout` - User logout

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create new user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Roles
- GET `/api/roles` - Get all roles
- GET `/api/roles/:id` - Get role by ID
- POST `/api/roles` - Create new role
- PUT `/api/roles/:id` - Update role
- DELETE `/api/roles/:id` - Delete role

### Permissions
- GET `/api/permissions` - Get all permissions
- GET `/api/permissions/:id` - Get permission by ID
- POST `/api/permissions` - Create new permission
- PUT `/api/permissions/:id` - Update permission
- DELETE `/api/permissions/:id` - Delete permission

For detailed API documentation, see [API.md](docs/API.md).

## Testing

Run tests:
```bash
npm test
```

## Error Handling

The application uses a centralized error handling mechanism. All errors are instances of `AppException` and include:
- HTTP status code
- Error code
- Error message
- Optional validation errors

See [Error Codes](docs/API.md#error-codes) for a complete list of error codes.

## Authentication

The application uses JWT (JSON Web Tokens) with refresh token mechanism for authentication:

### Token Types
1. **Access Token**
   - Short-lived token (15 minutes)
   - Used for API authorization
   - Sent in Authorization header
   ```
   Authorization: Bearer <access_token>
   ```

2. **Refresh Token**
   - Long-lived token (7 days)
   - Used to obtain new access tokens
   - Stored in HTTP-only cookie
   - Automatically sent with requests

### Authentication Flow
1. User logs in with credentials
2. Server validates credentials and returns:
   - Access token in response body
   - Refresh token in HTTP-only cookie
3. Client uses access token for API requests
4. When access token expires:
   - Client calls refresh token endpoint
   - Server validates refresh token
   - Server issues new access token
5. On logout:
   - Server invalidates refresh token
   - Client removes access token

## Role-Based Access Control (RBAC)

The application implements RBAC with the following default roles:
1. Admin - Full system access
2. Moderator - Limited administrative access
3. User - Basic access

See [Default Roles](docs/API.md#default-roles) for detailed permissions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 