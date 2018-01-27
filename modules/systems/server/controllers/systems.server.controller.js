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
 * getSystemEnvConfigFiles
 * @param req
 * @param res
 */
exports.getSystemEnvConfigFiles = function (req, res) {
  var files = shell.ls('./config/env/*.js');

  if (req.user.isAdmin) {
    res.json({
      files: files
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * getSystemAssetsConfigFiles
 * @param req
 * @param res
 */
exports.getSystemAssetsConfigFiles = function (req, res) {
  var files = shell.ls('./config/assets/*.js');

  if (req.user.isAdmin) {
    res.json({
      files: files
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * getSystemTransConfigFiles
 * @param req
 * @param res
 */
exports.getSystemTransConfigFiles = function (req, res) {
  var files = shell.ls('./modules/core/client/app/trans*.js');

  if (req.user.isAdmin) {
    res.json({
      files: files
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * getSystemTemplateConfigFiles
 * @param req
 * @param res
 */
exports.getSystemTemplateConfigFiles = function (req, res) {
  var files = shell.ls('./modules/*/client/templates/*.md');

  if (req.user.isAdmin) {
    res.json({
      files: files
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * getSystemConfigContent
 * @param req
 * @param res
 */
exports.getSystemConfigContent = function (req, res) {
  var config = shell.cat(path.resolve(req.query.filename));

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
 * setSystemConfigContent
 * @param req
 * @param res
 */
exports.setSystemConfigContent = function (req, res) {
  // eslint-disable-next-line new-cap
  var cc = shell.ShellString(req.body.content);

  if (req.user.isAdmin) {
    cc.to(path.resolve(req.body.filename));
    res.json({
      message: 'SERVER.SYSTEM_CONFIG_SAVE_SUCCESSFULLY'
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};
