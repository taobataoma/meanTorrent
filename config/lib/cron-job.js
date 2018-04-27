'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  common = require(path.resolve('./config/lib/common')),
  scoreLib = require(path.resolve('./config/lib/score')),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  CronJob = require('cron').CronJob,
  moment = require('moment'),
  Torrent = mongoose.model('Torrent'),
  User = mongoose.model('User'),
  Peer = mongoose.model('Peer'),
  Complete = mongoose.model('Complete'),
  MailTicket = mongoose.model('MailTicket'),
  backup = require('mongodb-backup');

var mtDebug = require(path.resolve('./config/lib/debug'));
var appConfig = config.meanTorrentConfig.app;
var supportConfig = config.meanTorrentConfig.support;
var backupConfig = config.meanTorrentConfig.backup;
var announceConfig = config.meanTorrentConfig.announce;
var signConfig = config.meanTorrentConfig.sign;
var inbox = require('inbox');
var simpleParser = require('mailparser').simpleParser;

const PEERSTATE_SEEDER = 'seeder';
const PEERSTATE_LEECHER = 'leecher';

/**
 * cron params of time
 *
 * Seconds: 0-59
 * Minutes: 0-59
 * Hours: 0-23
 * Day of Month: 1-31
 * Months: 0-11
 * Day of Week: 0-6
 *
 *
 * CronJob
 *
 * constructor(cronTime, onTick, onComplete, start, timezone, context, runOnInit) - Of note, the first parameter here can be a JSON object that has
 * the below names and associated types (see examples above).
 *    cronTime - [REQUIRED] - The time to fire off your job. This can be in the form of cron syntax or a JS Date object.
 *    onTick - [REQUIRED] - The function to fire at the specified time.
 *    onComplete - [OPTIONAL] - A function that will fire when the job is complete, when it is stopped.
 *    start - [OPTIONAL] - Specifies whether to start the job just before exiting the constructor. By default this is set to false. If left at
 *            default you will need to call job.start() in order to start the job (assuming job is the variable you set the cronjob to). This does
 *            not immediately fire your onTick function, it just gives you more control over the behavior of your jobs.
 *    timeZone - [OPTIONAL] - Specify the timezone for the execution. This will modify the actual time relative to your timezone. If the timezone is
 *                invalid, an error is thrown.
 *    context - [OPTIONAL] - The context within which to execute the onTick method. This defaults to the cronjob itself allowing you to call this.stop().
 *              However, if you change this you'll have access to the functions and values within your context object.
 *    runOnInit - [OPTIONAL] - This will immediately fire your onTick function as soon as the requisit initialization has happened. This option is
 *                set to false by default for backwards compatibility.
 * start - Runs your job.
 * stop - Stops your job.
 *
 * @param app
 */
module.exports = function (app) {
  var cronJobs = [];

  cronJobs.push(cronJobHnR());

  if (backupConfig.enable) {
    cronJobs.push(cronJobBackupMongoDB());
  }

  cronJobs.push(removeGhostPeers());
  cronJobs.push(checkUserAccountIdleStatus());
  cronJobs.push(countUsersHnrWarning());

  if (supportConfig.mailTicketSupportService) {
    cronJobs.push(listenServiceEmail());
  }

  return cronJobs;
};

/**
 * cronJobHnR
 */
function cronJobHnR() {
  var cronJob = new CronJob({
    //cronTime: '00 00 1 * * *',
    //cronTime: '*/5 * * * * *',
    cronTime: '00 00 * * * *',
    onTick: function () {
      console.log(chalk.green('cronJob: process!'));
    },
    start: false,
    timeZone: appConfig.cronTimeZone
  });

  cronJob.start();

  return cronJob;
}

/**
 * cronJobBackupMongoDB
 */
