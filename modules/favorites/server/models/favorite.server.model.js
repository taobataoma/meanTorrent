'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Favorite Schema
 */
var FavoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

FavoriteSchema.index({user: 1, createdAt: -1});

mongoose.model('Favorite', FavoriteSchema);
