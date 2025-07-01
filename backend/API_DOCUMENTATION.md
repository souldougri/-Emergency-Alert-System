# Emergency Alert System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Health Check
- **GET** `/health` - Check API status

### Emergency Requests

#### Create Emergency Request (Public)
- **POST** `/emergency/request`
- **Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "location": {
    "type": "Point",
    "coordinates": [-74.006, 40.7128]
  },
  "address": "123 Main St, New York, NY" // optional
}
```

#### Get All Emergency Requests (Admin)
- **GET** `/emergency/requests`
- **Query Parameters:**
  - `status` - Filter by status (pending, in_progress, resolved, canceled)
  - `priority` - Filter by priority (low, medium, high, critical)
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 50)
  - `sortBy` - Sort field (default: createdAt)
  - `sortOrder` - Sort order (asc, desc, default: desc)

#### Get Emergency Request by ID (Admin)
- **GET** `/emergency/requests/:id`

#### Update Emergency Request Status (Admin)
- **PUT** `/emergency/requests/:id/status`
- **Body:**
```json
{
  "status": "in_progress",
  "notes": "Emergency team dispatched",
  "assignedTo": "Officer Smith"
}
```

### Admin Authentication

#### Admin Login
- **POST** `/admin/login`
- **Body:**
```json
{
  "email": "admin@emergency.com",
  "password": "admin123"
}
```

#### Verify Token
- **GET** `/admin/verify`

#### Get Admin Profile
- **GET** `/admin/profile`

#### Create Admin (Super Admin Only)
- **POST** `/admin/create`
- **Body:**
```json
{
  "email": "newadmin@emergency.com",
  "password": "password123",
  "name": "New Admin",
  "role": "admin"
}
```

#### Get All Admins (Super Admin Only)
- **GET** `/admin/all`

#### Update Admin Status (Super Admin Only)
- **PUT** `/admin/:id/status`
- **Body:**
```json
{
  "isActive": false
}
```

### Statistics

#### Get Dashboard Statistics
- **GET** `/statistics/dashboard`
- **Query Parameters:**
  - `timeRange` - Time range (1h, 24h, 7d, 30d, default: 24h)

#### Get Geographical Statistics
- **GET** `/statistics/geographical`
- **Query Parameters:**
  - `bounds` - JSON string with geographical bounds
```json
{
  "north": 40.8,
  "south": 40.6,
  "east": -73.9,
  "west": -74.1
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": ["Detailed error messages"]
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## WebSocket Events

### Admin Dashboard Events
- `new-emergency` - New emergency request created
- `request-updated` - Emergency request status updated

### Connection
```javascript
// Join admin room to receive real-time updates
socket.emit('join-admin');
```
