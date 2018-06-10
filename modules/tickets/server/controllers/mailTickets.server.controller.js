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
  MessageTicket = mongoose.model('MessageTicket'),
  async = require('async');

/**
 * read Messages
 * @param req
 * @param res
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var ticket = req.mailTicket ? req.mailTicket.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ticket.isCurrentUserOwner = !!(req.user && ticket.user && ticket.user._id.toString() === req.user._id.toString());

  res.json(ticket);
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
 * openedCount
 * @param req
 * @param res
 */
exports.openedCount = function (req, res) {
  MailTicket.count({status: 'open'}, function (err, count) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({opened: count});
    }
  });
};

/**
 * openedAllCount
 * @param req
 * @param res
 */
exports.openedAllCount = function (req, res) {
  var mailCount = function (callback) {
    MailTicket.count({status: 'open'}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var messageCount = function (callback) {
    MessageTicket.count({status: 'open'}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  async.parallel([mailCount, messageCount], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({ticketsOpenedCount: results[1] + results[0]});
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

