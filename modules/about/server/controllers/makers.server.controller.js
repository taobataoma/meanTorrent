'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Maker = mongoose.model('Maker'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;
var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * Create an maker
 */
exports.create = function (req, res) {
  if (req.user.isOper) {
    var user = req.model;
    var maker = new Maker(req.body);

    maker.user = user._id;
    maker.members.push(user._id);

    mtDebug.debugRed(maker);

    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //save user`s maker
        user.makers.push(maker);
        user.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(user);
          }
        });

        //create trace log
        traceLogCreate(req, traceConfig.action.OperCreateMakerGroup, {
          user: user._id,
          name: maker.name
        });
      }
    });
  } else {
    return res.status(403).json({
      message: 'ERROR: User is not authorized'
    });
  }
};

/**
 * Show the current maker
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var maker = req.maker ? req.maker.toJSON() : {};

  maker.isCurrentUserOwner = !!(req.user && maker.user && maker.user._id.toString() === req.user._id.toString());

  res.json(maker);
};

/**
 * Update an maker
 */
exports.update = function (req, res) {
  var maker = req.maker;

  maker.name = req.body.name;
  maker.desc = req.body.desc;

  maker.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(maker);
    }
  });
};

/**
 * Delete an maker
 */
exports.delete = function (req, res) {
  var maker = req.maker;

  maker.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(maker);
    }
  });
};

/**
 * List of makers
 */
exports.list = function (req, res) {
  Maker.find()
    .sort('-created')
    .populate('user', 'username displayName profileImageURL isVip')
    .populate('members', 'username displayName profileImageURL isVip')
    .exec(function (err, makers) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(makers);
      }
    });
};

/**
 * Maker middleware
 */
exports.makerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Maker is invalid'
    });
  }

  Maker.findById(id)
    .populate('user', 'username displayName profileImageURL isVip')
    .populate('members', 'username displayName profileImageURL isVip')
    .exec(function (err, maker) {
      if (err) {
        return next(err);
      } else if (!maker) {
        return res.status(404).send({
          message: 'No maker with that identifier has been found'
        });
      }
      req.maker = maker;
      next();
    });
};
