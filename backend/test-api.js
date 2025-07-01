// Comprehensive API testing script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';

console.log('🧪 Starting Comprehensive API Tests...\n');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('📋 Test 1: Health Check');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

// Test 2: Admin Login
async function testAdminLogin() {
  console.log('\n🔐 Test 2: Admin Login');
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'admin@emergency.com',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.data.token) {
      adminToken = response.data.data.token;
      console.log('✅ Admin login successful');
      console.log('📧 Admin:', response.data.data.admin.email);
      console.log('👤 Name:', response.data.data.admin.name);
      console.log('🔑 Role:', response.data.data.admin.role);
      return true;
    } else {
      console.log('❌ Login failed: Invalid response format');
      return false;
    }
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 3: Create Emergency Request
async function testCreateEmergencyRequest() {
  console.log('\n🚨 Test 3: Create Emergency Request');
  try {
    const emergencyData = {
      fullName: 'Test User',
      phoneNumber: '+1234567890',
      location: {
        type: 'Point',
        coordinates: [-74.006, 40.7128] // New York coordinates
      },
      address: '123 Test Street, New York, NY'
    };

    const response = await axios.post(`${BASE_URL}/emergency/request`, emergencyData);
    
    if (response.data.success) {
      console.log('✅ Emergency request created successfully');
      console.log('🆔 Request ID:', response.data.data.id);
      console.log('📊 Status:', response.data.data.status);
      return response.data.data.id;
    } else {
      console.log('❌ Emergency request creation failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Emergency request failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Get All Emergency Requests (Admin)
async function testGetEmergencyRequests() {
  console.log('\n📋 Test 4: Get All Emergency Requests');
  try {
    const response = await axios.get(`${BASE_URL}/emergency/requests`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Emergency requests retrieved successfully');
      console.log('📊 Total requests:', response.data.data.length);
      console.log('📄 Pagination:', response.data.pagination);
      return response.data.data;
    } else {
      console.log('❌ Failed to retrieve emergency requests');
      return null;
    }
  } catch (error) {
    console.log('❌ Get emergency requests failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 5: Update Emergency Request Status
async function testUpdateRequestStatus(requestId) {
  console.log('\n🔄 Test 5: Update Emergency Request Status');
  try {
    const updateData = {
      status: 'in_progress',
      notes: 'Emergency team dispatched - API Test',
      assignedTo: 'Test Officer'
    };

    const response = await axios.put(
      `${BASE_URL}/emergency/requests/${requestId}/status`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Request status updated successfully');
      console.log('📊 New status:', response.data.data.status);
      console.log('📝 Notes:', response.data.data.notes);
      return true;
    } else {
      console.log('❌ Failed to update request status');
      return false;
    }
  } catch (error) {
    console.log('❌ Update request status failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 6: Get Dashboard Statistics
async function testDashboardStatistics() {
  console.log('\n📊 Test 6: Dashboard Statistics');
  try {
    const response = await axios.get(`${BASE_URL}/statistics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Dashboard statistics retrieved successfully');
      console.log('📈 Overview:', response.data.data.overview);
      console.log('📊 Status Distribution:', response.data.data.statusDistribution);
      return true;
    } else {
      console.log('❌ Failed to retrieve dashboard statistics');
      return false;
    }
  } catch (error) {
    console.log('❌ Dashboard statistics failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 7: Get Geographical Statistics
async function testGeographicalStatistics() {
  console.log('\n🗺️ Test 7: Geographical Statistics');
  try {
    const response = await axios.get(`${BASE_URL}/statistics/geographical`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Geographical statistics retrieved successfully');
      console.log('📍 Requests with location:', response.data.data.requests.length);
      console.log('🗺️ Area distribution:', response.data.data.areaDistribution.length);
      return true;
    } else {
      console.log('❌ Failed to retrieve geographical statistics');
      return false;
    }
  } catch (error) {
    console.log('❌ Geographical statistics failed:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    healthCheck: false,
    adminLogin: false,
    createRequest: false,
    getRequests: false,
    updateStatus: false,
    dashboardStats: false,
    geoStats: false
  };

  // Test 1: Health Check
  results.healthCheck = await testHealthCheck();
  
  // Test 2: Admin Login
  if (results.healthCheck) {
    results.adminLogin = await testAdminLogin();
  }
  
  // Test 3: Create Emergency Request
  let requestId = null;
  if (results.adminLogin) {
    requestId = await testCreateEmergencyRequest();
    results.createRequest = requestId !== null;
  }
  
  // Test 4: Get Emergency Requests
  if (results.createRequest) {
    const requests = await testGetEmergencyRequests();
    results.getRequests = requests !== null;
  }
  
  // Test 5: Update Request Status
  if (results.getRequests && requestId) {
    results.updateStatus = await testUpdateRequestStatus(requestId);
  }
  
  // Test 6: Dashboard Statistics
  if (results.adminLogin) {
    results.dashboardStats = await testDashboardStatistics();
  }
  
  // Test 7: Geographical Statistics
  if (results.adminLogin) {
    results.geoStats = await testGeographicalStatistics();
  }

  // Summary
  console.log('\n🎯 TEST SUMMARY');
  console.log('================');
  console.log(`Health Check: ${results.healthCheck ? '✅' : '❌'}`);
  console.log(`Admin Login: ${results.adminLogin ? '✅' : '❌'}`);
  console.log(`Create Emergency: ${results.createRequest ? '✅' : '❌'}`);
  console.log(`Get Requests: ${results.getRequests ? '✅' : '❌'}`);
  console.log(`Update Status: ${results.updateStatus ? '✅' : '❌'}`);
  console.log(`Dashboard Stats: ${results.dashboardStats ? '✅' : '❌'}`);
  console.log(`Geographical Stats: ${results.geoStats ? '✅' : '❌'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🏆 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Backend is fully functional.');
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above.');
  }
}

// Install axios if not available, then run tests
async function main() {
  try {
    await runAllTests();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('axios')) {
      console.log('📦 Installing axios for testing...');
      const { exec } = require('child_process');
      exec('npm install axios', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Failed to install axios:', error.message);
          return;
        }
        console.log('✅ Axios installed successfully');
        console.log('🔄 Please run the test again: node test-api.js');
      });
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
}

main();
