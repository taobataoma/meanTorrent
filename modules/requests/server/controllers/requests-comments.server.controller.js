'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  Peer = mongoose.model('Peer'),
  Request = mongoose.model('Request'),
  Comment = mongoose.model('Comment'),
  async = require('async');

var mtDebug = require(path.resolve('./config/lib/debug'));
var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;

/**
 * create a comment of request
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var comment = new Comment();
  comment.comment = req.body.comment;
  comment.user = req.user;

  var request = req.request;
  request.comments.push(comment);

  request.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Request.populate(request.comments, {
        path: 'user',
        select: 'displayName profileImageURL uploaded downloaded isVip score'
      }, function (err, t) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(request);

          //add server message
          if (serverNoticeConfig.action.requestNewComment.enable && !request.user._id.equals(req.user._id)) {
            serverMessage.addMessage(request.user._id, serverNoticeConfig.action.requestNewComment.title, serverNoticeConfig.action.requestNewComment.content, {
              request_title: request.title,
              request_id: request._id,
              by_name: req.user.displayName,
              by_id: req.user._id
            });
          }
        }
      });
    }
  });
};

/**
 * update a comment of request
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var request = req.request;

  request.comments.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r.comment = req.body.comment;
      r.editedat = Date.now();
      r.editedby = req.user.displayName;

      request.save(function (err, t, numAffected) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(request);
        }
      });
    }
  });
};

/**
 * delete a comment of request
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  var request = req.request;
  var commentUid = undefined;

  request.comments.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      commentUid = r.user._id;

      request.comments.pull(r);
      request.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(request);

          //add server message
          if (serverNoticeConfig.action.requestCommentDeleted.enable) {
            serverMessage.addMessage(commentUid, serverNoticeConfig.action.requestCommentDeleted.title, serverNoticeConfig.action.requestCommentDeleted.content, {
              request_title: request.title,
              request_id: request._id,
              by_name: req.user.displayName,
              by_id: req.user._id
            });
          }
        }
      });
    }
  });
};

/**
 * create a sub comment of comment
 * @param req
 * @param res
 */
exports.SubCreate = function (req, res) {
  var comment_to = undefined;
  var request = req.request;
  var comment = new Comment();
  comment.comment = req.body.comment;
  comment.user = req.user;

  request.comments.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r._replies.push(comment);
      comment_to = r;
    }
  });

  request.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Request.populate(comment_to._replies, {
        path: 'user',
        select: 'displayName profileImageURL uploaded downloaded isVip score'
      }, function (err, t) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(request);
        }
      });
    }
  });
};

/**
 * update a sub comment of comment
 * @param req
 * @param res
 */
exports.SubUpdate = function (req, res) {
  var request = req.request;

  request.comments.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r._replies.forEach(function (s) {
        if (s._id.equals(req.params.subCommentId)) {
          s.comment = req.body.comment;
          s.editedat = Date.now();
          s.editedby = req.user.displayName;

          request.markModified('comments');
          request.save(function (err, t, numAffected) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(request);
            }
          });
        }
      });
    }
  });
};

/**
 * delete a sub comment of comment
 * @param req
 * @param res
 */
exports.SubDelete = function (req, res) {
  var request = req.request;

  request.comments.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r._replies.forEach(function (s) {
        if (s._id.equals(req.params.subCommentId)) {
          mtDebug.debugGreen(r._id + '-' + s._id);
          r._replies.pull(s);

          request.markModified('comments');
          request.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(request);
            }
          });
        }
      });
    }
  });
};
