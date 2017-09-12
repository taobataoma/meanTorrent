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
  var skip = 0;
  var limit = 0;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  var countQuery = function (callback) {
    Trace.count({}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
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
      .populate({
        path: 'content.torrent',
        model: 'Torrent'
      })
      .populate({
        path: 'content.complete',
        model: 'Complete'
      })
      .skip(skip)
      .limit(limit)
      .exec(function (err, traces) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, traces);
        }
      });
  };

  async.parallel([countQuery, findQuery], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({rows: results[1], total: results[0]});
    }
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

