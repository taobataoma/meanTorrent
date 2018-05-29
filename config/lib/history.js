'use strict';

var path = require('path'),
  logger = require('./logger'),
  mongoose = require('mongoose'),
  History = mongoose.model('History'),
  User = mongoose.model('User');

/**
 * insert
 * @param user_id
 * @param action
 * @param params
 */
module.exports.insert = function (user_id, action, params = undefined) {
  if (action.enable) {
    var history = new History({
      event: action.name,
      event_str: action.content,
      params: params
    });

    User.update({
      _id: user_id
    }, {
      $push: {history: history}
    }).exec(function (err) {
      if (err) {
        logger.error(err);
      }
    });
  }
};
