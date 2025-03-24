const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  username: {
    type: String,
    trim: true,
    default: function () {
      return this.email.split('@')[0];
    },
  },
  company: {
    type: String,
    trim: true,
    default: 'Company A',
  },
  shippingAddress: {
    type: String,
    trim: true,
    default: 'Not Provided',
  },
  billingAddress: {
    street: {
      type: String,
      trim: true,
      default: 'Not Provided', 
    },
    city: {
      type: String,
      trim: true,
      default: 'Not Provided', 
    },
    state: {
      type: String,
      trim: true,
      default: 'Not Provided', 
    },
    postalCode: {
      type: String,
      trim: true,
      default: '00000', // Default to "00000"
    },
    country: {
      type: String,
      trim: true,
      default: 'Not Provided', // Default to "Not Provided"
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: '000-000-0000', // Default to "000-000-0000"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);