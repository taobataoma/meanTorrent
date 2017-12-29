'use strict';

var path = require('path'),
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

  var cfg = setMeanTorrentConfigDefaultValue(req, res, config.meanTorrentConfig);
  cfg = getSafeMeanTorrentConfig(cfg);

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

  var cfg = setMeanTorrentConfigDefaultValue(req, res, config.meanTorrentConfig);
  cfg = getSafeMeanTorrentConfig(cfg);

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

  var cfg = setMeanTorrentConfigDefaultValue(req, res, config.meanTorrentConfig);
  cfg = getSafeMeanTorrentConfig(cfg);

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
  //ignore backup settings
  cfg.backup = undefined;

  //ignore ircAnnounce settings
  cfg.ircAnnounce = undefined;

  //ignore password settings
  cfg.password = undefined;

  //ignore trace settings
  cfg.trace = undefined;

  //ignore tmdbConfig.key settings
  cfg.tmdbConfig.key = undefined;

  //ignore trace config settings
  cfg.trace = undefined;

  //ignore serverNotice settings
  cfg.serverNotice = undefined;

  return cfg;
}

/**
 * setMeanTorrentConfigDefaultValue
 * @param cfg
 */
function setMeanTorrentConfigDefaultValue(req, res, cfg) {
  var httpTransport = 'http://';
  if (config.secure && config.secure.ssl === true) {
    httpTransport = 'https://';
  }
  var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;

  cfg.app.domain = baseUrl;
  if (!cfg.announce.abs) {
    cfg.announce.abs = cfg.announce.url;
  }
  cfg.announce.url = baseUrl + cfg.announce.abs;

  return cfg;
}
