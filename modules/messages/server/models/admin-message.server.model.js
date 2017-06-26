'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Message Schema
 */
var AdminMessageSchema = new Schema({
  from_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    default: 'user'
  },
  _readers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdat: {
    type: Date,
    default: Date.now
  }
});


mongoose.model('AdminMessage', AdminMessageSchema);
