const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes - Verify JWT token
 * Adds user object to request if token is valid
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please login.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.'
    });
  }
});

/**
 * Restrict access to specific roles
 * @param {...string} roles - Allowed roles (tenant, owner, both)
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

/**
 * Check if user is owner or has 'both' role
 * Used for property creation/management
 */
exports.isOwner = (req, res, next) => {
  if (req.user.role === 'tenant') {
    return res.status(403).json({
      success: false,
      message: 'Only property owners can access this route. Please update your profile role.'
    });
  }
  next();
};

/**
 * Check if user owns the resource (property)
 * Used for update/delete operations
 */
exports.isResourceOwner = (resourceKey = 'owner') => {
  return asyncHandler(async (req, res, next) => {
    // Assuming the resource has already been fetched and attached to req
    const resource = req.property || req.resource;
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const ownerId = resource[resourceKey]._id || resource[resourceKey];
    
    if (ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this resource'
      });
    }

    next();
  });
};

/**
 * Optional authentication - adds user to request if token exists
 * Doesn't fail if no token is provided
 */
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Continue without user if token is invalid
      req.user = null;
    }
  }

  next();
});