function cronJobBackupMongoDB() {
  var cronJob = new CronJob({
    cronTime: '00 00 1 * * *',
    //cronTime: '*/5 * * * * *',
    //cronTime: '00 00 * * * *',
    onTick: function () {
      console.log(chalk.green('cronJobBackupMongoDB: process!'));

      backup({
        uri: config.db.uri,
        options: config.db.options || {},
        root: backupConfig.dir,
        parser: 'json',
        tar: appConfig.name + '-backup-mongodb-' + moment().format('YYYYMMDD-HHmmss') + '.tar'
      });
    },
    start: false,
    timeZone: appConfig.cronTimeZone
  });

  cronJob.start();

  return cronJob;
}

/**
 * removeGhostPeers
 */
function removeGhostPeers() {
  var cronJob = new CronJob({
    cronTime: '00 05 1 * * *',
    //cronTime: '*/5 * * * * *',
    onTick: function () {
      console.log(chalk.green('removeGhostPeers: process!'));

      Peer.find({
        last_announce_at: {$lt: Date.now() - announceConfig.ghostCheck.ghostPeersIdleTime}
      })
        .populate('user')
        .populate('torrent')
        .exec(function (err, peers) {
          if (!err && peers) {
            var count = peers.length;

            peers.forEach(function (p) {
              if (p.peer_status === PEERSTATE_LEECHER) {
                p.torrent.update({
                  $inc: {torrent_leechers: -1}
                }).exec();
                p.user.update({
                  $inc: {leeched: -1}
                }).exec();
              } else if (p.peer_status === PEERSTATE_SEEDER) {
                p.torrent.update({
                  $inc: {torrent_seeds: -1}
                }).exec();
                p.user.update({
                  $inc: {seeded: -1}
                }).exec();
              }

              p.torrent.update({
                $pull: {_peers: p._id}
              }).exec();

              p.remove();
            });

            console.log(chalk.green('removed ghost peers: ' + count));
          }
        });
    },
    start: false,
    timeZone: appConfig.cronTimeZone
  });

  cronJob.start();

  return cronJob;
}

/**
 * checkUserAccountIdleStatus
 */
function checkUserAccountIdleStatus() {
  var cronJob = new CronJob({
    cronTime: '00 10 1 * * *',
    // cronTime: '*/5 * * * * *',
    onTick: function () {
      console.log(chalk.green('checkUserAccountIdleStatus: process!'));

      var safeScore = scoreLib.getScoreByLevel(signConfig.idle.notIdleSafeLevel);

      User.update(
        {
          status: {$ne: 'idle'},
          last_signed: {$lt: Date.now() - signConfig.idle.accountIdleForTime},
          score: {$lt: safeScore}
        },
        {
          $set: {
            status: 'idle'
          }
        },
        {
          multi: true
        }, function (err, numAffected) {
          if (err) {
            mtDebug.debugError(err);
          } else {
            mtDebug.debugGreen('checkUserAccountIdleStatus: ' + numAffected.nModified + ' users!');
          }
        });
    },
    start: false,
    timeZone: appConfig.cronTimeZone
  });

  cronJob.start();

  return cronJob;
}

/**
 * countUsersHnrWarning
 */
function countUsersHnrWarning() {
  var hours = announceConfig.warningCheck.userHnrWarningCheckInterval / (60 * 60 * 1000);
  var cronJob = new CronJob({
    cronTime: '00 00 */' + hours + ' * * *',
    //cronTime: '*/5 * * * * *',
    onTick: function () {
      console.log(chalk.green('countHnrWarning: process!'));

      Complete.find({
        complete: true,
        hnr_warning: false,
        refreshat: {$lt: Date.now() - announceConfig.warningCheck.userHnrWarningCheckInterval}
      })
        .populate('user')
        .exec(function (err, comps) {
          if (!err && comps) {
            comps.forEach(function (c) {
              c.countHnRWarning(true, false);
            });
          }
        });
    },
    start: false,
    timeZone: appConfig.cronTimeZone
  });

  cronJob.start();

  return cronJob;
}

/**
 * listenServiceEmail
 */
