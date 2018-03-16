'use strict';

var path = require('path'),
  _ = require('lodash'),
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

  var cfg = getSafeMeanTorrentConfig(config.meanTorrentConfig);

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared),
    meanTorrentConfig: JSON.stringify(cfg)
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  var safeUserObject = req.user || null;

  var cfg = getSafeMeanTorrentConfig(config.meanTorrentConfig);

  res.status(500).render('modules/core/server/views/500', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared),
    meanTorrentConfig: JSON.stringify(cfg),
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {
  var safeUserObject = req.user || null;

  var cfg = getSafeMeanTorrentConfig(config.meanTorrentConfig);

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        user: JSON.stringify(safeUserObject),
        sharedConfig: JSON.stringify(config.shared),
        meanTorrentConfig: JSON.stringify(cfg),
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

/**
 * getSafeMeanTorrentConfig
 * @param cfg
 * @returns {*}
 */
function getSafeMeanTorrentConfig(cfg) {
  var newCfg = _.cloneDeep(cfg);

  //ignore backup settings
  newCfg.backup = undefined;

  //ignore ircAnnounce settings
  newCfg.ircAnnounce = undefined;

  //ignore password settings
  newCfg.password = undefined;

  //ignore trace settings
  newCfg.trace = undefined;

  //ignore tmdbConfig.key settings
  newCfg.tmdbConfig.key = undefined;

  //ignore trace config settings
  newCfg.trace = undefined;

  //ignore serverNotice settings
  newCfg.serverNotice = undefined;

  return newCfg;
}
