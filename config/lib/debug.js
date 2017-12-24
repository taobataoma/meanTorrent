'use strict';

var path = require('path'),
  chalk = require('chalk'),
  moment = require('moment'),
  config = require(path.resolve('./config/config'));

var appConfig = config.meanTorrentConfig.app;

/**
 * debug
 * @param obj
 * @param section
 */
module.exports.info = function (obj, section) {
  if (appConfig.showDebugLog) {
    if (section) {
      console.log(section);
    }
    console.log(obj);
  }
};

/**
 * debug
 * @param obj
 * @param section
 */
module.exports.debug = function (obj, section) {
  if (appConfig.showDebugLog) {
    console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : ''));
    console.log(obj);
  }
};

/**
 * debugGreen
 * @param obj
 * @param section
 */
module.exports.debugGreen = function (obj, section) {
  if (appConfig.showDebugLog) {
    console.log(chalk.green('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '')));
    if (typeof obj === 'string') {
      console.log(chalk.green(obj));
    } else {
      console.log(obj);
    }
  }
};

/**
 * debugRed
 * @param obj
 * @param section
 */
module.exports.debugRed = function (obj, section) {
  if (appConfig.showDebugLog) {
    console.log(chalk.red('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '')));
    if (typeof obj === 'string') {
      console.log(chalk.red(obj));
    } else {
      console.log(obj);
    }
  }
};
module.exports.debugError = function (obj, section) {
  this.debugRed(obj, section);
};

/**
 * debugBlue
 * @param obj
 * @param section
 */
module.exports.debugBlue = function (obj, section) {
  if (appConfig.showDebugLog) {
    console.log(chalk.blue('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '')));
    if (typeof obj === 'string') {
      console.log(chalk.blue(obj));
    } else {
      console.log(obj);
    }
  }
};

/**
 * debugYellow
 * @param obj
 * @param section
 */
module.exports.debugYellow = function (obj, section) {
  if (appConfig.showDebugLog) {
    console.log(chalk.yellow('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']' + (section ? ' - ' + section : '')));
    if (typeof obj === 'string') {
      console.log(chalk.yellow(obj));
    } else {
      console.log(obj);
    }
  }
};

