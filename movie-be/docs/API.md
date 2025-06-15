# API Documentation

This document provides a detailed specification for the Movie API, including authentication, available endpoints, request/response formats, and error handling.

## Base URL
All API endpoints are prefixed with the following base URL:
```
/api/v1
```

## Authentication
The application uses **JWT (JSON Web Tokens)** for securing API endpoints.

- **Access Token**: A short-lived token (default: 15 minutes) sent in the `Authorization` header with the `Bearer` scheme. It is used to access protected resources.
- **Refresh Token**: A long-lived token (default: 7 days) used to obtain a new access token without requiring the user to log in again.

Both tokens are returned in the response body upon successful login or registration. The client is responsible for securely storing these tokens.

### Example Authorization Header
```
Authorization: Bearer <your_access_token>
```

---

## Authentication Endpoints

### 1. Register a New User
Creates a new user account.

- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user with a username, email, and password.
- **Request Body**:
  ```json
  {
      "username": "testuser",
      "email": "user@example.com",
      "password": "Password123"
  }
  ```
- **Successful Response (201 Created)**:
  ```json
  {
      "user": {
          "id": "60c72b2f9b1d8e001f8e8b8b",
          "username": "testuser",
          "email": "user@example.com",
          "role": "USER"
      },
      "tokens": {
          "access": {
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              "expires": "2023-05-20T12:15:00.000Z"
          },
          "refresh": {
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              "expires": "2023-05-27T12:00:00.000Z"
          }
      }
  }
  ```

### 2. Login
Authenticates a user and returns access and refresh tokens.

- **Endpoint**: `POST /auth/login`
- **Description**: Logs in a user with their email and password.
- **Request Body**:
  ```json
  {
      "email": "user@example.com",
      "password": "Password123"
  }
  ```
- **Successful Response (200 OK)**:
  Returns the same response structure as the register endpoint, containing user information and tokens.

---

## Error Handling
The API uses a standardized error response format.

### Error Response Format (Production)
In a production environment, errors will return a clean and simple response.

```json
{
    "status": "fail", // or "error" for server-side issues
    "message": "A descriptive error message."
}
```
**Example (401 Unauthorized)**:
```json
{
    "status": "fail",
    "message": "Incorrect email/username or password"
}
```

### Error Response Format (Development)
In a development environment, the error response includes a full stack trace for easier debugging.
```json
{
    "status": "fail",
    "error": { ...full error object... },
    "message": "A descriptive error message.",
    "stack": "Error: ... at ..."
}
```

### Common HTTP Status Codes
- `200 OK`: Request was successful.
- `201 Created`: The resource was successfully created.
- `400 Bad Request`: The request was invalid (e.g., missing fields, validation error).
- `401 Unauthorized`: Authentication failed or token is missing/invalid.
- `403 Forbidden`: The user does not have permission to access the resource.
- `404 Not Found`: The requested resource could not be found.
- `409 Conflict`: The request could not be completed due to a conflict (e.g., email already exists).
- `500 Internal Server Error`: An unexpected error occurred on the server.
---

## Future API Sections (Design Blueprint)

The following sections outline the designed structure for future API development.

### User Management
- `GET /users`: Get a list of all users.
- `GET /users/:id`: Get a single user by ID.
- `PUT /users/:id`: Update a user's details.
- `DELETE /users/:id`: Delete a user.

### Role Management
- `GET /roles`: Get all roles.
- `POST /roles`: Create a new role.
- `PUT /roles/:id`: Update a role.
- `DELETE /roles/:id`: Delete a role.

### Permission Management
- `GET /permissions`: Get all available permissions.

## User Management

### Get All Users
```http
GET /users
```
**Required Permission:** `MANAGE_USERS`

**Response:**
```json
{
    "status": "success",
    "data": [
        {
            "id": "string",
            "username": "string",
            "email": "string",
            "fullName": "string",
            "avatar": "string",
            "isActive": boolean,
            "roles": [
                {
                    "id": "string",
                    "name": "string",
                    "description": "string",
                    "permissions": [
                        {
                            "id": "string",
                            "name": "string",
                            "code": "string"
                        }
                    ]
                }
            ],
            "lastLogin": "date",
            "createdAt": "date",
            "updatedAt": "date"
        }
    ]
}
```

