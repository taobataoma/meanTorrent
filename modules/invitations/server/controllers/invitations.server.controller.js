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
      res.json(invitation);
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

