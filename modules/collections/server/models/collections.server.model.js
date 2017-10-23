'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection Schema
 */
var CollectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tmdb_id: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  overview: {
    type: String,
    trim: true,
    default: ''
  },
  poster_path: {
    type: String,
    trim: true,
    default: ''
  },
  backdrop_path: {
    type: String,
    trim: true,
    default: ''
  },
  torrents: [{
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  }],
  recommend_level: {
    type: String,
    default: 'none'
  },
  vote_average: {
    type: Number,
    default: 0
  },
  vote_total: {
    type: Number,
    default: 0
  },
  vote_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  ordered_at: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Collection', CollectionSchema);
