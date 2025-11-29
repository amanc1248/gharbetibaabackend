const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  console.log('📱 Signup request body:', { name, email, role, phone });

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create user with phone
  const userData = {
    name,
    email,
    password,
    role: role || 'tenant'
  };
  
  // Add phone if provided
  if (phone) {
    userData.phone = phone;
  }

  const user = await User.create(userData);
  console.log('📱 Created user with phone:', user.phone);

  // Generate token
  const token = generateToken(user._id);

  // Update last login
  await user.updateLastLogin();

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: user.getPublicProfile()
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/signin
 * @access  Public
 */
exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Find user by email (include password field)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  // Compare password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate token
  const token = generateToken(user._id);

  // Update last login
  await user.updateLastLogin();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: user.getPublicProfile()
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      photoURL: user.photoURL,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      occupation: user.occupation,
      bio: user.bio,
      preferences: user.preferences,
      isActive: user.isActive,
      isVerified: user.isVerified,
      totalListings: user.totalListings,
      rating: user.rating,
      totalRatings: user.totalRatings,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    photoURL,
    dateOfBirth,
    gender,
    occupation,
    bio,
    preferences
  } = req.body;

  // Build update object (only include fields that were provided)
  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (photoURL) updateData.photoURL = photoURL;
  if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
  if (gender) updateData.gender = gender;
  if (occupation) updateData.occupation = occupation;
  if (bio) updateData.bio = bio;
  if (preferences) updateData.preferences = preferences;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      photoURL: user.photoURL,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      occupation: user.occupation,
      bio: user.bio,
      preferences: user.preferences
    }
  });
});

/**
 * @desc    Update user role
 * @route   PUT /api/auth/role
 * @access  Private
 */
exports.updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['tenant', 'owner', 'both'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid role (tenant, owner, or both)'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Role updated successfully',
    user: user.getPublicProfile()
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current password and new password'
    });
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    token
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/auth/account
 * @access  Private
 */
exports.deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your password to delete account'
    });
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password'
    });
  }

  // Soft delete - deactivate account instead of permanently deleting
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

