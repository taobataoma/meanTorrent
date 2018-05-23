'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection Schema
 */
var AlbumSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    trim: true,
    default: ''
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
  backdrop_path: {
    type: String,
    trim: true,
    default: ''
  },
  cover: {
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
  isHomeStatus: {
    type: Boolean,
    default: false
  },
  home_at: {
    type: Date,
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

AlbumSchema.index({type: 1, recommend_level: 1, ordered_at: -1, created_at: -1});
AlbumSchema.index({isHomeStatus: 1, home_at: -1});

mongoose.model('Album', AlbumSchema);
