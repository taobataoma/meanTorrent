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
    default: 'system'
  },
  _readers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  updatedat: {
    type: Date,
    default: Date.now
  },
  createdat: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

AdminMessageSchema.index({type: 1, createdat: -1});

mongoose.model('AdminMessage', AdminMessageSchema);
