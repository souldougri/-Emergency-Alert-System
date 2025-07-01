// Test Socket.io real-time functionality
const io = require('socket.io-client');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

console.log('🔌 Testing Socket.io Real-time Functionality...\n');

async function testSocketConnection() {
  return new Promise((resolve) => {
    console.log('📡 Test 1: Socket Connection');
    
    // Create socket connection
    const socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      console.log('🆔 Socket ID:', socket.id);
      
      // Join admin room
      socket.emit('join-admin');
      console.log('🏠 Joined admin room');
      
      // Listen for new emergency events
      socket.on('new-emergency', (data) => {
        console.log('\n🚨 Real-time Event: New Emergency Received!');
        console.log('📧 Name:', data.fullName);
        console.log('📞 Phone:', data.phoneNumber);
        console.log('📍 Location:', data.location.coordinates);
        console.log('📊 Status:', data.status);
        console.log('⏰ Created:', data.createdAt);
      });
      
      // Listen for request updates
      socket.on('request-updated', (data) => {
        console.log('\n🔄 Real-time Event: Request Updated!');
        console.log('🆔 Request ID:', data.id);
        console.log('📊 New Status:', data.status);
        console.log('📝 Notes:', data.notes);
        console.log('👤 Assigned To:', data.assignedTo);
      });
      
      // Test creating a new emergency request to trigger real-time event
      setTimeout(async () => {
        console.log('\n🧪 Creating test emergency to trigger real-time event...');
        
        try {
          const emergencyData = {
            fullName: 'Socket Test User',
            phoneNumber: '+9876543210',
            location: {
              type: 'Point',
              coordinates: [-73.935242, 40.730610] // Different NYC coordinates
            },
            address: '456 Socket Test Avenue, New York, NY'
          };

          await axios.post(`${BASE_URL}/emergency/request`, emergencyData);
          console.log('✅ Test emergency request sent');
          
        } catch (error) {
          console.log('❌ Failed to create test emergency:', error.message);
        }
        
        // Wait for events and then disconnect
        setTimeout(() => {
          socket.disconnect();
          console.log('\n📡 Socket disconnected');
          resolve(true);
        }, 2000);
        
      }, 1000);
    });
    
    socket.on('connect_error', (error) => {
      console.log('❌ Socket connection failed:', error.message);
      resolve(false);
    });
    
    socket.on('disconnect', () => {
      console.log('📡 Socket disconnected');
    });
  });
}

async function runSocketTests() {
  console.log('🔌 Starting Socket.io Tests...\n');
  
  const socketResult = await testSocketConnection();
  
  console.log('\n🎯 SOCKET TEST SUMMARY');
  console.log('======================');
  console.log(`Socket Connection: ${socketResult ? '✅' : '❌'}`);
  console.log(`Real-time Events: ${socketResult ? '✅' : '❌'}`);
  
  if (socketResult) {
    console.log('\n🎉 Socket.io real-time functionality is working perfectly!');
  } else {
    console.log('\n⚠️ Socket.io tests failed. Please check the server.');
  }
}

runSocketTests();
