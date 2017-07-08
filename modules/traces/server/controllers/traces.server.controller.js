'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  Trace = mongoose.model('Trace'),
  async = require('async');

/**
 * list Traces
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  Trace.find({})
    .sort('-createdat')
    .populate('user', 'username displayName')
    .populate({
      path: 'content.user',
      select: 'username displayName',
      model: 'User'
    })
    .populate({
      path: 'content.forum',
      model: 'Forum'
    })
    .exec(function (err, traces) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(traces);
    });
};

/**
 * delete Trace
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  var trace = req.trace;
  trace.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trace);
    }
  });
};


/**
 * Invitation middleware
 */
exports.traceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trace is invalid'
    });
  }

  Trace.findById(id)
    .populate('user', 'displayName profileImageURL uploaded downloaded')
    .exec(function (err, trace) {
      if (err) {
        return next(err);
      } else if (!trace) {
        return res.status(404).send({
          message: 'No trace with that identifier has been found'
        });
      }
      req.trace = trace;
      next();
    });
};

