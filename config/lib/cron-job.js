'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  common = require(path.resolve('./config/lib/common')),
  logger = require('./logger'),
  scoreLib = require(path.resolve('./config/lib/score')),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  CronJob = require('cron').CronJob,
  moment = require('moment'),
  Torrent = mongoose.model('Torrent'),
  User = mongoose.model('User'),
  Peer = mongoose.model('Peer'),
  Complete = mongoose.model('Complete'),
  Message = mongoose.model('Message'),
  MailTicket = mongoose.model('MailTicket'),
  AnnounceLog = mongoose.model('AnnounceLog'),
  UserDaysLog = mongoose.model('UserDaysLog'),
  UserMonthsLog = mongoose.model('UserMonthsLog'),
  ScoreLog = mongoose.model('ScoreLog'),
  Trace = mongoose.model('Trace'),
  Invitation = mongoose.model('Invitation'),
  scoreUpdate = require(path.resolve('./config/lib/score')).update,
  backup = require('mongodb-backup');

var mtDebug = require(path.resolve('./config/lib/debug'));
var appConfig = config.meanTorrentConfig.app;
var supportConfig = config.meanTorrentConfig.support;
var backupConfig = config.meanTorrentConfig.backup;
var announceConfig = config.meanTorrentConfig.announce;
var scoreConfig = config.meanTorrentConfig.score;
var signConfig = config.meanTorrentConfig.sign;
var hnrConfig = config.meanTorrentConfig.hitAndRun;
var messageConfig = config.meanTorrentConfig.messages;
var traceConfig = config.meanTorrentConfig.trace;

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
  cronJobs.push(removeOldServerMessages());
  cronJobs.push(removeOldLogData());
  cronJobs.push(removeExpiredUserInvitations());
  cronJobs.push(checkUserAccountIdleStatus());

  if (hnrConfig.enable) {
    cronJobs.push(countUsersHnrWarning());
  }

  if (scoreConfig.transferToInviter.enable) {
    cronJobs.push(transferUserScoreToInviter());
  }

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
      logger.info(chalk.green('cronJob: process!'));
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
      logger.info(chalk.green('cronJobBackupMongoDB: process!'));

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
    //cronTime: '*/5 * * * * *',
    cronTime: '00 30 */2 * * *',
    onTick: function () {
      logger.info(chalk.green('removeGhostPeers: process!'));

      Peer.find({
        last_announce_at: {$lt: Date.now() - announceConfig.ghostCheck.ghostPeersIdleTime}
      })
        .populate('user')
        .populate('torrent')
        .exec(function (err, peers) {
          if (!err && peers) {
            var count = peers.length;

            peers.forEach(function (p) {
              p.remove();

              p.torrent.update({
                $pull: {_peers: p._id}
              }).exec();

              p.torrent.updateSeedLeechNumbers();
              p.user.updateSeedLeechNumbers();
            });

            logger.info(chalk.green('removed ghost peers: ' + count));
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
 * removeOldServerMessages
 */
function removeOldServerMessages() {
  var cronJob = new CronJob({
    cronTime: '00 05 1 * * *',
    onTick: function () {
      logger.info(chalk.green('removeOldServerMessages: process!'));

      Message.remove({
        type: 'server',
        createdat: {$lt: Date.now() - messageConfig.serverMessageExpires}
      }).exec();
    },
    start: false,
    timeZone: appConfig.cronTimeZone
  });

  cronJob.start();

  return cronJob;
}

/**
 * removeOldLogData
 */
function removeOldLogData() {
  var cronJob = new CronJob({
    cronTime: '00 10 1 * * *',
    onTick: function () {
      logger.info(chalk.green('removeOldLogData: process!'));

      //remove announce-log old data
      AnnounceLog.remove({
        createdAt: {$lt: moment().subtract(announceConfig.announceLogDays, 'days')}
      }, function (err) {
        if (err) {
          logger.error(err);
        }
      });

      //remove user-days-log old data
      UserDaysLog.remove({
        createdAt: {$lt: moment().subtract(announceConfig.userDaysLogDays, 'days')}
      }, function (err) {
        if (err) {
          logger.error(err);
        }
      });

      //remove user-months-log old data
      UserMonthsLog.remove({
        createdAt: {$lt: moment().subtract(announceConfig.userMonthsLogMonths, 'months')}
      }, function (err) {
        if (err) {
          logger.error(err);
        }
      });

      //remove score-log old data
      ScoreLog.remove({
        createdAt: {$lt: moment().subtract(scoreConfig.scoreLogDays, 'days')}
      }, function (err) {
        if (err) {
          logger.error(err);
        }
      });

      //remove trace-log old data
      Trace.remove({
        createdat: {$lt: moment().subtract(traceConfig.traceLogDays, 'days')}
      }, function (err) {
        if (err) {
          logger.error(err);
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
 * removeExpiredUserInvitations
 */
function removeExpiredUserInvitations() {
  var cronJob = new CronJob({
    cronTime: '00 15 1 * * *',
    onTick: function () {
      logger.info(chalk.green('removeExpiredUserInvitations: process!'));

      //remove announce-log old data
      Invitation.remove({
        status: 0,    //include exchange and present invitations, official invitations status start of 1
        expiresat: {$lt: Date.now()}
      }, function (err) {
        if (err) {
          logger.error(err);
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
    cronTime: '00 20 1 * * *',
    // cronTime: '*/30 * * * * *',
    onTick: function () {
      logger.info(chalk.green('checkUserAccountIdleStatus: process!'));

      var safeScore = scoreLib.getScoreByLevel(signConfig.idle.notIdleSafeLevel);

      User.find({
        status: 'normal',
        isVip: false,
        isOper: false,
        isAdmin: false,
        last_signed: {$lt: Date.now() - signConfig.idle.accountIdleForTime},
        score: {$lt: safeScore},
        medal: {$nin: signConfig.idle.unIdleMedalName}
      }).exec(function (err, users) {
        if (users) {
          users.forEach(function (u) {
            u.update({
              $set: {
                status: 'idle',
                last_idled: u.last_signed
              }
            }).exec();
          });
          mtDebug.debugGreen('checkUserAccountIdleStatus: ' + users.length + ' users!');
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
      logger.info(chalk.green('countHnrWarning: process!'));

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
 * transferUserScoreToInviter
 */
function transferUserScoreToInviter() {
  var cronJob = new CronJob({
    cronTime: '00 00 2 1 * *',
    onTick: function () {
      logger.info(chalk.green('transferUserScoreToInviter: process!'));

      var mom = moment().utcOffset(appConfig.dbTimeZone);
      var y = mom.get('year');
      var m = mom.get('month') + 1;

      UserMonthsLog.find({
        year: y,
        month: m - 1
      }).populate({
        path: 'user',
        select: 'username displayName profileImageURL isVip score uploaded downloaded invited_by',
        populate: {
          path: 'invited_by',
          select: 'username displayName profileImageURL isVip score uploaded downloaded'
        }
      }).exec(function (err, logs) {
        if (logs) {
          logs.forEach(function (l) {
            if (l.score > 0 && l.user.invited_by) {
              var transValue = Math.round(l.score * scoreConfig.transferToInviter.transRatio * 100) / 100;

              if (transValue > 0) {
                if (scoreConfig.transferToInviter.deductFromUser) {
                  var actFrom = scoreConfig.action.transferScoreIntoInviterFrom;
                  actFrom.params = {
                    uid: l.user.invited_by._id,
                    uname: l.user.invited_by.displayName
                  };
                  scoreUpdate(undefined, l.user, actFrom, -(transValue));
                }

                var actTo = scoreConfig.action.transferScoreIntoInviterTo;
                actTo.params = {
                  uid: l.user._id,
                  uname: l.user.displayName
                };
                scoreUpdate(undefined, l.user.invited_by, actTo, transValue);
              }
            }
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
      logger.info(chalk.green('listenServiceEmail: process!'));
      // logger.info(chalk.green(listenServiceEmailJob.running));

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
          logger.info(chalk.green('CONNECT to ' + config.mailer.options.auth.user + ' successfully!'));
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
          logger.info('DISCONNECTED from ' + config.mailer.options.auth.user);
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
        logger.info(chalk.blue('Check-out ' + (isNew ? 'new' : 'unseen') + ' email from ' + config.mailer.options.auth.user));
        // logger.info(mail_object);

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
                  logger.info('From: ', mail_object.from.text);
                  logger.info('MessageId: ', mail_object.messageId);
                  logger.info('References: ', mail_object.references ? mail_object.references[0] : 'origin');
                  logger.info('Subject: ', mail_object.subject);
                  // logger.info('Text body:', mail_object.text);
                  // logger.info('Add flag: ', flags);
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
              logger.info('From: ', mail_object.from.text);
              logger.info('MessageId: ', mail_object.messageId);
              logger.info('References: ', mail_object.references ? mail_object.references[0] : 'origin');
              logger.info('Subject: ', mail_object.subject);
              // logger.info('Text body:', mail_object.text);
              // logger.info('Add flag: ', flags);
            }
          });
        }
      });
    });
  }
}
