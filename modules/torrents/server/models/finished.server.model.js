'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * finished Schema
 */
var FinishedSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  },
  user_ip: {
    type: String,
    default: '',
    trim: true
  },
  user_agent: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

FinishedSchema.index({user: 1, torrent: 1});

mongoose.model('Finished', FinishedSchema);
