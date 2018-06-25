'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  CommonSchema = require(path.resolve('./modules/core/server/models/common.server.model'));

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
  _ratings: [CommonSchema.RatingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

MakerSchema.index({torrent_count: -1});
MakerSchema.index({upload_access: -1});


mongoose.model('Maker', MakerSchema);
