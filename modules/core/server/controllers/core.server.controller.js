'use strict';

var validator = require('validator'),
  path = require('path'),
  moment = require('moment'),
  config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      _id: req.user._id,
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      isOper: req.user.roles[0] === 'oper' || req.user.roles[0] === 'admin',
      isAdmin: req.user.roles[0] === 'admin',
      passkey: req.user.passkey,
      vip_start_at: req.user.vip_start_at,
      vip_end_at: req.user.vip_end_at,
      is_vip: req.user.is_vip || isVip(req.user),
      score: req.user.score,
      ratio: req.user.ratio,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared),
    meanTorrentConfig: JSON.stringify(config.meanTorrentConfig)
  });
};

/**
 * get user isVip status
 * @param u
 * @returns {boolean}
 */
function isVip(u) {
  if (!u.vip_start_at || !u.vip_end_at) {
    return false;
  } else if (moment(Date.now()) > moment(u.vip_end_at)) {
    return false;
  } else {
    return true;
  }
}

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
