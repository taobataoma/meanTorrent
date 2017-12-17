'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var hnrConfig = config.meanTorrentConfig.hitAndRun;
var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;

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
  remove_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  refreshat: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

/**
 * Hook a pre save method
 */
CompleteSchema.pre('save', function (next) {
  countRatio(this);
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
 * globalUpdateMethod
 */
CompleteSchema.methods.globalUpdateMethod = function () {
  this.refreshat = Date.now();
  this.save();
};

/**
 * countHnRWarning
 * only for completed torrents to count warning
 */
CompleteSchema.methods.countHnRWarning = function (u) {
  if (this.complete) {
    if (u.isVip || this.total_seed_time >= hnrConfig.condition.seedTime || this.total_downloaded === 0 || this.total_ratio >= hnrConfig.condition.ratio) {
      if (this.hnr_warning) {
        this.update({
          $set: {hnr_warning: false}
        }).exec();

        //update user warning numbers
        u.update({
          $inc: {hnr_warning: -1}
        }).exec();

        //add server message
        if (serverNoticeConfig.action.hnrWarningRemoveByAnnounce.enable) {
          serverMessage.addMessage(u._id, serverNoticeConfig.action.hnrWarningRemoveByAnnounce.title, serverNoticeConfig.action.hnrWarningRemoveByAnnounce.content, {
            torrent_file_name: this.torrent.torrent_filename,
            torrent_id: this.torrent._id
          });
        }
      }
    } else {
      if (!this.hnr_warning && !this.remove_by) {
        this.update({
          $set: {hnr_warning: true}
        }).exec();

        //update user warning numbers
        u.update({
          $inc: {hnr_warning: 1}
        }).exec();

        //add server message
        if (serverNoticeConfig.action.hnrWarningAddByAnnounce.enable) {
          serverMessage.addMessage(u._id, serverNoticeConfig.action.hnrWarningAddByAnnounce.title, serverNoticeConfig.action.hnrWarningAddByAnnounce.content, {
            torrent_file_name: this.torrent.torrent_filename,
            torrent_id: this.torrent._id,
            hnr_ratio: hnrConfig.condition.ratio,
            hnr_days: hnrConfig.condition.seedTime / (60 * 60 * 1000 * 24)
          });
        }
      }
    }
  }
};

/**
 * removeHnRWarning
 * remove H&R warning
 */
CompleteSchema.methods.removeHnRWarning = function (u) {
  if (this.hnr_warning) {
    this.update({
      $set: {hnr_warning: false}
    }).exec();

    //update user warning numbers
    u.update({
      $inc: {hnr_warning: -1}
    }).exec();
  }
};


CompleteSchema.index({user: -1, createdAt: -1});
CompleteSchema.index({torrent: 1, createdAt: -1});

mongoose.model('Complete', CompleteSchema);
