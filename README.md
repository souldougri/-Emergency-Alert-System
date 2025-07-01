# Emergency Alert System

A comprehensive emergency alert system consisting of:
- **Mobile App** (Flutter): User registration and SOS functionality
- **Web Dashboard** (React + TailwindCSS): Admin panel for managing emergency requests
- **Backend API** (Node.js + Express + MongoDB): RESTful API with real-time updates

## Project Structure

```
alertSystem/
├── backend/                 # Node.js API server
├── mobile_app/             # Flutter application  
├── web_dashboard/          # React admin dashboard
└── README.md
```

## Development Status

- [x] Project structure created
- [ ] Backend API development
- [ ] Mobile app development
- [ ] Web dashboard development
- [ ] Integration & testing

## Technologies Used

**Backend:**
- Node.js + Express.js
- MongoDB Atlas
- Socket.io for real-time updates
- JWT for admin authentication

**Mobile App:**
- Flutter
- Geolocator for location services
- HTTP for API calls

**Web Dashboard:**
- React.js
- TailwindCSS
- React Leaflet for maps
- Socket.io-client for real-time updates
- Recharts for statistics
