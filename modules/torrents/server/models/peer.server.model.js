'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Peer Schema
 */
var PeerSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.ObjectId,
    ref: 'Torrent'
  },
  peer_id: {
    type: String,
    default: '',
    trim: true
  },
  peer_ip: {
    type: String,
    default: '',
    trim: true
  },
  peer_port: {
    type: Number,
    default: 0
  },
  peer_uploaded: {
    type: Number,
    default: 0
  },
  peer_downloaded: {
    type: Number,
    default: 0
  },
  peer_status: {
    type: String,
    default: 'leecher',
    trim: true
  },
  user_agent: {
    type: String,
    default: '',
    trim: true
  },
  startedat: {
    type: Date,
    default: Date.now
  },
  finishedat: {
    type: Date,
    default: ''
  }
});

PeerSchema.index({user: -1, startedat: -1});
PeerSchema.index({info_hash: -1, startedat: -1});
PeerSchema.index({torrent: -1, startedat: -1});
PeerSchema.index({passkey: -1, startedat: -1});

mongoose.model('Peer', PeerSchema);