function listenServiceEmail() {
  var listenServiceEmailJob = new CronJob({
    //cronTime: '00 00 1 * * *',
    // cronTime: '*/10 * * * * *',
    cronTime: '00 00 * * * *',
    onTick: function () {
      // console.log(chalk.green('listenServiceEmail: process!'));
      // console.log(chalk.green(listenServiceEmailJob.running));

      if (!listenServiceEmailJob.listeningServiceEmail) {
        var client = inbox.createConnection(false, config.mailer.options.imap, {
          secureConnection: true,
          auth: {
            user: config.mailer.options.auth.user,
            pass: config.mailer.options.auth.pass
          }
        });

        /**
         * on connect
         */
        client.on('connect', function () {
          console.log(chalk.green('CONNECT to ' + config.mailer.options.auth.user + ' successfully!'));
          listenServiceEmailJob.listeningServiceEmail = true;
          client.openMailbox('INBOX', false, function (error, info) {
            if (error) throw error;

            client.listMessages(-20, function (err, messages) {
              messages.forEach(function (message) {
                if (message.flags.indexOf('\\Seen') < 0) {
                  addNewMessageToTicket(client, message, false);
                }
              });
            });
          });
        });

        /**
         * on close
         */
        client.on('close', function () {
          listenServiceEmailJob.listeningServiceEmail = false;
          console.log('DISCONNECTED from ' + config.mailer.options.auth.user);
        });

        /**
         * on new
         */
        client.on('new', function (message) {
          addNewMessageToTicket(client, message);
        });

        client.connect();
      }
    },
    start: false,
    timeZone: appConfig.cronTimeZone
  });

  listenServiceEmailJob.listeningServiceEmail = false;
  listenServiceEmailJob.fireOnTick();
  listenServiceEmailJob.start();

  return listenServiceEmailJob;

  function addNewMessageToTicket(client, message, isNew = true) {
    simpleParser(client.createMessageStream(message.UID), function (err, mail_object) {
      client.addFlags(message.UID, ['\\Seen'], function (err, flags) {
        console.log(chalk.blue('Check-out ' + (isNew ? 'new' : 'unseen') + ' email from ' + config.mailer.options.auth.user));
        // console.log(mail_object);

        // write unseen/new message into mail-tickets db table
        if (mail_object.references) { //reply message
          MailTicket.findOne({
            messageId: mail_object.references[0]
          }, function (err, m) {
            if (!err && m) {
              var subTicket = new MailTicket();
              subTicket.messageId = mail_object.messageId;
              subTicket.from = mail_object.from.text;
              subTicket.to = config.mailer.options.auth.user;
              subTicket.title = mail_object.subject || 'Null title';
              subTicket.content = mail_object.text || 'Null content';

              m._replies.push(subTicket);
              m.save(function (err) {
                if (err) {
                  mtDebug.debugError('write reply mail ticket info db failed!');
                } else {
                  console.log('From: ', mail_object.from.text);
                  console.log('MessageId: ', mail_object.messageId);
                  console.log('References: ', mail_object.references ? mail_object.references[0] : 'origin');
                  console.log('Subject: ', mail_object.subject);
                  // console.log('Text body:', mail_object.text);
                  // console.log('Add flag: ', flags);
                }
              });
            }
          });
        } else {                      //new message
          var newTicket = new MailTicket();
          newTicket.messageId = mail_object.messageId;
          newTicket.from = mail_object.from.text;
          newTicket.to = config.mailer.options.auth.user;
          newTicket.title = mail_object.subject || 'Null title';
          newTicket.content = mail_object.text || 'Null content';

          newTicket.save(function (err) {
            if (err) {
              mtDebug.debugError('write new mail ticket info db failed!');
            } else {
              console.log('From: ', mail_object.from.text);
              console.log('MessageId: ', mail_object.messageId);
              console.log('References: ', mail_object.references ? mail_object.references[0] : 'origin');
              console.log('Subject: ', mail_object.subject);
              // console.log('Text body:', mail_object.text);
              // console.log('Add flag: ', flags);
            }
          });
        }
      });
    });
  }
}
