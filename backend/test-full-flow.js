// Comprehensive test for the SOS request flow
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Complete SOS Request Flow...\n');

async function testCompleteFlow() {
  try {
    // Step 1: Test admin login to get token
    console.log('1️⃣ Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'admin@emergency.com',
      password: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Admin login failed');
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ Admin login successful');
    
    // Step 2: Create a test emergency request (simulating mobile app)
    console.log('\n2️⃣ Creating test emergency request...');
    const emergencyData = {
      fullName: "Test SOS User",
      phoneNumber: "+1234567890",
      location: {
        type: "Point",
        coordinates: [-74.006, 40.7128]
      },
      address: "Test Emergency Location"
    };
    
    const emergencyResponse = await axios.post(`${BASE_URL}/emergency/request`, emergencyData);
    
    if (!emergencyResponse.data.success) {
      throw new Error('Emergency request creation failed');
    }
    
    const requestId = emergencyResponse.data.data.id;
    console.log('✅ Emergency request created successfully');
    console.log(`📋 Request ID: ${requestId}`);
    
    // Step 3: Test fetching emergency requests (simulating dashboard)
    console.log('\n3️⃣ Testing dashboard API - fetching requests...');
    const dashboardResponse = await axios.get(`${BASE_URL}/emergency/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!dashboardResponse.data.success) {
      throw new Error('Dashboard API failed');
    }
    
    const requests = dashboardResponse.data.data;
    console.log('✅ Dashboard API working');
    console.log(`📊 Total requests found: ${requests.length}`);
    
    // Check if our test request is in the results
    const ourRequest = requests.find(req => req._id === requestId);
    if (ourRequest) {
      console.log('✅ Test request found in dashboard results');
      console.log(`📋 Request details:`);
      console.log(`   Name: ${ourRequest.fullName}`);
      console.log(`   Phone: ${ourRequest.phoneNumber}`);
      console.log(`   Status: ${ourRequest.status}`);
      console.log(`   Created: ${ourRequest.createdAt}`);
    } else {
      console.log('❌ Test request NOT found in dashboard results');
      console.log('🔍 Available requests:');
      requests.slice(0, 3).forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.fullName} (${req._id})`);
      });
    }
    
    // Step 4: Test statistics API
    console.log('\n4️⃣ Testing statistics API...');
    const statsResponse = await axios.get(`${BASE_URL}/statistics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (statsResponse.data.success) {
      console.log('✅ Statistics API working');
      console.log(`📈 Total requests: ${statsResponse.data.data.overview.totalRequests}`);
      console.log(`📈 Active requests: ${statsResponse.data.data.overview.activeRequests}`);
    } else {
      console.log('❌ Statistics API failed');
    }
    
    // Step 5: Test updating request status
    console.log('\n5️⃣ Testing status update...');
    const updateResponse = await axios.put(`${BASE_URL}/emergency/requests/${requestId}/status`, {
      status: 'in_progress',
      notes: 'Test status update',
      assignedTo: 'Test Officer'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (updateResponse.data.success) {
      console.log('✅ Status update working');
      console.log(`📊 New status: ${updateResponse.data.data.status}`);
    } else {
      console.log('❌ Status update failed');
    }
    
    console.log('\n🎉 Complete flow test finished!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCompleteFlow();
