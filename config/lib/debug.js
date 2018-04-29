'use strict';

var path = require('path'),
  chalk = require('chalk'),
  logger = require('./logger'),
  loggerAnnounce = require('./loggerAnnounce'),
  moment = require('moment'),
  config = require(path.resolve('./config/config'));

var appConfig = config.meanTorrentConfig.app;

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
module.exports.info = function (obj, section = undefined, colorFunction = undefined, isAnnounce = false) {
  if (appConfig.showDebugLog) {
    var tools = isAnnounce ? loggerAnnounce : logger;

    if (!colorFunction) {
      if (Array.isArray(obj)) {
        tools.info('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : ''));
        obj.forEach(function (a) {
          if (typeof a !== 'object') {
            tools.info(a + '');
          } else {
            tools.info(JSON.stringify(a));
          }
        });
      } else if (typeof obj !== 'object') {
        tools.info('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '') + ' - ' + obj);
      } else {
        tools.info('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : ''));
        tools.info(JSON.stringify(obj));
      }
    } else {
      if (Array.isArray(obj)) {
        tools.info(colorFunction('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '')));
        obj.forEach(function (a) {
          if (typeof a !== 'object') {
            tools.info(a + '');
          } else {
            tools.info(JSON.stringify(a));
          }
        });
      } else if (typeof obj !== 'object') {
        tools.info(colorFunction('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '') + ' - ' + obj));
      } else {
        tools.info(colorFunction('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '')));
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
module.exports.debug = function (obj, section = undefined, isAnnounce = false) {
  this.info(obj, section, undefined, isAnnounce);
};

/**
 * debugGreen
 * @param obj
 * @param section
 */
module.exports.debugGreen = function (obj, section = undefined, isAnnounce = false) {
  this.info(obj, section, this.colorFunctionList.green, isAnnounce);

};

/**
 * debugRed
 * @param obj
 * @param section
 */
module.exports.debugRed = function (obj, section = undefined, isAnnounce = false) {
  this.info(obj, section, this.colorFunctionList.red, isAnnounce);
};

/**
 * debugError
 * @param obj
 * @param section
 */
module.exports.debugError = function (obj, section = undefined, isAnnounce = false) {
  this.info(obj, section, this.colorFunctionList.error, isAnnounce);
};

/**
 * debugBlue
 * @param obj
 * @param section
 */
module.exports.debugBlue = function (obj, section = undefined, isAnnounce = false) {
  this.info(obj, section, this.colorFunctionList.blue, isAnnounce);

};

/**
 * debugYellow
 * @param obj
 * @param section
 */
module.exports.debugYellow = function (obj, section = undefined, isAnnounce = false) {
  this.info(obj, section, this.colorFunctionList.yellow, isAnnounce);
};

