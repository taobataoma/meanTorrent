'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  MessageTicket = mongoose.model('MessageTicket'),
  async = require('async');

/**
 * create a Message
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var msg = new MessageTicket(req.body);
  msg.from = req.user._id;

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
    MessageTicket.count(condition, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findMessage = function (callback) {
    MessageTicket.find(condition)
      .sort('-updatedAt -createdAt')
      .populate('from', 'displayName profileImageURL uploaded downloaded')
      .populate('handler', 'displayName profileImageURL uploaded downloaded')
      .populate({
        path: '_replies.from',
        select: 'displayName profileImageURL uploaded downloaded',
        model: 'User'
      })
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
      var message = req.messageTicket;
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
        MessageTicket.remove({
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
  var message = req.messageTicket;

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
  var reply = new MessageTicket(req.body);

  var message = req.messageTicket;
  message._replies.push(reply);
  message.updatedAt = Date.now();

  message.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      MessageTicket.populate(message._replies, {
        path: 'from',
        select: 'displayName profileImageURL uploaded downloaded'
      }, function (err, t) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(message);
        }
      });
    }
  });
};

/**
 * Invitation middleware
 */
exports.messageTicketById = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  MessageTicket.findById(id)
    .populate('from', 'displayName profileImageURL uploaded downloaded')
    .populate('handler', 'displayName profileImageURL uploaded downloaded')
    .populate({
      path: '_replies.from',
      select: 'displayName profileImageURL uploaded downloaded',
      model: 'User'
    })
    .exec(function (err, messageTicket) {
      if (err) {
        return next(err);
      } else if (!messageTicket) {
        return res.status(404).send();
      }
      req.messageTicket = messageTicket;
      next();
    });
};

