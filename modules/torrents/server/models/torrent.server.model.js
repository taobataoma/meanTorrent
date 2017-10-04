'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
});

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
});

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
});

/**
 * Torrent Schema
 */
var TorrentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

  //resource info
  resource_detail_info: Object,

  createdat: {
    type: Date,
    default: Date.now
  },
  orderedat: {
    type: Date,
    default: Date.now
  }
});

/**
 * overwrite toJSON
 */
TorrentSchema.methods.toJSON = function (options) {
  var document = this.toObject(options);
  document.isSaling = false;

  if (this.torrent_sale_expires > Date.now()) {
    document.isSaling = true;
  }

  if (!document.isSaling) {
    document.torrent_sale_status = 'U1/D1';
  }
  if (document.torrent_sale_status === 'U1/D1') {
    document.isSaling = false;
  }

  return document;
};

TorrentSchema.index({user: -1, createdat: -1});
TorrentSchema.index({info_hash: -1, createdat: -1});
TorrentSchema.index({torrent_tmdb_id: -1, createdat: -1});

mongoose.model('Torrent', TorrentSchema);
mongoose.model('Comment', CommentSchema);
//mongoose.model('Thumb', ThumbSchema);
mongoose.model('Rating', RatingSchema);
