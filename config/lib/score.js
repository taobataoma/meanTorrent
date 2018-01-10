'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;

/**
 * update
 *
 * @param req
 * @param user
 * @param action
 * @param value
 */
module.exports.update = function (req, user, action, value) {
  if (action.enable) {
    if (user) {
      user.update({
        $inc: {score: value || action.value}
      }).exec();

      traceLogCreate(req, traceConfig.action.userScoreChange, {
        user: user._id,
        score: value || action.value
      });
    }
  }
};

