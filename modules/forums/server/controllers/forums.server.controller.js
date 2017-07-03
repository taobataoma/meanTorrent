'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  Forum = mongoose.model('Forum'),
  Topic = mongoose.model('Topic'),
  async = require('async');

/**
 * list forums
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  Forum.find()
    .sort('order -createdat')
    .populate('lastTopic')
    .populate('moderators', 'username displayName profileImageURL uploaded downloaded')
    .exec(function (err, forums) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(forums);
    });
};
