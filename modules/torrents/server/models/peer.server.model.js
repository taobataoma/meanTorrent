'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var mtDebug = require(path.resolve('./config/lib/debug'));

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
  peer_ipv4: {
    type: String,
    default: '',
    trim: true
  },
  peer_ipv6: {
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
  peer_cuspeed: {
    type: Number,
    default: 0
  },
  peer_cdspeed: {
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
PeerSchema.methods.globalUpdateMethod = function (findThenUpdate, cb) {
  mtDebug.debugGreen('---------------GLOBAL UPDATE PEER DATA----------------', 'ANNOUNCE', true, this.user);

  if (typeof findThenUpdate === 'function') {
    cb = findThenUpdate;
    findThenUpdate = false;
  }

  if (findThenUpdate) {
    this.model('Peer').findById(this._id).populate('torrent').populate('user').exec(function (err, p) {
      if (p) {
        p.refreshat = Date.now();
        p.save(function (err, np) {
          if (cb) cb(np || this);
        });
      } else {
        if (cb) cb(this);
      }
    });
  } else {
    this.refreshat = Date.now();
    this.save(function (err, p) {
      if (cb) cb(p || this);
    });
  }
};

/**
 * isIpV4
 * @returns {boolean}
 */
PeerSchema.methods.isIpV4 = function () {
  return this.peer_ipv4 !== '';
};

/**
 * isIpV4Only
 * @returns {boolean}
 */
PeerSchema.methods.isIpV4Only = function () {
  return this.peer_ipv4 !== '' && this.peer_ipv6 === '';
};

/**
 * isIpV6
 * @returns {boolean}
 */
PeerSchema.methods.isIpV6 = function () {
  return this.peer_ipv6 !== '';
};

/**
 * isIpV6Only
 * @returns {boolean}
 */
PeerSchema.methods.isIpV6Only = function () {
  return this.peer_ipv6 !== '' && this.peer_ipv4 === '';
};

/**
 * isIpV4V6
 * @returns {boolean}
 */
PeerSchema.methods.isIpV4V6 = function () {
  return this.peer_ipv4 !== '' && this.peer_ipv6 !== '';
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
  mtDebug.debugRed('peer_ratio              = ' + p.peer_ratio, 'ANNOUNCE', true, p.user);
}

/**
 * countPercent
 * @param p
 */
function countPercent(p) {
  if (p.peer_status === 'seeder') {
    p.peer_percent = 100;
    mtDebug.debugRed('peer_percent            = ' + p.peer_percent, 'ANNOUNCE', true, p.user);
  } else {
    // p.peer_percent = (Math.round((p.peer_downloaded / (p.peer_downloaded + p.peer_left)) * 10000) / 100) || 0;
    mtDebug.debugRed('p.torrent._id           = ' + p.torrent._id, 'ANNOUNCE', true, p.user);
    mtDebug.debugRed('p.torrent.torrent_size  = ' + p.torrent.torrent_size, 'ANNOUNCE', true, p.user);
    mtDebug.debugRed('p.peer_left             = ' + p.peer_left, 'ANNOUNCE', true, p.user);
    p.peer_percent = Math.round((p.torrent.torrent_size - p.peer_left) / p.torrent.torrent_size * 10000) / 100;
    mtDebug.debugRed('peer_percent            = ' + p.peer_percent, 'ANNOUNCE', true, p.user);
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
