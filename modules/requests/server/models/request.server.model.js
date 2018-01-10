'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  CommonSchema = require(path.resolve('./modules/core/server/models/common.server.model'));

/**
 * Request Schema
 */
var RequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  desc: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    default: 'movie',
    trim: true
  },
  rewards: {
    type: Number,
    default: 0
  },
  torrents: [{
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  }],
  accept: {
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  },

  comment: [CommonSchema.CommentSchema],

  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

RequestSchema.index({createdAt: -1});
RequestSchema.index({user: 1, createdAt: -1});

mongoose.model('Request', RequestSchema);
