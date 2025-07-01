// Validation middleware for emergency requests
const validateEmergencyRequest = (req, res, next) => {
  const { fullName, phoneNumber, location } = req.body;
  const errors = [];

  // Validate full name
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    errors.push('Full name is required and must be a non-empty string');
  } else if (fullName.trim().length > 100) {
    errors.push('Full name cannot exceed 100 characters');
  }

  // Validate phone number
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    errors.push('Phone number is required and must be a string');
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(phoneNumber.trim())) {
    errors.push('Please enter a valid phone number');
  }

  // Validate location
  if (!location) {
    errors.push('Location is required');
  } else {
    if (!location.coordinates || !Array.isArray(location.coordinates)) {
      errors.push('Location coordinates are required and must be an array');
    } else if (location.coordinates.length !== 2) {
      errors.push('Location coordinates must contain exactly 2 values [longitude, latitude]');
    } else {
      const [longitude, latitude] = location.coordinates;
      if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        errors.push('Coordinates must be numbers');
      } else if (longitude < -180 || longitude > 180) {
        errors.push('Longitude must be between -180 and 180');
      } else if (latitude < -90 || latitude > 90) {
        errors.push('Latitude must be between -90 and 90');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validation middleware for admin login
const validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Validate email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validation middleware for status updates
const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'in_progress', 'resolved', 'canceled'];

  if (!status) {
    return res.status(400).json({
      error: 'Status is required'
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      details: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  next();
};

// Validation middleware for MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }

  next();
};

module.exports = {
  validateEmergencyRequest,
  validateAdminLogin,
  validateStatusUpdate,
  validateObjectId
};
