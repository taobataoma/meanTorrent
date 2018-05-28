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
    default: 'level0'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  ordered_at: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

CollectionSchema.index({recommend_level: 1, ordered_at: -1, created_at: -1});

mongoose.model('Collection', CollectionSchema);
