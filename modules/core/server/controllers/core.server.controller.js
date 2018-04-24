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
    req.user.curr_signed_ip = req.cf_ip;
    req.user.addSignedIp(req.cf_ip);
  }

  var cfg = getSafeMeanTorrentConfig(req, config.meanTorrentConfig);

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

  var cfg = getSafeMeanTorrentConfig(req, config.meanTorrentConfig);

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

  var cfg = getSafeMeanTorrentConfig(req, config.meanTorrentConfig);

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
 * @param req
 * @param cfg
 * @returns {*}
 */
function getSafeMeanTorrentConfig(req, cfg) {
  var newCfg = _.cloneDeep(cfg);

  //ignore backup settings
  newCfg.backup = undefined;

  //ignore tmdbConfig.key settings
  newCfg.tmdbConfig.key = undefined;

  //ignore trace config settings
  newCfg.trace = undefined;

  //ignore serverNotice settings
  newCfg.serverNotice = undefined;

  //ignore adminAccess config items for normal users
  if (req.user && !req.user.isOper) {
    newCfg.access.admin = undefined;
  }

  return newCfg;
}
