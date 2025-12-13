const asyncHandler = require('../utils/asyncHandler');
const UserSettings = require('../models/UserSettings');

/**
 * @desc    Get user settings
 * @route   GET /api/settings
 * @access  Private
 */
exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await UserSettings.findOne({ user: req.user._id });

  // Create default settings if doesn't exist
  if (!settings) {
    settings = await UserSettings.create({
      user: req.user._id
    });
  }

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update user settings
 * @route   PUT /api/settings
 * @access  Private
 */
exports.updateSettings = asyncHandler(async (req, res) => {
  const {
    preferredFirstName,
    residentialAddress,
    postalAddress,
    emergencyContact
  } = req.body;

  // Find or create settings
  let settings = await UserSettings.findOne({ user: req.user._id });

  if (!settings) {
    settings = await UserSettings.create({
      user: req.user._id
    });
  }

  // Build update object
  const updateData = {};
  
  if (preferredFirstName !== undefined) {
    updateData.preferredFirstName = preferredFirstName || null;
  }
  
  if (residentialAddress !== undefined) {
    updateData.residentialAddress = residentialAddress || null;
  }
  
  if (postalAddress !== undefined) {
    updateData.postalAddress = postalAddress || null;
  }
  
  if (emergencyContact !== undefined) {
    updateData.emergencyContact = emergencyContact || null;
  }

  // Update settings
  settings = await UserSettings.findByIdAndUpdate(
    settings._id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: settings
  });
});

