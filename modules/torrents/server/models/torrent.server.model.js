'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Torrent Schema
 */
var TorrentSchema = new Schema({
  user: {
    type: Schema.ObjectId,
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
  torrent_tmdb_id: {
    type: String,
    default: '',
    trim: true,
    required: 'tmdb id cannot be blank'
  },
  torrent_imdb_id: {
    type: String,
    default: '',
    trim: true
  },
  torrent_title: {
    type: String,
    default: '',
    trim: true,
    required: 'title cannot be blank'
  },
  torrent_original_title: {
    type: String,
    default: '',
    trim: true
  },
  torrent_type: {
    type: String,
    default: 'movie',
    trim: true
  },
  torrent_genres: {
    type: [String],
    default: '',
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
  torrent_imdb_votes: {
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
  torrent_size: {
    type: Number,
    default: 0
  },
  torrent_img: {
    type: String,
    default: '',
    trim: true
  },
  torrent_backdrop_img: {
    type: String,
    default: '',
    trim: true
  },
  torrent_release: {
    type: String,
    default: '2017',
    trim: true
  },
  torrent_status: {
    type: String,
    default: 'new',
    trim: true
  },
  torrent_sale_status: {
    type: String,
    default: 'U1/D1',
    trim: true
  },
  torrent_recommended: {
    type: Number,
    default: 0
  },
  _subtitles: [{
    type: Schema.ObjectId,
    ref: 'Subtitle'
  }],
  _peers: [{
    type: Schema.ObjectId,
    ref: 'Peer'
  }],
  last_scrape: {
    type: Date,
    default: Date.now
  },
  createdat: {
    type: Date,
    default: Date.now
  }
});

TorrentSchema.index({user: -1, createdat: -1});
TorrentSchema.index({info_hash: -1, createdat: -1});

mongoose.model('Torrent', TorrentSchema);