### Get User by ID
```http
GET /users/:id
```
**Required Permission:** `MANAGE_USERS`

**Response:** Same as single user object in Get All Users

### Create User
```http
POST /users
```
**Required Permission:** `MANAGE_USERS`

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "fullName": "string",
    "roles": ["role_id"]
}
```

**Response:** Created user object

### Update User
```http
PUT /users/:id
```
**Required Permission:** `MANAGE_USERS`

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "fullName": "string",
    "roles": ["role_id"],
    "isActive": boolean
}
```

**Response:** Updated user object

### Delete User
```http
DELETE /users/:id
```
**Required Permission:** `MANAGE_USERS`

**Response:**
```json
{
    "status": "success",
    "message": "User deleted successfully"
}
```

## Role Management

### Get All Roles
```http
GET /roles
```
**Required Permission:** `MANAGE_ROLES`

**Response:**
```json
{
    "status": "success",
    "data": [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "permissions": [
                {
                    "id": "string",
                    "name": "string",
                    "code": "string"
                }
            ],
            "createdAt": "date",
            "updatedAt": "date"
        }
    ]
}
```

### Get Role by ID
```http
GET /roles/:id
```
**Required Permission:** `MANAGE_ROLES`

**Response:** Same as single role object in Get All Roles

### Create Role
```http
POST /roles
```
**Required Permission:** `MANAGE_ROLES`

**Request Body:**
```json
{
    "name": "string",
    "description": "string",
    "permissions": ["permission_id"]
}
```

**Response:** Created role object

### Update Role
```http
PUT /roles/:id
```
**Required Permission:** `MANAGE_ROLES`

**Request Body:**
```json
{
    "name": "string",
    "description": "string",
    "permissions": ["permission_id"]
}
```

**Response:** Updated role object

### Delete Role
```http
DELETE /roles/:id
```
**Required Permission:** `MANAGE_ROLES`

**Response:**
```json
{
    "status": "success",
    "message": "Role deleted successfully"
}
```

## Permission Management

### Get All Permissions
```http
GET /permissions
```
**Required Permission:** `MANAGE_ROLES`

**Response:**
```json
{
    "status": "success",
    "data": [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "code": "string",
            "createdAt": "date",
            "updatedAt": "date"
        }
    ]
}
```

### Get Permission by ID
```http
GET /permissions/:id
```
**Required Permission:** `MANAGE_ROLES`

**Response:** Same as single permission object in Get All Permissions

### Create Permission
```http
POST /permissions
```
**Required Permission:** `MANAGE_ROLES`

**Request Body:**
```json
{
    "name": "string",
    "description": "string",
    "code": "string"
}
```

**Response:** Created permission object

### Update Permission
```http
PUT /permissions/:id
```
**Required Permission:** `MANAGE_ROLES`

**Request Body:**
```json
{
    "name": "string",
    "description": "string",
    "code": "string"
}
```

**Response:** Updated permission object

### Delete Permission
```http
DELETE /permissions/:id
```
**Required Permission:** `MANAGE_ROLES`

**Response:**
```json
{
    "status": "success",
    "message": "Permission deleted successfully"
}
```

## Default Permissions
| Code | Description |
|------|-------------|
| VIEW_MOVIES | Can view movies |
| CREATE_MOVIES | Can create new movies |
| EDIT_MOVIES | Can edit existing movies |
| DELETE_MOVIES | Can delete movies |
| MANAGE_USERS | Can manage user accounts |
| MANAGE_ROLES | Can manage roles and permissions |

## Default Roles
1. **Admin**
   - Has all permissions
   - Full system access

2. **Moderator**
   - VIEW_MOVIES
   - CREATE_MOVIES
   - EDIT_MOVIES
   - MANAGE_USERS

3. **User**
   - VIEW_MOVIES 