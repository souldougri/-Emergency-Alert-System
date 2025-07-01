// Test script to verify backend structure without MongoDB connection
const express = require('express');
const cors = require('cors');

console.log('🧪 Testing Backend Structure...\n');

// Test 1: Check if all modules can be imported
console.log('📦 Testing module imports...');
try {
  const emergencyRoutes = require('./src/routes/emergencyRoutes');
  const adminRoutes = require('./src/routes/adminRoutes');
  const statisticsRoutes = require('./src/routes/statisticsRoutes');
  
  const EmergencyRequest = require('./src/models/EmergencyRequest');
  const Admin = require('./src/models/Admin');
  
  const emergencyController = require('./src/controllers/emergencyController');
  const adminController = require('./src/controllers/adminController');
  const statisticsController = require('./src/controllers/statisticsController');
  
  const auth = require('./src/middleware/auth');
  const validation = require('./src/middleware/validation');
  
  console.log('✅ All modules imported successfully');
} catch (error) {
  console.log('❌ Module import failed:', error.message);
  process.exit(1);
}

// Test 2: Check if Express app can be created with routes
console.log('\n🚀 Testing Express app creation...');
try {
  const app = express();
  
  // Add middleware
  app.use(cors());
  app.use(express.json());
  
  // Add a test route
  app.get('/test', (req, res) => {
    res.json({ message: 'Backend structure test successful!' });
  });
  
  console.log('✅ Express app created successfully');
} catch (error) {
  console.log('❌ Express app creation failed:', error.message);
  process.exit(1);
}

// Test 3: Check environment variables structure
console.log('\n🔧 Testing environment configuration...');
require('dotenv').config();

const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CORS_ORIGIN'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  Missing environment variables:', missingVars.join(', '));
} else {
  console.log('✅ All required environment variables are set');
}

// Test 4: Check JWT token generation
console.log('\n🔐 Testing JWT functionality...');
try {
  const { generateToken } = require('./src/middleware/auth');
  const testToken = generateToken('test-admin-id');
  
  if (testToken && typeof testToken === 'string') {
    console.log('✅ JWT token generation working');
  } else {
    console.log('❌ JWT token generation failed');
  }
} catch (error) {
  console.log('❌ JWT test failed:', error.message);
}

// Test 5: Check validation middleware
console.log('\n✅ Testing validation middleware...');
try {
  const validation = require('./src/middleware/validation');
  
  const validationFunctions = [
    'validateEmergencyRequest',
    'validateAdminLogin',
    'validateStatusUpdate',
    'validateObjectId'
  ];
  
  const missingValidations = validationFunctions.filter(
    funcName => typeof validation[funcName] !== 'function'
  );
  
  if (missingValidations.length > 0) {
    console.log('❌ Missing validation functions:', missingValidations.join(', '));
  } else {
    console.log('✅ All validation functions available');
  }
} catch (error) {
  console.log('❌ Validation test failed:', error.message);
}

console.log('\n🎉 Backend structure test completed!');
console.log('\n📋 Next Steps:');
console.log('1. Set up MongoDB Atlas and update MONGODB_URI in .env');
console.log('2. Run "npm run seed" to create initial admin account');
console.log('3. Run "npm run dev" to start the development server');
console.log('4. Test API endpoints using the provided documentation');

console.log('\n💡 The backend is ready for MongoDB connection!');
