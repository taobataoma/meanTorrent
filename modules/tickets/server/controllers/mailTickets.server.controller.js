'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  MailTicket = mongoose.model('MailTicket'),
  async = require('async');

/**
 * list Messages
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  var skip = 0;
  var limit = 0;
  var condition = {};
  var status = 'all';

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }
  if (req.query.status !== undefined) {
    status = req.query.status;
  }

  if (status !== 'all') {
    condition.status = status;
  }

  var countMessage = function (callback) {
    MailTicket.count(condition, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findMessage = function (callback) {
    MailTicket.find(condition)
      .sort('-updatedAt -createdAt')
      .populate('handler', 'displayName profileImageURL uploaded downloaded')
      .skip(skip)
      .limit(limit)
      .exec(function (err, messages) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, messages);
        }
      });
  };

  async.parallel([countMessage, findMessage], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({rows: results[1], total: results[0]});
    }
  });
};

/**
 * delete Message
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  if (req.user.isOper) {
    if (req.params.messageId) {
      var message = req.mailTicket;
      message.remove(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(message);
        }
      });

    } else {
      if (req.query.ids) {
        MailTicket.remove({
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
    }
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * Update
 */
exports.update = function (req, res) {
  var message = req.mailTicket;

  message.updatedAt = Date.now();

  message.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(message);
    }
  });
};

/**
 * createReply
 * @param req
 * @param res
 */
exports.createReply = function (req, res) {
  var reply = new MailTicket(req.body);

  var message = req.messageTicket;
  message._replies.push(reply);
  message.updatedAt = Date.now();

  message.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(message);
    }
  });
};

/**
 * Invitation middleware
 */
exports.mailTicketById = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  MailTicket.findById(id)
    .populate('handler', 'displayName profileImageURL uploaded downloaded')
    .exec(function (err, mailTicket) {
      if (err) {
        return next(err);
      } else if (!mailTicket) {
        return res.status(404).send();
      }
      req.mailTicket = mailTicket;
      next();
    });
};

