'use strict';

var validator = require('validator'),
  path = require('path'),
  moment = require('moment'),
  config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = req.user || null;
  if (req.user) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.user.addSignedIp(ip);
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared),
    meanTorrentConfig: JSON.stringify(config.meanTorrentConfig)
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  var safeUserObject = req.user || null;

  res.status(500).render('modules/core/server/views/500', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared),
    meanTorrentConfig: JSON.stringify(config.meanTorrentConfig),
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {
  var safeUserObject = req.user || null;

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        user: JSON.stringify(safeUserObject),
        sharedConfig: JSON.stringify(config.shared),
        meanTorrentConfig: JSON.stringify(config.meanTorrentConfig),
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
