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
 * list forums
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  Forum.find()
    .sort('category order -createdat')
    .populate({
      path: 'lastTopic',
      populate: {
        path: 'user lastUser',
        select: 'username displayName profileImageURL uploaded downloaded'
      }
    })
    .populate('moderators', 'username displayName profileImageURL uploaded downloaded')
    .exec(function (err, forums) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.status(200).send(forums);
      }
    });
};

/**
 * read forum
 * @param req
 * @param res
 */
exports.read = function (req, res) {
  res.json(req.forum);
};

/**
 * listTopics
 * @param req
 * @param res
 */
exports.listTopics = function (req, res) {
  Topic.find({
    forum: req.params.forumId
  })
    .sort('-isTop -updatedAt -createdAt')
    .populate('user', 'username displayName profileImageURL uploaded downloaded')
    .populate('lastUser', 'username displayName profileImageURL uploaded downloaded')
    .exec(function (err, topics) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(topics);
    });
};

/**
 * postNewTopic
 * @param req
 * @param res
 */
exports.postNewTopic = function (req, res) {
  var forum = req.forum;
  var topic = new Topic(req.body);
  topic.forum = forum;
  topic.user = req.user;

  topic.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(topic);
    }
  });

  forum.update({
    $inc: {topicCount: 1},
    lastTopic: topic
  }).exec();
};

/**
 * read forum
 * @param req
 * @param res
 */
exports.readTopic = function (req, res) {
  res.json(req.topic);
};

/**
 * Invitation middleware
 */
exports.topicById = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Topic is invalid'
    });
  }

  Topic.findById(id)
    .populate('user', 'username displayName profileImageURL uploaded downloaded')
    .populate('lastUser', 'username displayName profileImageURL uploaded downloaded')
    .populate('_scoreList.user', 'username displayName profileImageURL uploaded downloaded')
    .populate('_replies.user', 'username displayName profileImageURL uploaded downloaded')
    .exec(function (err, topic) {
      if (err) {
        return next(err);
      } else if (!topic) {
        return res.status(404).send({
          message: 'No topic with that identifier has been found'
        });
      }
      req.topic = topic;
      next();
    });
};
