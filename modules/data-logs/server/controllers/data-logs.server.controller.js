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
  objectId = require('mongodb').ObjectId,
  async = require('async');

var mtDebug = require(path.resolve('./config/lib/debug'));
var announceConfig = config.meanTorrentConfig.announce;

/**
 * List of UserDaysLog
 */
exports.getUserDaysLogs = function (req, res) {
  UserDaysLog.find({
    user: objectId(req.params.userId)
  }).exec(function (err, logs) {
    res.json(logs);
  });
};

/**
 * List of UserMonthsLog
 */
exports.getUserMonthsLogs = function (req, res) {
  UserMonthsLog.find({
    user: objectId(req.params.userId)
  }).exec(function (err, logs) {
    res.json(logs);
  });
};

/**
 * List of getUserScoreLogs
 */
exports.getUserScoreLogs = function (req, res) {
  ScoreLog.find({
    user: objectId(req.params.userId)
  }).sort('-createdAt')
    .exec(function (err, logs) {
      res.json(logs);
    });
};
