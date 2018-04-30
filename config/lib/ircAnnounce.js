'use strict';

// Load the module dependencies
var config = require('../config'),
  logger = require('./logger'),
  chalk = require('chalk'),
  path = require('path'),
  irc = require('irc'),
  moment = require('moment'),
  ircConfig = config.meanTorrentConfig.ircAnnounce;

// Define the ircAnnounce method
module.exports = function (app) {
  var client = new irc.Client(ircConfig.server, ircConfig.nick, {
    userName: ircConfig.userName,
    realName: ircConfig.realName,
    port: ircConfig.port,
    channels: [ircConfig.channel],
    debug: ircConfig.debug,
    showErrors: ircConfig.showErrors,
    autoRejoin: ircConfig.autoRejoin,
    autoConnect: ircConfig.autoConnect,
    retryCount: ircConfig.retryCount,
    retryDelay: ircConfig.retryDelay,
    encoding: ircConfig.enable
  });

  client.addListener('error', function (message) {
    logger.info(chalk.red('IRC error: ' + message));
  });

  client.addListener('registered', function (message) {
    logger.info(chalk.green('IRC: connected successfully!'));
  });

  client.addListener('join' + ircConfig.channel, function (nick, message) {
    if (nick === client.nick)
      logger.info(chalk.green('IRC: join channel ' + ircConfig.channel + ' successfully!'));
  });

  return client;
};
