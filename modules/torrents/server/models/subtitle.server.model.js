'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Subtitle Schema
 */
var SubtitleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  },
  subtitle_filename: {
    type: String,
    default: '',
    trim: true
  },
  subtitle_filesize: {
    type: Number,
    default: 0
  },
  createdat: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

SubtitleSchema.index({user: -1, createdat: -1});
SubtitleSchema.index({torrent: -1, createdat: -1});

mongoose.model('Subtitle', SubtitleSchema);
