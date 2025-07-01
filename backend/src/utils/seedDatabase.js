const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

// Create initial super admin account
const createInitialAdmin = async () => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne({});
    
    if (existingAdmin) {
      console.log('Admin account already exists. Skipping seed.');
      return;
    }

    // Create initial super admin
    const initialAdmin = new Admin({
      email: 'admin@emergency.com',
      password: 'admin123', // This will be hashed automatically
      name: 'System Administrator',
      role: 'super_admin'
    });

    await initialAdmin.save();
    
    console.log('✅ Initial admin account created successfully!');
    console.log('📧 Email: admin@emergency.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating initial admin:', error);
  }
};

// Seed database function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create initial admin
    await createInitialAdmin();
    
    console.log('🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, createInitialAdmin };
