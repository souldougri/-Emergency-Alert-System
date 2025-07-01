// Mobile App API Integration Test
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Mobile App API Integration...\n');

// Test the exact API call the mobile app will make
async function testMobileAppEmergencyRequest() {
  console.log('📱 Testing Mobile App Emergency Request...');
  
  try {
    // This is the exact request format the mobile app sends
    const mobileAppRequest = {
      fullName: "Mobile Test User",
      phoneNumber: "+1234567890",
      location: {
        type: "Point",
        coordinates: [-74.006, 40.7128] // [longitude, latitude]
      },
      address: "123 Test Street, New York, NY" // Optional
    };

    console.log('📤 Sending request:', JSON.stringify(mobileAppRequest, null, 2));

    const response = await axios.post(`${BASE_URL}/emergency/request`, mobileAppRequest, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.status === 201 && response.data.success) {
      console.log('✅ Mobile App API Integration SUCCESS!');
      console.log('📋 Response:', response.data);
      console.log('🆔 Emergency Request ID:', response.data.data.id);
      console.log('📊 Status:', response.data.data.status);
      console.log('⏰ Created:', response.data.data.createdAt);
      return true;
    } else {
      console.log('❌ Unexpected response format');
      console.log('Response:', response.data);
      return false;
    }

  } catch (error) {
    console.log('❌ Mobile App API Test FAILED');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('Network Error: Cannot connect to backend server');
      console.log('Make sure backend is running on http://localhost:5000');
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test health endpoint
async function testHealthEndpoint() {
  console.log('🏥 Testing Health Endpoint...');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    
    if (response.status === 200) {
      console.log('✅ Backend Health Check PASSED');
      console.log('📋 Response:', response.data);
      return true;
    } else {
      console.log('❌ Health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

// Run all tests
async function runMobileAppTests() {
  console.log('🚀 Starting Mobile App Integration Tests...\n');
  
  const healthResult = await testHealthEndpoint();
  console.log('');
  
  if (healthResult) {
    const emergencyResult = await testMobileAppEmergencyRequest();
    console.log('');
    
    console.log('🎯 TEST SUMMARY');
    console.log('================');
    console.log(`Health Check: ${healthResult ? '✅' : '❌'}`);
    console.log(`Emergency API: ${emergencyResult ? '✅' : '❌'}`);
    
    if (healthResult && emergencyResult) {
      console.log('\n🎉 ALL MOBILE APP INTEGRATION TESTS PASSED!');
      console.log('📱 The mobile app should work correctly with the backend.');
      console.log('\n📋 Next Steps:');
      console.log('1. Update API URL in mobile app if needed');
      console.log('2. Run: flutter run');
      console.log('3. Test registration and SOS functionality');
      console.log('4. Verify emergency requests appear in backend logs');
    } else {
      console.log('\n⚠️ Some tests failed. Please check backend server.');
    }
  } else {
    console.log('\n❌ Backend server is not responding. Please start it first.');
    console.log('Run: cd backend && npm run dev');
  }
}

runMobileAppTests();
