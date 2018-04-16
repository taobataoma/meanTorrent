'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  fs = require('fs'),
  User = mongoose.model('User'),
  MessageTicket = mongoose.model('MessageTicket'),
  async = require('async');

var mtDebug = require(path.resolve('./config/lib/debug'));

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
 * read Messages
 * @param req
 * @param res
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var ticket = req.messageTicket ? req.messageTicket.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ticket.isCurrentUserOwner = !!(req.user && ticket.from && ticket.from._id.toString() === req.user._id.toString());

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

  message.title = req.body.title;
  message.content = req.body.content;
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
  reply.from = req.user._id;

  var message = req.messageTicket;
  message._replies.push(reply);
  message.updatedAt = Date.now();

  //replace content path
  var tmp = config.uploads.tickets.image.temp.substr(1);
  var dst = config.uploads.tickets.image.dest.substr(1);

  var regex = new RegExp(tmp, 'g');
  reply.content = reply.content.replace(regex, dst);

  //move temp torrent file to dest directory
  req.body._uImage.forEach(function (f) {
    var oldPath = config.uploads.tickets.image.temp + f.filename;
    var newPath = config.uploads.tickets.image.dest + f.filename;
    move(oldPath, newPath, function (err) {
      if (err) {
        mtDebug.debugRed(err);
      }
    });
  });

  //message save
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
 * move file
 * @param oldPath
 * @param newPath
 * @param callback
 */
function move(oldPath, newPath, callback) {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === 'EXDEV') {
        copy();
      } else {
        callback(err);
      }
      return;
    }
    callback();
  });

  function copy() {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
      fs.unlink(oldPath, callback);
    });
    readStream.pipe(writeStream);
  }
}

/**
 * uploadTicketImage
 * @param req
 * @param res
 */
exports.uploadTicketImage = function (req, res) {
  var user = req.user;
  var createUploadTicketImageFilename = require(path.resolve('./config/lib/multer')).createUploadTicketImageFilename;
  var getUploadTicketImageDestination = require(path.resolve('./config/lib/multer')).getUploadTicketImageDestination;
  var fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var imageInfo = {};

  var storage = multer.diskStorage({
    destination: getUploadTicketImageDestination,
    filename: createUploadTicketImageFilename
  });

  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: config.uploads.tickets.image.limits
  }).single('newTicketImageFile');

  if (user) {
    uploadFile()
      .then(function () {
        res.status(200).send(imageInfo);
      })
      .catch(function (err) {
        res.status(422).send(err);
        mtDebug.debugRed(err);

        if (req.file && req.file.filename) {
          var newfile = config.uploads.tickets.image.temp + req.file.filename;
          if (fs.existsSync(newfile)) {
            mtDebug.debugRed(err);
            mtDebug.debugRed('ERROR: DELETE TEMP TICKET IMAGE FILE: ' + newfile);
            fs.unlinkSync(newfile);
          }
        }
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadFile() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          var message = errorHandler.getErrorMessage(uploadError);

          if (uploadError.code === 'LIMIT_FILE_SIZE') {
            message = 'Ticket image file too large. Maximum size allowed is ' + (config.uploads.tickets.image.limits.fileSize / (1024 * 1024)).toFixed(2) + ' Mb files.';
          }

          reject(message);
        } else {
          imageInfo.filename = req.file.filename;
          resolve();
        }
      });
    });
  }
};

/**
 * deleteReply
 * @param req
 * @param res
 */
exports.deleteReply = function (req, res) {
  var message = req.messageTicket;

  message._replies.forEach(function (r) {
    if (r._id.equals(req.params.replyId)) {

      if (!canEdit(req.user) && !isOwner(req.user, r)) {
        return res.status(403).json({
          message: 'SERVER.USER_IS_NOT_AUTHORIZED'
        });
      } else {
        message._replies.pull(r);

        MessageTicket.update({_id: message._id}, {$pull: {_replies: {_id: r._id}}}, function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            return res.json(message);
          }
        });

        // message.markModified('_replies');
        // message.save(function (err) {
        //   if (err) {
        //     return res.status(422).send({
        //       message: errorHandler.getErrorMessage(err)
        //     });
        //   } else {
        //     return res.json(message);
        //   }
        // });
      }
    }
  });
};

/**
 * updateReply
 * @param req
 * @param res
 */
exports.updateReply = function (req, res) {
  var message = req.messageTicket;

  message._replies.forEach(function (r) {
    if (r._id.equals(req.params.replyId)) {

      if (!canEdit(req.user) && !isOwner(req.user, r)) {
        return res.status(403).json({
          message: 'SERVER.USER_IS_NOT_AUTHORIZED'
        });
      }

      r.content = req.body.content;
      message.markModified('_replies');
      message.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          return res.json(message);
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

/**
 * canEdit
 * @param u, req.user
 * @param f, forum
 * @returns {boolean}
 */
function canEdit(u) {
  if (u.isOper) {
    return true;
  } else if (u.isAdmin) {
    return true;
  } else {
    return false;
  }
}

/**
 * isOwner
 * @param o, topic or reply object
 * @returns {boolean}
 */
function isOwner(u, o) {
  if (o) {
    if (o.from._id.equals(u._id)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
