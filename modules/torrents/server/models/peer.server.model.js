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
    default: ''
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
  },
  refreshat: {
    type: Date,
    default: Date.now
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
 * globalUpdateMethod
 */
PeerSchema.methods.globalUpdateMethod = function (cb) {
  this.refreshat = Date.now();
  this.save(function (err, p) {
    if (cb) cb(p || this);
  });
};

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
  if (p.peer_status === 'seeder') {
    p.peer_percent = 100;
  } else {
    // p.peer_percent = (Math.round((p.peer_downloaded / (p.peer_downloaded + p.peer_left)) * 10000) / 100) || 0;
    p.peer_percent = Math.round((p.torrent.torrent_size - p.peer_left) / p.torrent.torrent_size * 10000) / 100;
  }
}


PeerSchema.index({user: -1, startedat: -1});
PeerSchema.index({torrent: -1, startedat: -1});
PeerSchema.index({last_announce_at: -1});
PeerSchema.index({torrent: 1, peer_status: 1, last_announce_at: 1, peer_uploaded: 1});
PeerSchema.index({torrent: 1, peer_status: 1, last_announce_at: 1, peer_downloaded: 1});
PeerSchema.index({user: 1, peer_status: 1, last_announce_at: 1, peer_uploaded: 1});
PeerSchema.index({user: 1, peer_status: 1, last_announce_at: 1, peer_downloaded: 1});

PeerSchema.index({last_announce_at: 1, peer_status: 1, user: 1, peer_uploaded: -1});

mongoose.model('Peer', PeerSchema);
