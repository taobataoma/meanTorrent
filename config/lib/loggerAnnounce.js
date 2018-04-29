'use strict';

var _ = require('lodash'),
  config = require('../config'),
  chalk = require('chalk'),
  fs = require('fs'),
  winston = require('winston');

// list of valid formats for the logging
var validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];

// Instantiating the default winston application logger with the Console
// transport
var loggerAnnounce = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
});

// A stream object with a write function that will call the built-in winston
// logger.info() function.
// Useful for integrating with stream-related mechanism like Morgan's stream
// option to log all HTTP requests to a file
loggerAnnounce.stream = {
  write: function (msg) {
    loggerAnnounce.info(msg);
  }
};

/**
 * Instantiate a winston's File transport for disk file logging
 *
 */
loggerAnnounce.setupFileLogger = function setupFileLogger() {

  var fileLoggerTransport = this.getLogOptions();
  if (!fileLoggerTransport) {
    return false;
  }

  try {
    // Check first if the configured path is writable and only then
    // instantiate the file logging transport
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
      loggerAnnounce.add(winston.transports.File, fileLoggerTransport);
    }

    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.red('An error has occured during the creation of the File transport logger.'));
      console.log(chalk.red(err));
      console.log();
    }

    return false;
  }

};

/**
 * The options to use with winston logger
 *
 * Returns a Winston object for logging with the File transport
 */
loggerAnnounce.getLogOptions = function getLogOptions() {

  var _config = _.clone(config, true);
  var configFileLogger = _config.logAnnounce.fileLogger;

  if (!_.has(_config, 'logAnnounce.fileLogger.directoryPath') || !_.has(_config, 'logAnnounce.fileLogger.fileName')) {
    console.log('unable to find logging file configuration');
    return false;
  }

  var logDir = configFileLogger.directoryPath + '/logs/';
  var logPath = logDir + configFileLogger.fileName;

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  return {
    level: 'debug',
    colorize: false,
    filename: logPath,
    timestamp: true,
    maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
    maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
    json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
    eol: '\n',
    tailable: true,
    showLevel: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  };
};

/**
 * The options to use with morgan logger
 *
 * Returns a logAnnounce.options object with a writable stream based on winston
 * file logging transport (if available)
 */
loggerAnnounce.getMorganOptions = function getMorganOptions() {

  return {
    stream: loggerAnnounce.stream
  };

};

/**
 * The format to use with the logger
 *
 * Returns the logAnnounce.format option set in the current environment configuration
 */
loggerAnnounce.getLogFormat = function getLogFormat() {
  var format = config.logAnnounce && config.logAnnounce.format ? config.logAnnounce.format.toString() : 'combined';

  // make sure we have a valid format
  if (!_.includes(validFormats, format)) {
    format = 'combined';

    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.yellow('Warning: An invalid format was provided. The logger will use the default format of "' + format + '"'));
      console.log();
    }
  }

  return format;
};

loggerAnnounce.setupFileLogger();

module.exports = loggerAnnounce;
