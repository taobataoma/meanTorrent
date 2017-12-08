'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * rating Schema
 */
var RatingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  vote: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Maker Schema
 */
var MakerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    unique: 'GROUP_NAME_ALREADY_EXISTS',
    uppercase: true,
    trim: true,
    default: ''
  },
  desc: {
    type: String,
    trim: true,
    default: ''
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  upload_access: {
    type: String,
    default: 'review'
  },
  torrent_count: {
    type: Number,
    default: 0
  },
  vote_average: {
    type: Number,
    default: 0
  },
  vote_total: {
    type: Number,
    default: 0
  },
  vote_count: {
    type: Number,
    default: 0
  },
  _ratings: [RatingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Maker', MakerSchema);
