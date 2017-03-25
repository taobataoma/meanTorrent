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
  torrent_tags: {
    type: String,
    default: '[0]',
    trim: true
  },
  torrent_desc: {
    type: String,
    default: '',
    trim: true
  },
  torrent_announce: {
    type: String,
    default: '',
    trim: true
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
