'use strict';

var path = require('path'),
  chalk = require('chalk'),
  moment = require('moment'),
  config = require(path.resolve('./config/config'));

var appConfig = config.meanTorrentConfig.app;

/**
 * debug
 * @param obj
 */
module.exports.debug = function (obj) {
  if (appConfig.showDebugLog) {
    console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']');
    console.log(obj);
  }
};

/**
 * debugGreen
 * @param obj
 */
module.exports.debugGreen = function (obj) {
  if (appConfig.showDebugLog) {
    console.log(chalk.green('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']'));
    console.log(obj);
  }
};

/**
 * debugRed
 * @param obj
 */
module.exports.debugRed = function (obj) {
  if (appConfig.showDebugLog) {
    console.log(chalk.red('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']'));
    console.log(obj);
  }
};
module.exports.debugError = function (obj) {
  this.debugRed(obj);
};

/**
 * debugBlue
 * @param obj
 */
module.exports.debugBlue = function (obj) {
  if (appConfig.showDebugLog) {
    console.log(chalk.blue('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']'));
    console.log(obj);
  }
};

/**
 * debugYellow
 * @param obj
 */
module.exports.debugYellow = function (obj) {
  if (appConfig.showDebugLog) {
    console.log(chalk.yellow('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']'));
    console.log(obj);
  }
};

