'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  logger = require('./logger'),
  dataLog = require(path.resolve('./config/lib/data-log')),
  common = require(path.resolve('./config/lib/common')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ScoreLog = mongoose.model('ScoreLog');

var scoreConfig = config.meanTorrentConfig.score;
var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * update
 *
 * @param req
 * @param user
 * @param action
 * @param value
 */
module.exports.update = function (req, user, action, value, writeLog = true) {
  var v = value || action.value || 0;
  mtDebug.info('scoreUpdate: value = ' + v);

  if (action.enable && v !== 0) {
    if (user) {
      var up = {
        score: v
      };

      if (common.examinationIsValid(user)) {
        up['examinationData.score'] = v;
        mtDebug.debugGreen('---------------WRITE EXAMINATION SCORE----------------', 'ANNOUNCE', true, req.passkeyuser);
        mtDebug.debugRed('examinationData.score: ' + v, 'ANNOUNCE', true, req.passkeyuser);
      }

      User.update({_id: user._id}, {
        $inc: up
      }, function (err, num) {
        if (err) {
          logger.error(err);
        } else {
          var sl = new ScoreLog({
            user: user,
            score: v,
            reason: {
              event: action.name,
              event_str: action.content,
              params: action.params
            }
          });
          sl.save(function (err) {
            if (err) {
              logger.error(err);
            }
          });
        }
      });

      //write score log
      if (writeLog) {
        dataLog.scoreLog(user, v);
      }
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
  level.score = user.score;

  level.prevLevel = (l - 1) <= 0 ? 0 : l - 1;
  level.currLevel = l;
  level.nextLevel = l + 1;

  level.prevLevelValue = level.prevLevel * level.prevLevel * step;
  level.currLevelValue = level.currLevel * level.currLevel * step;
  level.nextLevelValue = level.nextLevel * level.nextLevel * step;
  level.currPercent = Math.ceil((user.score - level.currLevelValue) / (level.nextLevelValue - level.currLevelValue) * 10000) / 100;
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
