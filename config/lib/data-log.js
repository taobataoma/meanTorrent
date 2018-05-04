'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  logger = require('./logger'),
  moment = require('moment'),
  mongoose = require('mongoose'),
  AnnounceLog = mongoose.model('AnnounceLog'),
  UserDaysLog = mongoose.model('UserDaysLog'),
  UserMonthsLog = mongoose.model('UserMonthsLog');

var announceConfig = config.meanTorrentConfig.announce;

/**
 * announceLog
 * @param req
 * @param torrent
 * @param data
 */
module.exports.announceLog = function (user, torrent, data) {
  var log = new AnnounceLog();
  log.user = user;
  log.torrent = torrent;

  log.query_uploaded = data.query_uploaded || 0;
  log.query_downloaded = data.query_downloaded || 0;
  log.currentPeer_uploaded = data.currentPeer_uploaded || 0;
  log.currentPeer_downloaded = data.currentPeer_downloaded || 0;
  log.curr_uploaded = data.curr_uploaded || 0;
  log.curr_downloaded = data.curr_downloaded || 0;
  log.write_uploaded = data.write_uploaded || 0;
  log.write_downloaded = data.write_downloaded || 0;
  log.write_score = data.write_score || 0;
  log.isVip = data.isVip || false;
  log.isUploader = data.isUploader || false;
  log.salesSettingValue = data.salesSettingValue || undefined;
  log.scoreSettingValue = data.isUploader || undefined;

  log.save(function (err) {
    if (err) {
      logger.error(err);
    }
  });

  //remove announce-log old data
  AnnounceLog.remove({
    createdAt: {$lt: Date.now() - announceConfig.announceLogDays * 60 * 1000 * 60 * 24}
  }, function (err) {
    if (err) {
      logger.error(err);
    }
  });

  //write userDaysLog
  var mom = moment();
  var y = mom.get('year');
  var m = mom.get('month') + 1;
  var d = mom.get('date');

  UserDaysLog.findOne({
    year: y,
    month: m,
    date: d
  }).exec(function (err, l) {
    if (l) {
      l.uploaded += data.write_uploaded || 0;
      l.downloaded += data.write_downloaded || 0;
      l.score += data.write_score || 0;

      l.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    } else {
      var udl = new UserDaysLog();
      udl.user = user;
      udl.year = y;
      udl.month = m;
      udl.date = d;
      udl.uploaded = data.write_uploaded || 0;
      udl.downloaded = data.write_downloaded || 0;
      udl.score = data.write_score || 0;

      udl.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    }
  });

  //remove announce-log old data
  UserDaysLog.remove({
    month: {$lt: mom.subtract(12, 'months')}
  }, function (err) {
    if (err) {
      logger.error(err);
    }
  });

  //write userMonthsLog
  UserMonthsLog.findOne({
    year: y,
    month: m
  }).exec(function (err, l) {
    if (l) {
      l.uploaded += data.write_uploaded || 0;
      l.downloaded += data.write_downloaded || 0;
      l.score += data.write_score || 0;

      l.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    } else {
      var udl = new UserMonthsLog();
      udl.user = user;
      udl.year = y;
      udl.month = m;
      udl.uploaded = data.write_uploaded || 0;
      udl.downloaded = data.write_downloaded || 0;
      udl.score = data.write_score || 0;

      udl.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    }
  });
};

/**
 * scoreLog
 * @param user
 * @param score
 */
module.exports.scoreLog = function (user, score) {
  //write userDaysLog
  var mom = moment();
  var y = mom.get('year');
  var m = mom.get('month') + 1;
  var d = mom.get('date');

  UserDaysLog.findOne({
    year: y,
    month: m,
    date: d
  }).exec(function (err, l) {
    if (l) {
      l.score += score || 0;

      l.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    } else {
      var udl = new UserDaysLog();
      udl.user = user;
      udl.year = y;
      udl.month = m;
      udl.date = d;
      udl.score = score || 0;

      udl.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    }
  });

  //write userMonthsLog
  UserMonthsLog.findOne({
    year: y,
    month: m
  }).exec(function (err, l) {
    if (l) {
      l.score += score || 0;

      l.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    } else {
      var udl = new UserMonthsLog();
      udl.user = user;
      udl.year = y;
      udl.month = m;
      udl.score = score || 0;

      udl.save(function (err) {
        if (err) {
          logger.error(err);
        }
      });
    }
  });
};
