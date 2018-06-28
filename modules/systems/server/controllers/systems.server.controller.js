'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  common = require(path.resolve('./config/lib/common')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  User = mongoose.model('User'),
  shell = require('shelljs'),
  async = require('async'),
  history = require(path.resolve('./config/lib/history')),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;
var mtDebug = require(path.resolve('./config/lib/debug'));
var announceConfig = config.meanTorrentConfig.announce;
var historyConfig = config.meanTorrentConfig.history;
var inviteConfig = config.meanTorrentConfig.invite;
var examinationConfig = config.meanTorrentConfig.examination;

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
 * getSystemTemplateFrontConfigFiles
 * @param req
 * @param res
 */
exports.getSystemTemplateFrontConfigFiles = function (req, res) {
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
 * getSystemTemplateBackConfigFiles
 * @param req
 * @param res
 */
exports.getSystemTemplateBackConfigFiles = function (req, res) {
  var files = shell.ls('./modules/*/server/templates/*');

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

/**
 * shellCommand
 * @param req
 * @param res
 */
exports.shellCommand = function (req, res) {
  if (req.user.isAdmin) {
    shell.exec(req.body.command, function (code, stdout, stderr) {
      res.json({
        code: code,
        stdout: stdout,
        stderr: stderr
      });
    });
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * initExaminationData
 * @param req
 * @param res
 */
exports.initExaminationData = function (req, res) {
  if (req.user.isAdmin) {
    var exami = {
      uploaded: 0,
      downloaded: 0,
      score: 0,
      isFinished: false,
      finishedTime: null
    };

    User.update({}, {examinationData: undefined}, {multi: true},
      function (err, num) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          User.update(
            {
              created: {
                $lt: Date.now() - announceConfig.downloadCheck.checkAfterSignupDays * 60 * 60 * 1000 * 24
              },
              status: 'normal',
              isVip: false,
              isOper: false,
              isAdmin: false
            }, {examinationData: exami}, {multi: true}, function (err, num) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.json({
                  num: num
                });
              }
            }
          );
        }
      }
    );
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * getExaminationStatus
 * @param req
 * @param res
 */
exports.getExaminationStatus = function (req, res) {
  if (req.user.isAdmin) {
    var countFinished = function (callback) {
      User.count({
        'examinationData.isFinished': true
      }, function (err, count) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, count);
        }
      });
    };

    var countUnfinished = function (callback) {
      User.count({
        'examinationData.isFinished': false
      }, function (err, count) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, count);
        }
      });
    };

    async.parallel([countFinished, countUnfinished], function (err, results) {
      if (err) {
        return res.status(422).send(err);
      } else {
        res.json({
          countFinished: results[0],
          countUnfinished: results[1],
          countAll: results[0] + results[1]
        });
      }
    });

  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};

/**
 * listFinishedUsers
 * @param req
 * @param res
 */
exports.listFinishedUsers = function (req, res) {
  var skip = 0;
  var limit = 0;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  var countQuery = function (callback) {
    User.count({'examinationData.isFinished': true}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    User.find({'examinationData.isFinished': true})
      .sort('-examinationData.finishedTime')
      .skip(skip)
      .limit(limit)
      .exec(function (err, users) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, users);
        }
      });
  };

  async.parallel([countQuery, findQuery], function (err, results) {
    if (err) {
      mtDebug.debugRed(err);
      return res.status(422).send(err);
    } else {
      res.json({rows: results[1], total: results[0]});
    }
  });
};

/**
 * listUnfinishedUsers
 * @param req
 * @param res
 */
exports.listUnfinishedUsers = function (req, res) {
  var skip = 0;
  var limit = 0;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  var countQuery = function (callback) {
    User.count({'examinationData.isFinished': false}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    User.find({'examinationData.isFinished': false})
      .skip(skip)
      .limit(limit)
      .exec(function (err, users) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, users);
        }
      });
  };

  async.parallel([countQuery, findQuery], function (err, results) {
    if (err) {
      mtDebug.debugRed(err);
      return res.status(422).send(err);
    } else {
      res.json({rows: results[1], total: results[0]});
    }
  });
};

/**
 * banAllUnfinishedUser
 * @param req
 * @param res
 */
exports.banAllUnfinishedUser = function (req, res) {
  if (req.user.isAdmin) {
    User.find({
      'examinationData.isFinished': false
    }).exec(function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        users.forEach(function (user) {
          var tp = {
            status: 'banned',
            banReason: {
              reason: 'BANNED.REASON_EXAMINATION_NOT_FINISHED',
              params: undefined
            }
          };

          user.update({
            $set: tp
          }).exec(function (err, result) {
            if (!err) {
              // write history
              history.insert(user._id, historyConfig.action.adminUpdateUserStatus, {
                status: 'banned',
                reason: 'BANNED.REASON_EXAMINATION_NOT_FINISHED',
                by: req.user._id
              });
            }
          });
        });

        res.json({
          num: users.length
        });

        //create trace log
        traceLogCreate(req, traceConfig.action.adminBanAllExaminationUnfinishedUsers, {
          num: users.length
        });
      }
    });

    //ban inviter
    if (inviteConfig.banUserInviter) {
      User.find({
        'examinationData.isFinished': false
      }).populate('invited_by', 'username displayName profileImageURL status isVip isOper score uploaded downloaded')
        .exec(function (err, users) {
          if (!err) {
            users.forEach(function (user) {
              if (user.invited_by) {
                if (!user.invited_by.isOper) {
                  if (user.invited_by.status !== 'banned') {
                    if (!user.invited_by.isVip || (user.invited_by.isVip && inviteConfig.banUserInviterVip)) {
                      user.invited_by.update({
                        $set: {
                          status: 'banned',
                          banReason: {
                            reason: 'BANNED.YOU_ARE_BANNED_FROM_INVITED_USER',
                            params: {
                              uname: user.displayName,
                              uReason: 'BANNED.REASON_EXAMINATION_NOT_FINISHED'
                            }
                          }
                        }
                      }).exec(function (err, result) {
                        if (!err) {
                          // write history
                          history.insert(user.invited_by._id, historyConfig.action.adminBanUserInviter, {
                            status: 'banned',
                            uname: user.displayName,
                            reason: 'BANNED.REASON_EXAMINATION_NOT_FINISHED',
                            by: req.user._id
                          });
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        });
    }
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }
};
