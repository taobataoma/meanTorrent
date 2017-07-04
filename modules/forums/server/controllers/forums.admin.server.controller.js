'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  Forum = mongoose.model('Forum'),
  Topic = mongoose.model('Topic'),
  async = require('async');

/**
 * create a forum
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var forum = new Forum(req.body);

  forum.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(forum);
    }
  });
};

/**
 * list forums
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  Forum.find()
    .sort('order -createdat')
    .populate('lastTopic')
    .populate('moderators', 'username displayName profileImageURL uploaded downloaded')
    .exec(function (err, forums) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(forums);
    });
};

/**
 * Update an forum
 */
exports.update = function (req, res) {
  var forum = req.forum;

  forum.name = req.body.name;
  forum.desc = req.body.desc;
  forum.order = req.body.order;
  forum.readOnly = req.body.readOnly;
  forum.category = req.body.category;

  forum.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(forum);
    }
  });
};

/**
 * delete forum
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  var forum = req.forum;
  forum.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(forum);
    }
  });
};

/**
 * Invitation middleware
 */
exports.forumByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Forum is invalid'
    });
  }

  Forum.findById(id)
    .populate('lastTopic')
    .populate('moderators', 'username displayName profileImageURL uploaded downloaded')
    .exec(function (err, forum) {
      if (err) {
        return next(err);
      } else if (!forum) {
        return res.status(404).send({
          message: 'No forum with that identifier has been found'
        });
      }
      req.forum = forum;
      next();
    });
};

