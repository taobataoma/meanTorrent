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
  AdminMessage = mongoose.model('AdminMessage'),
  async = require('async');

/**
 * create a Message
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var msg = new Message(req.body);
  msg.from_user = req.user._id;
  msg.from_status = 1;
  msg.to_status = 0;

  if (!msg.to_user || !mongoose.Types.ObjectId.isValid(msg.to_user)) {
    return res.status(400).send({
      message: 'Receiver user id is invalid'
    });
  }

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
  var condition = {};
  var type = 'user';
  var role = 'user';
  var db = undefined;

  if (req.query.type !== undefined) {
    type = req.query.type;
  }
  if (req.query.role !== undefined) {
    role = req.query.role;
  }

  db = role === 'admin' ? AdminMessage : Message;
  condition.type = type;

  var findMessage = function (callback) {
    if (role === 'admin') {
      condition.createdat = {$gt: req.user.created};
      AdminMessage.find(condition)
        .sort('-createdat')
        .populate('from_user', 'displayName profileImageURL uploaded downloaded')
        .exec(function (err, messages) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, messages);
          }
        });
    } else {
      condition.$or = [
        {from_user: req.user._id},
        {to_user: req.user._id}
      ];

      db.find(condition)
        .sort('-updatedat -createdat')
        .populate('from_user', 'displayName profileImageURL uploaded downloaded')
        .populate('to_user', 'displayName profileImageURL uploaded downloaded')
        .populate({
          path: '_replies.from_user',
          select: 'displayName profileImageURL uploaded downloaded',
          model: 'User'
        })
        .populate({
          path: '_replies.to_user',
          select: 'displayName profileImageURL uploaded downloaded',
          model: 'User'
        })
        .exec(function (err, messages) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, messages);
          }
        });
    }
  };

  async.parallel([findMessage], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({rows: results[0]});
    }
  });
};

/**
 * delete Message
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  if (req.params.messageId) {
    var message = req.message;
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
      Message.remove({
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
};

/**
 * Update
 */
exports.update = function (req, res) {
  var message = req.message;

  if (req.body.from_status) {
    message.from_status = req.body.from_status;
  }
  if (req.body.to_status) {
    message.to_status = req.body.to_status;
  }

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
  var reply = new Message(req.body);

  var message = req.message;
  message._replies.push(reply);
  message.updatedat = Date.now();

  if (message.from_user._id.equals(req.user._id)) {
    message.to_status = 0;
  } else {
    message.from_status = 0;
  }

  message.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Message.populate(message._replies, {
        path: 'from_user to_user',
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
 * countUnread
 * @param req
 * @param res
 */
exports.countUnread = function (req, res) {
  if (!req.user) {
    return res.status(422).send({
      message: 'User is not signed in'
    });
  }

  //active user update method to update some fields value
  req.user.globalUpdateMethod(true);

  var countFrom = function (callback) {
    Message.count({
      type: 'user',
      from_user: req.user._id,
      from_status: 0
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countTo = function (callback) {
    Message.count({
      type: 'user',
      to_user: req.user._id,
      to_status: 0
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countServer = function (callback) {
    Message.count({
      type: 'server',
      to_user: req.user._id,
      to_status: 0
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countAdminSystemMessage = function (callback) {
    AdminMessage.count({
      type: 'system',
      createdat: {$gt: req.user.created},
      _readers: {$not: {$in: [req.user._id]}}
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countAdminAdvertMessage = function (callback) {
    AdminMessage.count({
      type: 'advert',
      createdat: {$gt: req.user.created},
      _readers: {$not: {$in: [req.user._id]}}
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var getMustReadMessage = function (callback) {
    AdminMessage.find({
      mustRead: true,
      _readers: {$not: {$in: [req.user._id]}}
    }, function (err, msgs) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, msgs);
      }
    });
  };


  async.parallel([countFrom, countTo, countServer, countAdminSystemMessage, countAdminAdvertMessage, getMustReadMessage], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({
        countAll: results[0] + results[1] + results[2] + results[3] + results[4],
        countFrom: results[0],
        countTo: results[1],
        countServer: results[2],
        countSystem: results[3],
        countAdvert: results[4],
        mustRead: results[5]
      });
    }
  });

};

/**
 * Invitation middleware
 */
exports.messageByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  Message.findById(id)
    .populate('from_user', 'displayName profileImageURL uploaded downloaded')
    .populate('to_user', 'displayName profileImageURL uploaded downloaded')
    .populate({
      path: '_replies.from_user',
      select: 'displayName profileImageURL uploaded downloaded',
      model: 'User'
    })
    .populate({
      path: '_replies.to_user',
      select: 'displayName profileImageURL uploaded downloaded',
      model: 'User'
    })
    .exec(function (err, message) {
      if (err) {
        return next(err);
      } else if (!message) {
        return res.status(404).send();
      }
      req.message = message;
      next();
    });
};

