'use strict';

var path = require('path'),
  chalk = require('chalk'),
  logger = require('./logger'),
  loggerAnnounce = require('./loggerAnnounce'),
  moment = require('moment'),
  config = require(path.resolve('./config/config'));

var appConfig = config.meanTorrentConfig.app;
var announceConfig = config.meanTorrentConfig.announce;

module.exports.colorFunctionList = {
  red: chalk.red,
  error: chalk.red,
  blue: chalk.blue,
  yellow: chalk.yellow,
  green: chalk.green
};

/**
 * debug
 * @param obj
 * @param section
 */
module.exports.info = function (obj, section = undefined, colorFunction = undefined, isAnnounce = false, user = undefined) {
  if (appConfig.writeServerDebugLog) {
    var tools = isAnnounce ? loggerAnnounce : logger;

    var userPrefix = '';
    if (isAnnounce && !announceConfig.debugAnnounceUser.debugAll) {
      if (user) {
        if (!announceConfig.debugAnnounceUser.ids.includes(user._id.toString())) {
          return;
        } else {
          userPrefix = ' - ' + user.displayName + ' - ' + user._id.toString();
        }
      }
    }

    if (!colorFunction) {
      if (Array.isArray(obj)) {
        tools.info((section ? ' - ' + section : '') + userPrefix);
        obj.forEach(function (a) {
          if (typeof a !== 'object') {
            tools.info(a + '');
          } else {
            tools.info(JSON.stringify(a));
          }
        });
      } else if (typeof obj !== 'object') {
        tools.info((section ? ' - ' + section : '') + userPrefix + ' - ' + obj);
      } else {
        tools.info((section ? ' - ' + section : '') + userPrefix);
        tools.info(JSON.stringify(obj));
      }
    } else {
      if (Array.isArray(obj)) {
        tools.info(colorFunction((section ? ' - ' + section : '') + userPrefix));
        obj.forEach(function (a) {
          if (typeof a !== 'object') {
            tools.info(a + '');
          } else {
            tools.info(JSON.stringify(a));
          }
        });
      } else if (typeof obj !== 'object') {
        tools.info(colorFunction((section ? ' - ' + section : '') + userPrefix + ' - ' + obj));
      } else {
        tools.info(colorFunction((section ? ' - ' + section : '') + userPrefix));
        tools.info(JSON.stringify(obj));
      }
    }
  }
};

/**
 * debug
 * @param obj
 * @param section
 */
module.exports.debug = function (obj, section = undefined, isAnnounce = false, user = undefined) {
  this.info(obj, section, undefined, isAnnounce, user);
};

/**
 * debugGreen
 * @param obj
 * @param section
 */
module.exports.debugGreen = function (obj, section = undefined, isAnnounce = false, user = undefined) {
  this.info(obj, section, this.colorFunctionList.green, isAnnounce, user);

};

/**
 * debugRed
 * @param obj
 * @param section
 */
module.exports.debugRed = function (obj, section = undefined, isAnnounce = false, user = undefined) {
  this.info(obj, section, this.colorFunctionList.red, isAnnounce, user);
};

/**
 * debugError
 * @param obj
 * @param section
 */
module.exports.debugError = function (obj, section = undefined, isAnnounce = false, user = undefined) {
  this.info(obj, section, this.colorFunctionList.error, isAnnounce, user);
};

/**
 * debugBlue
 * @param obj
 * @param section
 */
module.exports.debugBlue = function (obj, section = undefined, isAnnounce = false, user = undefined) {
  this.info(obj, section, this.colorFunctionList.blue, isAnnounce, user);

};

/**
 * debugYellow
 * @param obj
 * @param section
 */
module.exports.debugYellow = function (obj, section = undefined, isAnnounce = false, user = undefined) {
  this.info(obj, section, this.colorFunctionList.yellow, isAnnounce, user);
};

