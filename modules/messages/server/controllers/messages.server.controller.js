'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  Message = mongoose.model('Message'),
  async = require('async');

/**
 * create a Message
 * @param req
 * @param res
 */
exports.create = function (req, res) {

};

/**
 * list Messages
 * @param req
 * @param res
 */
exports.list = function (req, res) {

};

/**
 * update Message
 * @param req
 * @param res
 */
exports.update = function (req, res) {

};

/**
 * delete Message
 * @param req
 * @param res
 */
exports.delete = function (req, res) {

};

/**
 * createReply
 * @param req
 * @param res
 */
exports.createReply = function (req, res) {

};

/**
 * listReply
 * @param req
 * @param res
 */
exports.listReply = function (req, res) {

};

/**
 * deleteReply
 * @param req
 * @param res
 */
exports.deleteReply = function (req, res) {

};

/**
 * Invitation middleware
 */
exports.messageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Message is invalid'
    });
  }

  Message.findById(id)
    .populate('from_user')
    .populate('to_user')
    .exec(function (err, message) {
      if (err) {
        return next(err);
      } else if (!message) {
        return res.status(404).send({
          message: 'No message with that identifier has been found'
        });
      }
      req.message = message;
      next();
    });
};

