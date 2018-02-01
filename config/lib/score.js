'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  common = require(path.resolve('./config/lib/common')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;
var examinationConfig = config.meanTorrentConfig.examination;

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
        console.log(user.examinationData);
        user.examinationData.score = user.examinationData.score || 0;
        user.examinationData.score += v;

        var uploadFinished = user.examinationData.uploaded >= examinationConfig.incrementData.upload;
        var downloadFinished = user.examinationData.downloaded >= examinationConfig.incrementData.download;
        var scoreFinished = user.examinationData.score >= examinationConfig.incrementData.score;
        user.examinationData.isFinished = uploadFinished && downloadFinished && scoreFinished;

        console.log(user.examinationData);
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

