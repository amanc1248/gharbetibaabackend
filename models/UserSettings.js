const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    trim: true
  },
  flat: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  county: {
    type: String,
    trim: true
  },
  postcode: {
    type: String,
    trim: true
  }
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  relationship: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  country: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  preferredLanguage: {
    type: String,
    trim: true
  }
}, { _id: false });

const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferredFirstName: {
    type: String,
    trim: true,
    maxlength: [50, 'Preferred first name cannot exceed 50 characters']
  },
  residentialAddress: {
    type: addressSchema,
    default: null
  },
  postalAddress: {
    type: addressSchema,
    default: null
  },
  emergencyContact: {
    type: emergencyContactSchema,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
userSettingsSchema.index({ user: 1 });

module.exports = mongoose.model('UserSettings', userSettingsSchema);

