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

var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;

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
  forum.operOnly = req.body.operOnly;
  forum.vipOnly = req.body.vipOnly;
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
 * addModerator
 * @param req
 * @param res
 */
exports.addModerator = function (req, res) {
  var forum = req.forum;
  var mu = req.nameuser;

  var om = [];
  forum.moderators.forEach(function (m) {
    om.push(m._id.toString());
  });

  if (om.indexOf(mu._id.toString()) >= 0) {
    return res.status(422).send({
      message: 'username "' + mu.username + '" already exist!'
    });
  } else {
    forum.moderators.push(mu);
    forum.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(forum);

        //add server message
        if (serverNoticeConfig.action.forumBecomeModerator.enable) {
          serverMessage.addMessage(mu._id, serverNoticeConfig.action.forumBecomeModerator.title, serverNoticeConfig.action.forumBecomeModerator.content, {
            forum_name: forum.name,
            forum_id: forum._id
          });
        }
      }
    });
  }
};

/**
 * removeModerator
 * @param req
 * @param res
 * @returns {*}
 */
exports.removeModerator = function (req, res) {
  var forum = req.forum;
  var mu = req.nameuser;

  var om = [];
  forum.moderators.forEach(function (m) {
    om.push(m._id.toString());
  });

  if (om.indexOf(mu._id.toString()) < 0) {
    return res.status(422).send({
      message: 'username "' + mu.username + '" not exist!'
    });
  } else {
    forum.moderators.splice(om.indexOf(mu._id.toString()), 1);
    forum.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(forum);
      }
    });
  }
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
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  Forum.findById(id)
    .populate('lastTopic')
    .populate('moderators', 'username displayName profileImageURL uploaded downloaded')
    .exec(function (err, forum) {
      if (err) {
        return next(err);
      } else if (!forum) {
        return res.status(404).send();
      }
      req.forum = forum;
      next();
    });
};

/**
 * Invitation middleware
 */
exports.userByUsername = function (req, res, next, uname) {
  User.findOne({
    username: uname
  }, '-salt -password -providerData')
    //.select('username displayName profileImageURL uploaded downloaded makers')
    //.populate('makers')
    .exec(function (err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.status(422).send({
          message: 'No user with that username has been found'
        });
      }
      req.nameuser = user;
      next();
    });
};

