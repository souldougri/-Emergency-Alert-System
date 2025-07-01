const EmergencyRequest = require('../models/EmergencyRequest');

// Create new emergency request
const createEmergencyRequest = async (req, res) => {
  try {
    const { fullName, phoneNumber, location, address } = req.body;

    // Create new emergency request
    const emergencyRequest = new EmergencyRequest({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      location,
      address: address ? address.trim() : undefined
    });

    // Save to database
    const savedRequest = await emergencyRequest.save();

    // Emit real-time notification to admin dashboard
    if (req.io) {
      req.io.to('admin-room').emit('new-emergency', {
        id: savedRequest._id,
        fullName: savedRequest.fullName,
        phoneNumber: savedRequest.phoneNumber,
        location: savedRequest.location,
        address: savedRequest.address,
        status: savedRequest.status,
        priority: savedRequest.priority,
        createdAt: savedRequest.createdAt
      });
    }

    res.status(201).json({
      success: true,
      message: 'Emergency request created successfully',
      data: {
        id: savedRequest._id,
        status: savedRequest.status,
        createdAt: savedRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating emergency request:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Failed to create emergency request',
      message: 'Internal server error'
    });
  }
};

// Get all emergency requests (for admin dashboard)
const getAllEmergencyRequests = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      page = 1, 
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get requests with pagination
    const requests = await EmergencyRequest.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalCount = await EmergencyRequest.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching emergency requests:', error);
    res.status(500).json({
      error: 'Failed to fetch emergency requests',
      message: 'Internal server error'
    });
  }
};

// Get single emergency request by ID
const getEmergencyRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await EmergencyRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        error: 'Emergency request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error('Error fetching emergency request:', error);
    res.status(500).json({
      error: 'Failed to fetch emergency request',
      message: 'Internal server error'
    });
  }
};

// Update emergency request status
const updateEmergencyRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const updateData = { status };
    if (notes !== undefined) updateData.notes = notes;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        error: 'Emergency request not found'
      });
    }

    // Emit real-time update to admin dashboard
    if (req.io) {
      req.io.to('admin-room').emit('request-updated', {
        id: updatedRequest._id,
        status: updatedRequest.status,
        notes: updatedRequest.notes,
        assignedTo: updatedRequest.assignedTo,
        updatedAt: updatedRequest.updatedAt
      });
    }

    res.json({
      success: true,
      message: 'Emergency request updated successfully',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Error updating emergency request:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Failed to update emergency request',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateEmergencyRequestStatus
};
