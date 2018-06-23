'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  User = mongoose.model('User'),
  Maker = mongoose.model('Maker'),
  Torrent = mongoose.model('Torrent'),
  Favorite = mongoose.model('Favorite'),
  objectId = require('mongodb').ObjectId,
  async = require('async'),
  populateStrings = require(path.resolve('./config/lib/populateStrings'));

var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * Create an favorite
 */
exports.create = function (req, res) {
  var user = req.user;

  Favorite.count({
    user: user._id,
    torrent: req.torrent._id
  }, function (err, count) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (count > 0) {
      return res.status(422).json({
        message: 'SERVER.TORRENT_ALREADY_IN_FAVORITES'
      });
    } else {
      var fav = new Favorite(req.body);
      fav.user = req.user;
      fav.torrent = req.torrent;

      fav.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(fav);
        }
      });
    }
  });
};

/**
 * Delete an favorite
 */
exports.delete = function (req, res) {
  var fav = req.favorite;

  fav.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fav);
    }
  });
};

/**
 * List of favorites
 */
exports.list = function (req, res) {
  var skip = 0;
  var limit = 0;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  var countQuery = function (callback) {
    Favorite.count({
      user: req.user._id
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    Favorite.find({
      user: req.user._id
    })
      .sort('-createdAt')
      .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
      .populate({
        path: 'torrent',
        select: populateStrings.populate_torrent_string,
        populate: [{
          path: 'user',
          select: 'username displayName profileImageURL isVip score uploaded downloaded'
        }, {
          path: 'maker',
          select: 'name'
        }]
      })
      .skip(skip)
      .limit(limit)
      .exec(function (err, favs) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, favs);
        }
      });
  };

  async.parallel([countQuery, findQuery], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({rows: results[1], total: results[0]});
    }
  });
};

/**
 * Favorite middleware
 */
exports.favoriteById = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  Favorite.findById(id).exec(function (err, fav) {
    if (err) {
      return next(err);
    } else if (!fav) {
      return res.status(404).send();
    }
    req.favorite = fav;
    next();
  });
};
