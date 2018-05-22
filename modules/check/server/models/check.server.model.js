'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Check in Schema
 */
var CheckSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  keepDays: {
    type: Number,
    default: 0
  },
  lastCheckedAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});


CheckSchema.index({user: 1, createdAt: -1});

mongoose.model('Check', CheckSchema);
