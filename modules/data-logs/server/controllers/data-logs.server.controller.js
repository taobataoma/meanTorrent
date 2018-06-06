'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  UserDaysLog = mongoose.model('UserDaysLog'),
  UserMonthsLog = mongoose.model('UserMonthsLog'),
  ScoreLog = mongoose.model('ScoreLog'),
  AnnounceLog = mongoose.model('AnnounceLog'),
  objectId = require('mongodb').ObjectId,
  async = require('async');

var mtDebug = require(path.resolve('./config/lib/debug'));
var announceConfig = config.meanTorrentConfig.announce;

/**
 * List of UserDaysLog
 */
exports.getUserDaysLogs = function (req, res) {
  if (objectId(req.params.userId).equals(req.user._id) || req.user.isOper) {
    UserDaysLog.find({
      user: objectId(req.params.userId)
    }).exec(function (err, logs) {
      res.json(logs);
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * List of UserMonthsLog
 */
exports.getUserMonthsLogs = function (req, res) {
  if (objectId(req.params.userId).equals(req.user._id) || req.user.isOper) {
    UserMonthsLog.find({
      user: objectId(req.params.userId)
    }).exec(function (err, logs) {
      res.json(logs);
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * List of getUserScoreLogs
 */
exports.getUserScoreLogs = function (req, res) {
  if (objectId(req.params.userId).equals(req.user._id) || req.user.isOper) {
    ScoreLog.find({
      user: objectId(req.params.userId)
    }).sort('-createdAt')
      .exec(function (err, logs) {
        res.json(logs);
      });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * getUserAnnounceLogs
 * @param req
 * @param res
 */
exports.getUserAnnounceLogs = function (req, res) {
  if (objectId(req.params.userId).equals(req.user._id) || req.user.isOper) {
    AnnounceLog.find({
      user: objectId(req.params.userId)
    }).sort('-createdAt')
      .exec(function (err, logs) {
        res.json(logs);
      });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};
