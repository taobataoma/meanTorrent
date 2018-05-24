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
var appConfig = config.meanTorrentConfig.app;
var mtDebug = require(path.resolve('./config/lib/debug'));

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
  log.scoreSettingValue = data.scoreSettingValue || undefined;

  log.save(function (err) {
    if (err) {
      logger.error(err);
    }
  });

  //write userDaysLog
  var mom = moment().utcOffset(appConfig.dbTimeZone);
  var y = mom.get('year');
  var m = mom.get('month') + 1;
  var d = mom.get('date');

  mtDebug.info('announceLog: score = ' + data.write_score);

  UserDaysLog.findOneAndUpdate({
    user: user,
    year: y,
    month: m,
    date: d
  }, {
    $inc: {
      uploaded: data.write_uploaded,
      downloaded: data.write_downloaded,
      score: data.write_score
    },
    updatedAt: Date.now()
  }, {
    upsert: true,
    setDefaultsOnInsert: true
  }, function (err) {
    if (err) {
      logger.error(err);
    } else {
      //write userMonthsLog
      UserMonthsLog.findOneAndUpdate(
        {
          user: user,
          year: y,
          month: m
        }, {
          $inc: {
            uploaded: data.write_uploaded,
            downloaded: data.write_downloaded,
            score: data.write_score.toFixed(2)
          },
          updatedAt: Date.now()
        }, {
          upsert: true,
          setDefaultsOnInsert: true
        }, function (err) {
          if (err) {
            logger.error(err);
          }
        }
      );
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
  var mom = moment().utcOffset(appConfig.dbTimeZone);
  var y = mom.get('year');
  var m = mom.get('month') + 1;
  var d = mom.get('date');

  mtDebug.info('scoreLog: score = ' + score);

  UserDaysLog.findOneAndUpdate({
    user: user,
    year: y,
    month: m,
    date: d
  }, {
    $inc: {
      score: score
    },
    updatedAt: Date.now()
  }, {
    upsert: true,
    setDefaultsOnInsert: true
  }, function (err) {
    if (err) {
      logger.error(err);
    } else {
      //write userMonthsLog
      UserMonthsLog.findOneAndUpdate(
        {
          user: user,
          year: y,
          month: m
        }, {
          $inc: {
            score: score
          },
          updatedAt: Date.now()
        }, {
          upsert: true,
          setDefaultsOnInsert: true
        }, function (err) {
          if (err) {
            logger.error(err);
          }
        }
      );
    }
  });
};
