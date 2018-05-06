'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Peer Schema
 */
var AnnounceLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  },
  query_uploaded: {
    type: Number,
    default: 0
  },
  query_downloaded: {
    type: Number,
    default: 0
  },
  currentPeer_uploaded: {
    type: Number,
    default: 0
  },
  currentPeer_downloaded: {
    type: Number,
    default: 0
  },
  curr_uploaded: {
    type: Number,
    default: 0
  },
  curr_downloaded: {
    type: Number,
    default: 0
  },
  write_uploaded: {
    type: Number,
    default: 0
  },
  write_downloaded: {
    type: Number,
    default: 0
  },
  write_score: {
    type: Number,
    default: 0
  },
  isVip: {
    type: Boolean,
    default: false
  },
  isUploader: {
    type: Boolean,
    default: false
  },
  salesSettingValue: {
    type: Object
  },
  scoreSettingValue: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});


AnnounceLogSchema.index({user: 1, createdAt: -1});

mongoose.model('AnnounceLog', AnnounceLogSchema);
