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
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.Types.ObjectId,
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
  peer_uspeed: {
    type: Number,
    default: 0
  },
  peer_dspeed: {
    type: Number,
    default: 0
  },
  peer_ratio: {
    type: Number,
    default: 0
  },
  peer_left: {
    type: Number,
    default: 0
  },
  peer_percent: {
    type: Number,
    default: 0
  },
  peer_status: {
    type: String,
    default: 'leecher',
    trim: true
  },
  peer_connectable: {
    type: String,
    enum: ['yes', 'no'],
    default: 'yes'
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
  last_announce_at: {
    type: Date,
    default: ''
  },
  finishedat: {
    type: Date,
    default: ''
  }
}, {usePushEach: true});


/**
 * Hook a pre save method
 */
PeerSchema.pre('save', function (next) {
  countRatio(this);
  countPercent(this);
  next();
});

/**
 * Hook a pre update method
 */
PeerSchema.pre('update', function (next) {
  countRatio(this);
  countPercent(this);
  next();
});

/**
 * countRatio
 * @param t
 */
function countRatio(p) {
  if (p.peer_uploaded > 0 && p.peer_downloaded === 0) {
    p.peer_ratio = -1;
  } else if (p.peer_uploaded === 0 || p.peer_downloaded === 0) {
    p.peer_ratio = 0;
  } else {
    p.peer_ratio = Math.round((p.peer_uploaded / p.peer_downloaded) * 100) / 100;
  }
}

/**
 * countPercent
 * @param p
 */
function countPercent(p) {
  p.peer_percent = Math.round((p.peer_downloaded / (p.peer_downloaded + p.peer_left)) * 10000) / 100;
}


PeerSchema.index({user: -1, startedat: -1});
PeerSchema.index({info_hash: -1, startedat: -1});
PeerSchema.index({torrent: -1, startedat: -1});
PeerSchema.index({passkey: -1, startedat: -1});

mongoose.model('Peer', PeerSchema);
