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
  Torrent = mongoose.model('Torrent');

/**
 * create a comment of torrent
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var comment = {};
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

};

/**
 * delete a comment of torrent
 * @param req
 * @param res
 */
exports.delete = function (req, res) {

};

/**
 * list all comment of torrent
 * @param req
 * @param res
 */
exports.list = function (req, res) {

};

/**
 * create a sub comment of comment
 * @param req
 * @param res
 */
exports.SubCreate = function (req, res) {

};

/**
 * update a sub comment of comment
 * @param req
 * @param res
 */
exports.SubUpdate = function (req, res) {

};

/**
 * delete a sub comment of comment
 * @param req
 * @param res
 */
exports.SubDelete = function (req, res) {

};

/**
 * list all sub comment of comment
 * @param req
 * @param res
 */
exports.SubList = function (req, res) {

};

