'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  AdminMessage = mongoose.model('AdminMessage'),
  async = require('async');

/**
 * create a Message
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var msg = new AdminMessage(req.body);
  msg.from_user = req.user._id;

  msg.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(msg);
    }
  });
};

/**
 * list Messages
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  AdminMessage.find()
    .sort('-createdat')
    .populate('from_user', 'displayName profileImageURL uploaded downloaded')
    .exec(function (err, messages) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(messages);
    });
};

/**
 * delete Message
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  if (req.query.ids) {
    AdminMessage.remove({
      _id: {$in: req.query.ids}
    }, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.status(200).send({
          message: 'delete successfully'
        });
      }
    });
  }
};

/**
 * setReaded
 */
exports.setReaded = function (req, res) {
  var adminMessage = req.adminMessage;

  adminMessage._readers.push(req.user._id);
  adminMessage.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(adminMessage);
    }
  });
};

/**
 * Invitation middleware
 */
exports.adminMessageByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  AdminMessage.findById(id)
    .populate('from_user', 'displayName profileImageURL uploaded downloaded')
    .exec(function (err, message) {
      if (err) {
        return next(err);
      } else if (!message) {
        return res.status(404).send({
          message: 'No message with that identifier has been found'
        });
      }
      req.adminMessage = message;
      next();
    });
};

