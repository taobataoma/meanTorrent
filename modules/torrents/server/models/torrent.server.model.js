'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Peer = mongoose.model('Peer'),
  Schema = mongoose.Schema;

var announceConfig = config.meanTorrentConfig.announce;

const PEERSTATE_SEEDER = 'seeder';
const PEERSTATE_LEECHER = 'leecher';

/**
 * Sub Comment Schema
 */
var CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: {
    type: String,
    default: '',
    trim: true
  },
  _replies: [this],
  createdat: {
    type: Date,
    default: Date.now
  },
  editedby: {
    type: String,
    default: '',
    trim: true
  },
  editedat: {
    type: Date,
    default: ''
  }
}, {usePushEach: true});

/**
 * Thumb Schema
 */
var ThumbSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

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
}, {usePushEach: true});

/**
 * Torrent Schema
 */
var TorrentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  maker: {
    type: Schema.Types.ObjectId,
    ref: 'Maker'
  },
  info_hash: {
    type: String,
    default: '',
    trim: true,
    required: 'info_hash cannot be blank'
  },
  torrent_filename: {
    type: String,
    default: '',
    trim: true,
    required: 'filename cannot be blank'
  },
  torrent_type: {
    type: String,
    default: 'movie',
    trim: true
  },
  torrent_tags: {
    type: [String],
    default: '',
    trim: true
  },
  torrent_nfo: {
    type: String,
    default: ''
  },
  torrent_announce: {
    type: String,
    default: '',
    trim: true
  },
  torrent_seasons: {
    type: Number,
    default: 0
  },
  torrent_episodes: {
    type: String,
    default: '0'
  },
  torrent_size: {
    type: Number,
    default: 0
  },
  torrent_seeds: {
    type: Number,
    default: 0
  },
  torrent_leechers: {
    type: Number,
    default: 0
  },
  torrent_finished: {
    type: Number,
    default: 0
  },
  torrent_status: {
    type: String,
    default: 'new',
    trim: true
  },
  torrent_hnr: {
    type: Boolean,
    default: false
  },
  torrent_vip: {
    type: Boolean,
    default: false
  },
  torrent_sale_status: {
    type: String,
    default: 'U1/D1',
    trim: true
  },
  torrent_sale_expires: {
    type: Date
  },
  isSaling: {
    type: Boolean,
    default: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  torrent_recommended: {
    type: String,
    default: 'none'
  },
  _subtitles: [{
    type: Schema.Types.ObjectId,
    ref: 'Subtitle'
  }],
  _peers: [{
    type: Schema.Types.ObjectId,
    ref: 'Peer'
  }],
  _replies: [CommentSchema],
  last_scrape: {
    type: Date,
    default: Date.now
  },
  _thumbs: [ThumbSchema],
  _ratings: [RatingSchema],
  _other_torrents: [],
  _all_files: [],
  //resource info
  resource_detail_info: Object,

  createdat: {
    type: Date,
    default: Date.now
  },
  orderedat: {
    type: Date,
    default: Date.now
  },
  refreshat: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

/**
 * Hook a pre save method
 */
TorrentSchema.pre('save', function (next) {
  writeIsSaling(this);
  next();
});

/**
 * countRatio
 * @param user
 */
function writeIsSaling(torrent) {
  torrent.isSaling = false;

  if (torrent.torrent_sale_expires > Date.now()) {
    torrent.isSaling = true;
  }

  if (!torrent.isSaling) {
    torrent.torrent_sale_status = 'U1/D1';
  }
  if (torrent.torrent_sale_status === 'U1/D1') {
    torrent.isSaling = false;
  }
}

/**
 * updateSeedLeechNumbers
 */
TorrentSchema.methods.updateSeedLeechNumbers = function (callback) {
  var torrent = this;

  Peer.aggregate({
    $match: {
      torrent: torrent._id,
      last_announce_at: {$gt: new Date(Date.now() - announceConfig.announceInterval - 60 * 1000)}
    }
  }, {
    $group: {
      _id: '$peer_status',
      count: {$sum: 1}
    }
  }).exec(function (err, counts) {
    if (!err) {
      var sc = 0;
      var lc = 0;
      counts.forEach(function (c) {
        switch (c._id) {
          case PEERSTATE_SEEDER:
            sc = c.count;
            break;
          case PEERSTATE_LEECHER:
            lc = c.count;
            break;
        }
      });

      torrent.update({
        $set: {
          torrent_seeds: sc,
          torrent_leechers: lc
        }
      }).exec();

      if (callback) {
        callback({seedCount: sc, leechCount: lc});
      }
    } else {
      if (callback) {
        callback(null);
      }
    }
  });
};

/**
 * globalUpdateMethod
 */
TorrentSchema.methods.globalUpdateMethod = function (cb) {
  this.refreshat = Date.now();
  this.save(function (err, t) {
    if (cb) cb(t || this);
  });
};

TorrentSchema.index({info_hash: 1});

TorrentSchema.index({user: -1, createdat: -1});
TorrentSchema.index({maker: 1, createdat: -1});
TorrentSchema.index({torrent_tmdb_id: 1, createdat: -1});
TorrentSchema.index({torrent_recommended: 1, createdat: -1});
TorrentSchema.index({torrent_sale_status: 1, createdat: -1});

TorrentSchema.index({
  torrent_sale_status: 1,
  'resource_detail_info.id': 1
});

TorrentSchema.index({
  user: 1,
  torrent_recommended: 1,
  orderedat: -1,
  createdat: -1,
  '_peers.id': 1
});

TorrentSchema.index({
  torrent_status: 1,
  torrent_type: 1,
  torrent_vip: 1,
  torrent_recommended: 1,
  orderedat: -1,
  createdat: -1,
  '_peers.id': 1
});

TorrentSchema.index({
  torrent_status: 1,
  torrent_type: 1,
  torrent_vip: 1,
  maker: 1,
  orderedat: -1,
  createdat: -1
});

mongoose.model('Torrent', TorrentSchema);
mongoose.model('Comment', CommentSchema);
mongoose.model('Rating', RatingSchema);
