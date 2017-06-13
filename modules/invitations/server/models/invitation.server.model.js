'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return validator.isEmail(email, {require_tld: false});
};

/**
 * Peer Schema
 */
var InvitationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to_email: {
    type: String,
    unique: 'email already exists',
    required: 'Please fill in a email address',
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  status: {
    type: Number,
    default: 0    //0 is unregistered invitation, 1 already invite friend, 2 is already registered
  },
  token: {
    type: String
  },
  expiresat: {
    type: Date
  },
  registeredat: {
    type: Date
  },
  createdat: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Invitation', InvitationSchema);
