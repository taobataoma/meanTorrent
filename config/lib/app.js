'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('mongoose'),
  mongooseService = require('./mongoose'),
  express = require('./express'),
  logger = require('./logger'),
  chalk = require('chalk'),
  seed = require('./mongo-seed'),
  ircConfig = config.meanTorrentConfig.ircAnnounce;

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

module.exports.init = function init(callback) {
  mongooseService.connect(function (mongooseConn) {
    // Initialize Models
    mongooseService.loadModels(seedDB);

    // Initialize express
    var app = express.init(mongooseConn);
    if (callback) callback(app, mongooseConn, config);

  });
};

module.exports.setDecimal128Prototype = function () {
  mongoose.Types.Decimal128.prototype.toJSON = function () {
    return parseFloat(this.valueOf());
  };
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, mongooseConn, config) {

    _this.setDecimal128Prototype();
    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      logger.info('--');
      logger.info(chalk.green(config.app.title));
      logger.info();
      logger.info(chalk.green('Environment:     ' + process.env.NODE_ENV));
      logger.info(chalk.green('Server:          ' + server));
      logger.info(chalk.green('Database:        ' + config.db.uri));
      logger.info(chalk.green('App version:     ' + config.meanjs.version));
      if (config.meanjs['meanjs-version'])
        logger.info(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version']));
      if (ircConfig.enable)
        logger.info(chalk.green('IRC announce:    ' + ircConfig.server + ':' + ircConfig.port + ' ' + ircConfig.channel));
      else
        console.log(chalk.green('IRC announce:    disabled'));
      logger.info('--');

      if (callback) callback(app, mongooseConn, config);
    });

  });

};
