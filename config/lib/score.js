'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  common = require(path.resolve('./config/lib/common')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;
var examinationConfig = config.meanTorrentConfig.examination;
var scoreConfig = config.meanTorrentConfig.score;

/**
 * update
 *
 * @param req
 * @param user
 * @param action
 * @param value
 */
module.exports.update = function (req, user, action, value) {
  var v = value || action.value;

  if (action.enable) {
    if (user) {
      if (common.examinationIsValid(user)) {
        user.examinationData.score = user.examinationData.score || 0;
        user.examinationData.score += v;

        var uploadFinished = user.examinationData.uploaded >= examinationConfig.incrementData.upload;
        var downloadFinished = user.examinationData.downloaded >= examinationConfig.incrementData.download;
        var scoreFinished = user.examinationData.score >= examinationConfig.incrementData.score;
        user.examinationData.isFinished = uploadFinished && downloadFinished && scoreFinished;
        user.examinationData.finishedTime = user.examinationData.isFinished ? Date.now() : null;

        user.markModified('examinationData');
      }
      user.score += v;
      user.save(function () {
        traceLogCreate(req, traceConfig.action.userScoreChange, {
          user: user._id,
          score: v,
          scoreActionName: action.name
        });
      });
    }
  }
};

/**
 * getLevelByScore
 * @param user
 * @returns {{level object}}
 */
module.exports.getLevelByScore = function (user) {
  var step = scoreConfig.levelStep;

  var level = {};
  var l = Math.floor(Math.sqrt(user.score / step));
  level.score = score;

  level.prevLevel = (l - 1) <= 0 ? 0 : l - 1;
  level.currLevel = l;
  level.nextLevel = l + 1;

  level.prevLevelValue = level.prevLevel * level.prevLevel * step;
  level.currLevelValue = level.currLevel * level.currLevel * step;
  level.nextLevelValue = level.nextLevel * level.nextLevel * step;
  level.currPercent = Math.ceil((score - level.currLevelValue) / (level.nextLevelValue - level.currLevelValue) * 10000) / 100;
  level.currPercentString = level.currPercent + '%';

  return level;
};

/**
 * getScoreByLevel
 * @param l
 * @returns {number}
 */
module.exports.getScoreByLevel = function (l) {
  return l * l * scoreConfig.levelStep;
};
