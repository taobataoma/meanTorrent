'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var hnrConfig = config.meanTorrentConfig.hitAndRun;
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
  complete: {
    type: Boolean,
    default: false
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

/**
 * Hook a pre save method
 */
CompleteSchema.pre('save', function (next) {
  countRatio(this);
  countSeedDay(this);
  next();
});

/**
 * Hook a pre update method
 */
CompleteSchema.pre('update', function (next) {
  countRatio(this);
  countSeedDay(this);
  next();
});

/**
 * countRatio
 * @param t
 */
function countRatio(t) {
  if (t.total_uploaded > 0 && t.total_downloaded === 0) {
    t.total_ratio = -1;
  } else if (t.total_uploaded === 0 || t.total_downloaded === 0) {
    t.total_ratio = 0;
  } else {
    t.total_ratio = Math.round((t.total_uploaded / t.total_downloaded) * 100) / 100;
  }
}

/**
 * countSeedDay
 * @param t
 */
function countSeedDay(t) {
  t.total_seed_day = Math.floor(t.total_seed_time / (60 * 60 * 1000 * 24));
}

/**
 * countHnRWarning
 * only for completed torrents to count warning
 */
CompleteSchema.methods.countHnRWarning = function (u) {
  if (this.complete) {
    if (this.total_seed_day >= hnrConfig.condition.seedTime || this.total_ratio >= hnrConfig.condition.ratio) {
      if (this.hnr_warning) {
        this.update({
          $set: {hnr_warning: false}
        }).exec();

        //update user warning numbers
        u.update({
          $inc: {hnr_warning: -1}
        }).exec();
      }
    } else {
      if (!this.hnr_warning) {
        this.update({
          $set: {hnr_warning: true}
        }).exec();

        //update user warning numbers
        u.update({
          $inc: {hnr_warning: 1}
        }).exec();
      }
    }
  }
};


CompleteSchema.index({user: -1, createdAt: -1});
CompleteSchema.index({torrent: 1, createdAt: -1});

mongoose.model('Complete', CompleteSchema);
