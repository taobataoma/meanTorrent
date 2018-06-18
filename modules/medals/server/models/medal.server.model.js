'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Medal Schema
 */
var MedalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  medalName: {
    type: String,
    trim: true,
    default: ''
  },
  addBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

MedalSchema.index({user: 1});
MedalSchema.index({medalName: 1});

mongoose.model('Medal', MedalSchema);
