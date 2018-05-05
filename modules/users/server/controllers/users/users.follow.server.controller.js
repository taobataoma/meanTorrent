'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * followTo
 * @param req
 * @param res
 */
exports.followTo = function (req, res) {
  var user = req.user;
  var toUser = req.model;

  if (user.following.indexOf(toUser._id) < 0) {
    toUser.followers.push(user._id);
    toUser.save();

    user.following.push(toUser._id);
    user.save(function (err) {
      res.json(user);
    });
  } else {
    res.status(422).send({
      message: 'SERVER.ALREADY_FOLLOWING'
    });
  }
};

/**
 * unFollowTo
 * @param req
 * @param res
 */
exports.unFollowTo = function (req, res) {
  var user = req.user;
  var toUser = req.model;

  toUser.followers.pull(user._id);
  toUser.save();

  user.following.pull(toUser._id);
  user.save(function (err) {
    res.json(user);
  });
};

/**
 * myFollowers
 * @param req
 * @param res
 */
exports.myFollowers = function (req, res) {
  var skip = 0;
  var limit = 0;
  var user = req.user;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  User.populate(user, {
    path: 'followers',
    select: 'username displayName profileImageURL uploaded downloaded isVip score'
  }, function (err, u) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (u) {
      res.json(u.followers ? u.followers.slice(skip, skip + limit) : []);
    }
  });
};

/**
 * myFollowing
 * @param req
 * @param res
 */
exports.myFollowing = function (req, res) {
  var skip = 0;
  var limit = 0;
  var user = req.user;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  User.populate(user, {
    path: 'following',
    select: 'username displayName profileImageURL uploaded downloaded isVip score'
  }, function (err, u) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (u) {
      res.json(u.following ? u.following.slice(skip, skip + limit) : []);
    }
  });
};

/**
 * getUserFollowers
 * @param req
 * @param res
 */
exports.getUserFollowers = function (req, res) {
  var skip = 0;
  var limit = 0;
  var user = req.model;
  var me = req.user;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  if (me.followers.indexOf(user._id) >= 0 || me.following.indexOf(user._id) >= 0 || me.isOper) {
    User.populate(user, {
      path: 'followers',
      select: 'username displayName profileImageURL uploaded downloaded isVip score'
    }, function (err, u) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(u.followers ? u.followers.slice(skip, skip + limit) : []);
      }
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * getUserFollowing
 * @param req
 * @param res
 */
exports.getUserFollowing = function (req, res) {
  var skip = 0;
  var limit = 0;
  var user = req.model;
  var me = req.user;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  if (me.followers.indexOf(user._id) >= 0 || me.following.indexOf(user._id) >= 0 || me.isOper) {
    User.populate(user, {
      path: 'following',
      select: 'username displayName profileImageURL uploaded downloaded isVip score'
    }, function (err, u) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(u.following ? u.following.slice(skip, skip + limit) : []);
      }
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};
