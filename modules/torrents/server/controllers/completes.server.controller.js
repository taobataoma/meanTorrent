'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  Complete = mongoose.model('Complete'),
  Torrent = mongoose.model('Torrent'),
  async = require('async'),
  validator = require('validator'),
  scoreUpdate = require(path.resolve('./config/lib/score')).update,
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var hnrConfig = config.meanTorrentConfig.hitAndRun;
var traceConfig = config.meanTorrentConfig.trace;
var scoreConfig = config.meanTorrentConfig.score;

/**
 * removeWarning
 * @param req
 * @param res
 */
exports.removeWarning = function (req, res) {
  var comp = req.complate;
  var user = req.user;

  if (user.isOper) {
    comp.hnr_warning = false;
    comp.remove_warning_at = Date.now();
    comp.remove_by = req.user;

    comp.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(comp);

        //update warning number of user
        comp.user.update({
          $inc: {hnr_warning: -1}
        }).exec();

        //create trace log
        traceLogCreate(req, traceConfig.action.adminRemoveHnrWarning, {
          user: comp.user._id,
          complete: comp._id
        });
      }
    });
  } else {
    if (!comp.user._id.equals(req.user._id)) {
      return res.status(403).json({
        message: 'Only owner or oper can remove warning'
      });
    } else {
      if (req.user.score < hnrConfig.scoreToRemoveWarning) {
        return res.status(422).send({
          message: 'SERVER.SCORE_NOT_ENOUGH'
        });
      } else {
        //update score
        scoreUpdate(req, req.user, scoreConfig.action.scoreToRemoveWarning, -(hnrConfig.scoreToRemoveWarning));

        comp.hnr_warning = false;
        comp.remove_warning_at = Date.now();
        comp.remove_warning_score = hnrConfig.scoreToRemoveWarning;
        comp.remove_by = req.user;

        comp.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(comp);

            //update warning number of user
            comp.user.update({
              $inc: {hnr_warning: -1}
            }).exec();

            //create trace log
            traceLogCreate(req, traceConfig.action.userRemoveHnrWarning, {
              complete: comp._id,
              score: hnrConfig.scoreToRemoveWarning
            });
          }
        });
      }
    }
  }
};


/**
 * complete middleware
 */
exports.completeByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  Complete.findById(id)
    .populate('user', 'username displayName profileImageURL')
    .populate('remove_by', 'username displayName profileImageURL')
    .exec(function (err, complete) {
      if (err) {
        return next(err);
      } else if (!complete) {
        return res.status(404).send();
      }
      req.complate = complete;
      next();
    });
};

