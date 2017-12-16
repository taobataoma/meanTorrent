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
  Torrent = mongoose.model('Torrent'),
  Comment = mongoose.model('Comment'),
  async = require('async');

var mtDebug = require(path.resolve('./config/lib/debug'));
var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;

/**
 * create a comment of torrent
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var comment = new Comment();
  comment.comment = req.body.comment;
  comment.user = req.user;

  var torrent = req.torrent;
  torrent._replies.push(comment);

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Torrent.populate(torrent._replies, {
        path: 'user',
        select: 'displayName profileImageURL uploaded downloaded'
      }, function (err, t) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(torrent);

          //add server message
          if (serverNoticeConfig.action.torrentNewComment.enable && !torrent.user._id.equals(req.user._id)) {
            serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentNewComment.title, serverNoticeConfig.action.torrentNewComment.content, {
              torrent_file_name: torrent.torrent_filename,
              torrent_id: torrent._id,
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
 * update a comment of torrent
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var torrent = req.torrent;

  torrent._replies.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r.comment = req.body.comment;
      r.editedat = Date.now();
      r.editedby = req.user.displayName;

      torrent.save(function (err, t, numAffected) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(torrent);
        }
      });
    }
  });
};

/**
 * delete a comment of torrent
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  var torrent = req.torrent;
  var commentId = undefined;

  torrent._replies.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      commentId = r.user._id;

      torrent._replies.pull(r);
      torrent.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(torrent);

          //add server message
          if (serverNoticeConfig.action.torrentCommentDeleted.enable) {
            serverMessage.addMessage(commentId, serverNoticeConfig.action.torrentCommentDeleted.title, serverNoticeConfig.action.torrentCommentDeleted.content, {
              torrent_file_name: torrent.torrent_filename,
              torrent_id: torrent._id,
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
  var torrent = req.torrent;
  var comment = new Comment();
  comment.comment = req.body.comment;
  comment.user = req.user;

  torrent._replies.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r._replies.push(comment);
      comment_to = r;
    }
  });

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Torrent.populate(comment_to._replies, {
        path: 'user',
        select: 'displayName profileImageURL uploaded downloaded'
      }, function (err, t) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(torrent);
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
  var torrent = req.torrent;

  torrent._replies.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r._replies.forEach(function (s) {
        if (s._id.equals(req.params.subCommentId)) {
          s.comment = req.body.comment;
          s.editedat = Date.now();
          s.editedby = req.user.displayName;

          torrent.markModified('_replies');
          torrent.save(function (err, t, numAffected) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(torrent);
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
  var torrent = req.torrent;

  torrent._replies.forEach(function (r) {
    if (r._id.equals(req.params.commentId)) {
      r._replies.forEach(function (s) {
        if (s._id.equals(req.params.subCommentId)) {
          mtDebug.debugGreen(r._id + '-' + s._id);
          r._replies.pull(s);

          torrent.markModified('_replies');
          torrent.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(torrent);
            }
          });
        }
      });
    }
  });
};
