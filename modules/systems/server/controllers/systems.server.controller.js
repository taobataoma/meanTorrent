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
  res.json({
    configContent: config
  });
};
