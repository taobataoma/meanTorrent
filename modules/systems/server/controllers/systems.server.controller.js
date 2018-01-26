'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  shell = require('shelljs'),
  moment = require('moment'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create,
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var traceConfig = config.meanTorrentConfig.trace;
var appConfig = config.meanTorrentConfig.app;
var mtDebug = require(path.resolve('./config/lib/debug'));
var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;

/**
 * getSystemConfig
 * @param req
 * @param res
 */
exports.getSystemConfig = function (req, res) {
  var config = shell.cat(path.resolve('./config/env/torrents.js'));

  if (req.user.isAdmin) {
    res.json({
      configContent: config
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * setSystemConfig
 * @param req
 * @param res
 */
exports.setSystemConfig = function (req, res) {
  // eslint-disable-next-line new-cap
  var cc = shell.ShellString(req.body.content);

  if (req.user.isAdmin) {
    cc.to('./config/env/torrents.js');
    res.json({
      message: 'SERVER.TORRENT_CONFIG_SAVE_SUCCESSFULLY'
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};
