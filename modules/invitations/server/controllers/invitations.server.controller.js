'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  Invitation = mongoose.model('Invitation'),
  async = require('async');

/**
 * create a Invitation
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var invitation = new Invitation();
  invitation.expiresat = Date.now() + config.meanTorrentConfig.invite.expires;
  invitation.user = req.user;

  invitation.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //res.json(invitation);
      var user = req.user;
      user.update({
        $set: {score: user.score - config.meanTorrentConfig.invite.score_exchange}
      }).exec(function (err, result) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          user.score = user.score - config.meanTorrentConfig.invite.score_exchange;
          res.json(user);
        }
      });

    }
  });
};


/**
 * List of Invitations
 */
exports.list = function (req, res) {
  Invitation.find().sort('-created').populate('user', 'displayName').exec(function (err, invitations) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(invitations);
    }
  });
};


/**
 * Delete an invitation
 */
exports.delete = function (req, res) {
  var invitation = req.invitation;

  invitation.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(invitation);
    }
  });
};


/**
 * Invitation middleware
 */
exports.invitationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invitation is invalid'
    });
  }

  Invitation.findById(id).populate('user', 'displayName').exec(function (err, invitation) {
    if (err) {
      return next(err);
    } else if (!invitation) {
      return res.status(404).send({
        message: 'No invitation with that identifier has been found'
      });
    }
    req.invitation = invitation;
    next();
  });
};

