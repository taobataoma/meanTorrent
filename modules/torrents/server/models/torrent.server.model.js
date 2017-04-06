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
  torrent_release: {
    type: String,
    default: '2017',
    trim: true
  },
  torrent_status: {
    type: [{
      type: String,
      enum: ['new', 'reviewed', 'deleted']
    }],
    default: ['new']
  },
  torrent_sale_status: {
    type: [{
      type: String,
      enum: ['FREE', '1/30%', '1/50%', '1/100%', '2/30%', '2/50%', '2/100%', '3/50%', '3/100%']
    }],
    default: ['1/100%']
  },
  torrent_recommended: {
    type: Number,
    default: 0
  },
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
