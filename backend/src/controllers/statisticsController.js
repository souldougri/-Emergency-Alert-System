const EmergencyRequest = require('../models/EmergencyRequest');

// Get dashboard statistics
const getDashboardStatistics = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // Calculate time range
    let startDate = new Date();
    switch (timeRange) {
      case '1h':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    // Get total counts
    const totalRequests = await EmergencyRequest.countDocuments();
    const recentRequests = await EmergencyRequest.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Get status distribution
    const statusDistribution = await EmergencyRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get priority distribution
    const priorityDistribution = await EmergencyRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent status distribution
    const recentStatusDistribution = await EmergencyRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate average response time (simulate if no responseTime field exists)
    const responseTimeStats = await EmergencyRequest.aggregate([
      {
        $match: {
          status: 'resolved',
          createdAt: { $exists: true },
          updatedAt: { $exists: true }
        }
      },
      {
        $addFields: {
          calculatedResponseTime: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              60000 // Convert to minutes
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$calculatedResponseTime' },
          minResponseTime: { $min: '$calculatedResponseTime' },
          maxResponseTime: { $max: '$calculatedResponseTime' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get requests by hour for the last 24 hours
    const requestsByHour = await EmergencyRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$createdAt' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1, '_id.hour': 1 }
      }
    ]);

    // Get active requests (pending and in_progress)
    const activeRequests = await EmergencyRequest.countDocuments({
      status: { $in: ['pending', 'in_progress'] }
    });

    // Get total resolved requests
    const totalResolvedRequests = await EmergencyRequest.countDocuments({
      status: 'resolved'
    });

    // Get resolved requests in time range (using updatedAt as proxy for resolution time)
    const resolvedRequests = await EmergencyRequest.countDocuments({
      status: 'resolved',
      updatedAt: { $gte: startDate }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalRequests,
          recentRequests,
          activeRequests,
          resolvedRequests: totalResolvedRequests,
          recentResolvedRequests: resolvedRequests,
          timeRange
        },
        statusDistribution: statusDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        priorityDistribution: priorityDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentStatusDistribution: recentStatusDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        responseTime: responseTimeStats[0] ? {
          avgResponseTime: Math.round(responseTimeStats[0].avgResponseTime || 0),
          minResponseTime: Math.round(responseTimeStats[0].minResponseTime || 0),
          maxResponseTime: Math.round(responseTimeStats[0].maxResponseTime || 0),
          count: responseTimeStats[0].count || 0
        } : {
          avgResponseTime: 0,
          minResponseTime: 0,
          maxResponseTime: 0,
          count: 0
        },
        requestsByHour: requestsByHour.map(item => ({
          hour: item._id.hour,
          date: item._id.date,
          count: item.count
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: 'Internal server error'
    });
  }
};

// Get geographical distribution of requests
const getGeographicalStatistics = async (req, res) => {
  try {
    const { bounds } = req.query;
    
    let matchStage = {};
    
    // If bounds are provided, filter by geographical area
    if (bounds) {
      try {
        const { north, south, east, west } = JSON.parse(bounds);
        matchStage.location = {
          $geoWithin: {
            $box: [[west, south], [east, north]]
          }
        };
      } catch (parseError) {
        return res.status(400).json({
          error: 'Invalid bounds format',
          message: 'Bounds should be a JSON object with north, south, east, west properties'
        });
      }
    }

    // Get requests with location data
    const requestsWithLocation = await EmergencyRequest.aggregate([
      { $match: matchStage },
      {
        $project: {
          _id: 1,
          fullName: 1,
          phoneNumber: 1,
          location: 1,
          status: 1,
          priority: 1,
          createdAt: 1,
          address: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 1000 } // Limit for performance
    ]);

    // Group by approximate area (for clustering)
    const areaDistribution = await EmergencyRequest.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            // Group by rounded coordinates for clustering
            lat: { $round: [{ $arrayElemAt: ['$location.coordinates', 1] }, 2] },
            lng: { $round: [{ $arrayElemAt: ['$location.coordinates', 0] }, 2] }
          },
          count: { $sum: 1 },
          statuses: { $push: '$status' },
          priorities: { $push: '$priority' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        requests: requestsWithLocation,
        areaDistribution: areaDistribution.map(area => ({
          coordinates: [area._id.lng, area._id.lat],
          count: area.count,
          statusBreakdown: area.statuses.reduce((acc, status) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {}),
          priorityBreakdown: area.priorities.reduce((acc, priority) => {
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
          }, {})
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching geographical statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch geographical statistics',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getDashboardStatistics,
  getGeographicalStatistics
};
