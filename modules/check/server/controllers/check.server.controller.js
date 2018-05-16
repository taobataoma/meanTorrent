'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  User = mongoose.model('User'),
  Check = mongoose.model('Check'),
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var mtDebug = require(path.resolve('./config/lib/debug'));
var scoreConfig = config.meanTorrentConfig.score;

/**
 * Show the current collection
 */
exports.get = function (req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  } else {
    Check.findOne({user: req.user._id}, function (err, ck) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (!ck) {
          return res.status(422).send({
            message: 'no check data founded'
          });
        } else {
          var oldCheckDate = moment(moment(ck.lastCheckedAt).utcOffset(appConfig.dbTimeZone).format('YYYY-MM-DD'));
          var now = moment(moment().utcOffset(appConfig.dbTimeZone).format('YYYY-MM-DD'));
          var diff = now.diff(oldCheckDate, 'days');

          var nck = ck.toJSON();
          nck.todayIsDone = (diff === 0 ? true : false);
          res.json(nck);
        }
      }
    });
  }

};

/**
 * Update an collection
 */
exports.check = function (req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  } else {
    var score = 0;
    Check.findOne({user: req.user._id}, function (err, ck) {
      if (!ck) {
        ck = new Check();
        ck.user = req.user._id;
        ck.keepDays = 1;
        ck.save();

        score = scoreConfig.action.dailyCheckIn.dailyBasicScore + (ck.keepDays - 1) * scoreConfig.action.dailyCheckIn.dailyStepScore;
        score = Math.min(score, scoreConfig.action.dailyCheckIn.dailyMaxScore);
        scoreUpdate(req, req.user, scoreConfig.action.dailyCheckIn, score);

        ck = ck.toJSON();
        ck.todayIsDone = true;
        res.json(ck);
      } else {
        var oldCheckDate = moment(moment(ck.lastCheckedAt).utcOffset(appConfig.dbTimeZone).format('YYYY-MM-DD'));
        var now = moment(moment().utcOffset(appConfig.dbTimeZone).format('YYYY-MM-DD'));
        var diff = now.diff(oldCheckDate, 'days');

        if (diff === 0) {
          return res.status(422).json({
            message: 'SERVER.YOU_ALREADY_CHECK_IN'
          });
        } else if (diff === 1) {
          ck.keepDays += 1;
          ck.lastCheckedAt = Date.now();
          ck.save();

          score = scoreConfig.action.dailyCheckIn.dailyBasicScore + (ck.keepDays - 1) * scoreConfig.action.dailyCheckIn.dailyStepScore;
          score = Math.min(score, scoreConfig.action.dailyCheckIn.dailyMaxScore);
          scoreUpdate(req, req.user, scoreConfig.action.dailyCheckIn, score);

          ck = ck.toJSON();
          ck.todayIsDone = true;
          res.json(ck);
        } else {
          ck.keepDays = 1;
          ck.lastCheckedAt = Date.now();
          ck.save();

          score = scoreConfig.action.dailyCheckIn.dailyBasicScore + (ck.keepDays - 1) * scoreConfig.action.dailyCheckIn.dailyStepScore;
          score = Math.min(score, scoreConfig.action.dailyCheckIn.dailyMaxScore);
          scoreUpdate(req, req.user, scoreConfig.action.dailyCheckIn, score);

          ck = ck.toJSON();
          ck.todayIsDone = true;
          res.json(ck);
        }
      }
    });
  }
};
