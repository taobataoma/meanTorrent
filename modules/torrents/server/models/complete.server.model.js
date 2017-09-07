'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Complete Schema
 */
var CompleteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  torrent: {
    type: Schema.Types.ObjectId,
    ref: 'Torrent'
  },
  total_uploaded: {
    type: Number,
    default: 0
  },
  total_downloaded: {
    type: Number,
    default: 0
  },
  total_ratio: {
    type: Number,
    default: 0
  },
  total_seed_time: {
    type: Number,
    default: 0
  },
  total_seed_day: {
    type: Number,
    default: 0
  },
  hnr_warning: {
    type: Boolean,
    default: false
  },
  remove_warning_score: {
    type: Number,
    default: 0
  },
  remove_warning_at: {
    type: Date,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CompleteSchema.pre('save', function (next) {
  countRatio(this);
  countSeedDay(this);
  next();
});

/**
 * Hook a pre save method to hash the password
 */
CompleteSchema.pre('update', function (next) {
  countRatio(this);
  countSeedDay(this);
  next();
});

function countRatio(t) {
  if (t.total_uploaded > 0 && t.total_downloaded === 0) {
    t.total_ratio = -1;
  } else if (t.total_uploaded === 0 || t.total_downloaded === 0) {
    t.total_ratio = 0;
  } else {
    t.total_ratio = Math.round((t.total_uploaded / t.total_downloaded) * 100) / 100;
  }
}

function countSeedDay(t) {
  t.total_seed_day = Math.floor(t.total_seed_time / (60 * 60 * 1000 * 24));
}

CompleteSchema.index({user: -1, createdAt: -1});
CompleteSchema.index({torrent: 1, createdAt: -1});

mongoose.model('Complete', CompleteSchema);
