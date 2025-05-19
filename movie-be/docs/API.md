# Movie API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
The application uses JWT (JSON Web Tokens) with refresh token mechanism for authentication.

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

### Authentication Endpoints

#### Login
```http
POST /auth/login
```
**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```
**Response:**
```json
{
    "status": "success",
    "data": {
        "user": {
            "id": "string",
            "username": "string",
            "email": "string",
            "fullName": "string",
            "roles": ["string"]
        },
        "accessToken": "string"
    }
}
```
**Note:** Refresh token is automatically set as HTTP-only cookie

#### Refresh Token
```http
POST /auth/refresh-token
```
**Response:**
```json
{
    "status": "success",
    "data": {
        "accessToken": "string"
    }
}
```

#### Logout
```http
POST /auth/logout
```
**Response:**
```json
{
    "status": "success",
    "message": "Logged out successfully"
}
```
**Note:** Clears both access token and refresh token

## Error Response Format
All error responses follow this format:
```json
{
    "status": "error",
    "code": "ERROR_CODE",
    "message": "Error message",
    "errors": [] // Optional array of validation errors
}
```

## Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | User is not authenticated |
| FORBIDDEN | 403 | User doesn't have required permissions |
| USER_NOT_FOUND | 404 | User not found |
| USER_EXISTS | 400 | User already exists |
| ROLE_NOT_FOUND | 404 | Role not found |
| ROLE_EXISTS | 400 | Role already exists |
| PERMISSION_NOT_FOUND | 404 | Permission not found |
| PERMISSION_EXISTS | 400 | Permission already exists |
| VALIDATION_ERROR | 400 | Request validation failed |
| INTERNAL_SERVER_ERROR | 500 | Server error |

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