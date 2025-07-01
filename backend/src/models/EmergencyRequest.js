const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  // User information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic phone number validation (can be enhanced)
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  
  // Location information
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Location coordinates are required'],
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates format'
      }
    }
  },
  
  // Address information (optional, can be reverse geocoded)
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  
  // Request status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'canceled'],
    default: 'pending',
    required: true
  },
  
  // Priority level (can be auto-assigned or manually set)
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  
  // Additional notes (for admin use)
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  
  // Assigned admin/responder
  assignedTo: {
    type: String,
    trim: true
  },
  
  // Response time tracking
  responseTime: {
    type: Number, // in minutes
    min: 0
  },
  
  // Resolution time tracking
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create geospatial index for location-based queries
emergencyRequestSchema.index({ location: '2dsphere' });

// Index for efficient status queries
emergencyRequestSchema.index({ status: 1, createdAt: -1 });

// Virtual for calculating response time
emergencyRequestSchema.virtual('responseTimeMinutes').get(function() {
  if (this.status === 'in_progress' && this.createdAt) {
    return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60));
  }
  return this.responseTime || 0;
});

// Pre-save middleware to calculate response time when status changes
emergencyRequestSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'in_progress' && !this.responseTime) {
      this.responseTime = Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60));
    }
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
