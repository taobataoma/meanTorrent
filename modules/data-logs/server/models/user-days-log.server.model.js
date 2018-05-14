'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Peer Schema
 */
var UserDaysLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  year: {
    type: Number,
    default: 0
  },
  month: {
    type: Number,
    default: 0
  },
  date: {
    type: Number,
    default: 0
  },
  uploaded: {
    type: Number,
    default: 0
  },
  downloaded: {
    type: Number,
    default: 0
  },
  score: {
    type: Schema.Types.Decimal128,
    get: function (v) {
      return parseFloat(parseFloat(v).toFixed(2)) || 0;
    },
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});


UserDaysLogSchema.index({user: 1, year: 1, month: 1, day: 1});

mongoose.model('UserDaysLog', UserDaysLogSchema);
