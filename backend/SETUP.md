# Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Create a new cluster (free tier M0)

2. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a user with username and password
   - Grant "Read and write to any database" permissions

3. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add "0.0.0.0/0" to allow access from anywhere (for development)
   - Or add your specific IP address for better security

4. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `emergency_alert_db`

## Environment Configuration

1. **Update .env file**
   ```bash
   # Replace the MONGODB_URI in backend/.env with your connection string
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/emergency_alert_db?retryWrites=true&w=majority
   ```

2. **Update JWT Secret**
   ```bash
   # Change the JWT_SECRET to a secure random string
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   ```

## Installation & Running

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Seed Database (Create Initial Admin)**
   ```bash
   npm run seed
   ```
   This creates an initial admin account:
   - Email: admin@emergency.com
   - Password: admin123

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test API**
   - Open http://localhost:5000/api/health
   - Should return: `{"status":"OK","message":"Emergency Alert System API is running"}`

## API Testing

You can test the API using tools like Postman or curl:

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@emergency.com","password":"admin123"}'
```

### Test Emergency Request Creation
```bash
curl -X POST http://localhost:5000/api/emergency/request \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phoneNumber": "+1234567890",
    "location": {
      "type": "Point",
      "coordinates": [-74.006, 40.7128]
    },
    "address": "123 Test Street"
  }'
```

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

### Port Already in Use
- Change the PORT in .env file to a different port (e.g., 5001)
- Or kill the process using port 5000

### Dependencies Issues
- Delete node_modules and package-lock.json
- Run `npm install` again

## Next Steps
Once the backend is running successfully:
1. Test all API endpoints
2. Proceed with mobile app development
3. Proceed with web dashboard development
