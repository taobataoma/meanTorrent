'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Invitation Schema
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
    //unique: 'email already exists',
    //required: 'Please fill in a email address',
    lowercase: true,
    trim: true,
    default: ''
  },
  status: {
    type: Number,
    default: 0    //0 is unregistered invitation, 1 already invite friend, 2 is already registered
  },
  token: {
    type: String,
    default: ''
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  expiresat: {
    type: Date
  },
  invitedat: {
    type: Date
  },
  registeredat: {
    type: Date
  },
  createdat: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

mongoose.model('Invitation', InvitationSchema);
