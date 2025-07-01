const mongoose = require('mongoose');
require('dotenv').config();

async function checkRequests() {
  try {
    console.log('🔍 Checking Emergency Requests in Database...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    const EmergencyRequest = require('./src/models/EmergencyRequest');
    
    // Get total count
    const totalCount = await EmergencyRequest.countDocuments();
    console.log(`📊 Total emergency requests in database: ${totalCount}`);
    
    // Get recent requests
    const recentRequests = await EmergencyRequest.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    console.log(`\n📋 Last 10 requests:`);
    
    if (recentRequests.length === 0) {
      console.log('❌ No emergency requests found in database');
    } else {
      recentRequests.forEach((req, index) => {
        console.log(`\n${index + 1}. Request Details:`);
        console.log(`   ID: ${req._id}`);
        console.log(`   Name: ${req.fullName}`);
        console.log(`   Phone: ${req.phoneNumber}`);
        console.log(`   Status: ${req.status}`);
        console.log(`   Priority: ${req.priority}`);
        console.log(`   Created: ${req.createdAt}`);
        console.log(`   Location: [${req.location.coordinates.join(', ')}]`);
        if (req.address) {
          console.log(`   Address: ${req.address}`);
        }
      });
    }
    
    // Check requests by status
    console.log(`\n📈 Requests by Status:`);
    const statusCounts = await EmergencyRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    statusCounts.forEach(status => {
      console.log(`   ${status._id}: ${status.count}`);
    });
    
    // Check recent requests (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await EmergencyRequest.countDocuments({
      createdAt: { $gte: oneHourAgo }
    });
    console.log(`\n⏰ Requests in last hour: ${recentCount}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database check completed');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkRequests();
