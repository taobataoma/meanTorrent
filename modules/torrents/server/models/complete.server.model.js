'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Complete Schema
 */
var CompleteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  },
  total_uploaded: {
    type: Number,
    default: 0
  },
  total_downloaded: {
    type: Number,
    default: 0
  },
  total_ratio: {
    type: Number,
    default: 0
  },
  total_seed_time: {
    type: Number,
    default: 0
  },
  total_seed_day: {
    type: Number,
    default: 0
  },
  hnr_warning: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CompleteSchema.index({user: -1, createdAt: -1});
CompleteSchema.index({torrent: 1, createdAt: -1});

mongoose.model('Complete', CompleteSchema);
