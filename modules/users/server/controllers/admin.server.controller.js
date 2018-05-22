'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  dataLog = require(path.resolve('./config/lib/data-log')),
  mongoose = require('mongoose'),
  objectId = require('mongodb').ObjectId,
  User = mongoose.model('User'),
  Peer = mongoose.model('Peer'),
  Torrent = mongoose.model('Torrent'),
  Complete = mongoose.model('Complete'),
  moment = require('moment'),
  async = require('async'),
  scoreUpdate = require(path.resolve('./config/lib/score')).update,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

const PEERSTATE_SEEDER = 'seeder';
const PEERSTATE_LEECHER = 'leecher';

var traceConfig = config.meanTorrentConfig.trace;
var mtDebug = require(path.resolve('./config/lib/debug'));
var appConfig = config.meanTorrentConfig.app;
var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;
var announceConfig = config.meanTorrentConfig.announce;
var scoreConfig = config.meanTorrentConfig.score;

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;
  var accessChanged = false;

  accessChanged = (user.upload_access !== req.body.upload_access);
  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;
  user.upload_access = req.body.upload_access;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

    //add server message
    if (serverNoticeConfig.action.userUploadAccessChanged.enable && accessChanged) {
      serverMessage.addMessage(user._id, serverNoticeConfig.action.userUploadAccessChanged.title, serverNoticeConfig.action.userUploadAccessChanged.content, {
        upload_access: user.upload_access === 'review' ? 'UPLOADER.FIELDS_REVIEW' : 'UPLOADER.FIELDS_PASS',
        by_name: req.user.displayName,
        by_id: req.user._id,
        site_name: appConfig.name
      });
    }

    //create trace log
    traceLogCreate(req, traceConfig.action.AdminUserEdit, {
      user: user._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      roles: req.body.roles
    });
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

    //create trace log
    traceLogCreate(req, traceConfig.action.AdminUserDelete, {
      user: user._id
    });
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  var condition = {};
  var keysA = [];
  var skip = 0;
  var limit = 0;
  var isVip = false;
  var isOper = false;
  var isAdmin = false;
  var status = undefined;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }
  if (req.query.isVip !== undefined) {
    isVip = req.query.isVip;
  }
  if (req.query.isOper !== undefined) {
    isOper = req.query.isOper;
  }
  if (req.query.isAdmin !== undefined) {
    isAdmin = req.query.isAdmin;
  }
  if (req.query.status !== undefined && req.query.status !== 'all') {
    status = req.query.status;
  }

  if (req.query.keys && req.query.keys.length > 0) {
    var keysS = req.query.keys + '';
    var keysT = keysS.split(' ');

    if (keysT.length === 1 && mongoose.Types.ObjectId.isValid(keysT[0])) {
      keysA = objectId(keysT[0]);
    } else {
      keysT.forEach(function (it) {
        var ti = new RegExp(it, 'i');
        keysA.push(ti);
      });
    }
  }
  if (isVip === 'true') {
    condition.isVip = true;
  }
  if (isOper === 'true') {
    condition.roles = {$in: ['oper']};
  }
  if (isAdmin === 'true') {
    condition.roles = {$in: ['admin']};
  }
  if (isOper === 'true' && isAdmin === 'true') {
    condition.roles = {$in: ['oper', 'admin']};
  }
  if (status !== undefined) {
    condition.status = status;
  }

  if (mongoose.Types.ObjectId.isValid(keysA)) {
    condition._id = keysA;
  } else {
    if (keysA.length > 0) {
      condition.$or = [
        {displayName: {'$all': keysA}},
        {email: {'$all': keysA}},
        {passkey: {'$all': keysA}},
        {username: {'$all': keysA}}
      ];
    }
  }

  mtDebug.debugBlue(condition, 'ADMIN_USERS_LIST');

  var countQuery = function (callback) {
    User.count(condition, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    User.find(condition, '-salt -password -providerData')
      .sort('-created')
      .populate('invited_by', 'username displayName profileImageURL isVip score uploaded downloaded')
      .populate('makers', 'name')
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
 * updateUserRole
 * @param req
 * @param res
 */
exports.updateUserRole = function (req, res) {
  var user = req.model;

  user.update({
    $set: {roles: req.body.userRole}
  }).exec(function (err, result) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      user.roles = req.body.userRole;
      res.json(user);

      //add server message
      if (serverNoticeConfig.action.userRoleChanged.enable) {
        serverMessage.addMessage(user._id, serverNoticeConfig.action.userRoleChanged.title, serverNoticeConfig.action.userRoleChanged.content, {
          by_name: req.user.displayName,
          by_id: req.user._id,
          user_role: req.body.userRole[0],
          site_name: appConfig.name
        });
      }

      //create trace log
      traceLogCreate(req, traceConfig.action.AdminUpdateUserRole, {
        user: user._id,
        role: req.body.userRole
      });
    }
  });
};

/**
 * updateUserStatus
 * @param req
 * @param res
 */
exports.updateUserStatus = function (req, res) {
  var user = req.model;
  var tp = {status: req.body.userStatus};

  if (user.status === 'idle' && req.body.userStatus === 'normal') {
    tp.last_signed = Date.now();
  }

  user.update({
    $set: tp
  }).exec(function (err, result) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      user.status = req.body.userStatus;
      res.json(user);

      //create trace log
      traceLogCreate(req, traceConfig.action.AdminUpdateUserStatus, {
        user: user._id,
        status: req.body.userStatus
      });
    }
  });
};

/**
 * updateUserScore
 * @param req
 * @param res
 */
exports.updateUserScore = function (req, res) {
  var user = req.model;
  var sv = parseFloat(req.body.userScore.toFixed(2));

  user.score = Math.max(user.score + sv, 0);

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

    dataLog.scoreLog(user, sv);
    //create trace log
    traceLogCreate(req, traceConfig.action.AdminUpdateUserScore, {
      user: user._id,
      score: req.body.userScore
    });
  });
};

/**
 * updateUserUploaded
 * @param req
 * @param res
 */
exports.updateUserUploaded = function (req, res) {
  var user = req.model;

  user.uploaded = user.uploaded + parseInt(req.body.userUploaded, 10);
  if (user.uploaded < 0) {
    user.uploaded = 0;
  }
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

    //create trace log
    traceLogCreate(req, traceConfig.action.AdminUpdateUserUploaded, {
      user: user._id,
      uploaded: req.body.userUploaded
    });
  });
};

/**
 * updateUserDownloaded
 * @param req
 * @param res
 */
exports.updateUserDownloaded = function (req, res) {
  var user = req.model;

  user.downloaded = user.downloaded + parseInt(req.body.userDownloaded, 10);
  if (user.downloaded < 0) {
    user.downloaded = 0;
  }
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

    //create trace log
    traceLogCreate(req, traceConfig.action.AdminUpdateUserDownloaded, {
      user: user._id,
      downloaded: req.body.userDownloaded
    });
  });
};

/**
 * addVIPMonths
 * @param req
 * @param res
 */
exports.addVIPMonths = function (req, res) {
  var user = req.model;
  var months = parseInt(req.params.months, 10);

  if (months > 0) {
    mtDebug.debugBlue(user.vip_start_at, 'VIP_START_AT');
    mtDebug.debugBlue(user.vip_end_at, 'VIP_END_AT');

    var now = moment(Date.now());
    var start = moment(user.vip_start_at);
    var end = moment(user.vip_end_at);

    if (!user.vip_end_at) {
      start = now;
      end = moment(start).add(months, 'M');
    } else if (now > end) {
      start = now;
      end = moment(start).add(months, 'M');
    } else {
      end = moment(end).add(months, 'M');
    }

    mtDebug.debugBlue(start, 'VIP_NEW_START_AT');
    mtDebug.debugBlue(end, 'VIP_NEW_END_AT');

    user.vip_start_at = start;
    user.vip_end_at = end;
    user.status = 'normal';
    user.hnr_warning = 0;

    user.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(user);

      //clean all H&R record
      Complete.remove({
        user: user._id
      }).exec();

      //add server message
      if (serverNoticeConfig.action.userVipStatusChanged.enable) {
        serverMessage.addMessage(user._id, serverNoticeConfig.action.userVipStatusChanged.title, serverNoticeConfig.action.userVipStatusChanged.content, {
          vip_end_at: user.vip_end_at
        });
      }

      //create trace log
      traceLogCreate(req, traceConfig.action.AdminUpdateUserVIPData, {
        user: user._id,
        reset: false,
        months: months
      });
    });
  } else {
    return res.status(422).send({
      message: 'PARAMS_MONTH_ERROR'
    });
  }
};

/**
 * uploaderList
 * @param req
 * @param res
 */
exports.uploaderList = function (req, res) {
  var skip = 0;
  var limit = 0;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  var countQuery = function (callback) {
    User.count({
      uptotal: {$gt: 0}
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    User.find({
      uptotal: {$gt: 0}
    }, '-salt -password -providerData')
      .sort('-uptotal')
      .populate('makers', 'name')
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
 * resetVIPData
 * @param req
 * @param res
 */
exports.resetVIPData = function (req, res) {
  var user = req.model;

  user.vip_start_at = '';
  user.vip_end_at = '';

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

    //create trace log
    traceLogCreate(req, traceConfig.action.AdminUpdateUserVIPData, {
      user: user._id,
      reset: true
    });
  });
};

/**
 * list user seeding torrents
 * @param req
 * @param res
 */
exports.getUserSeeding = function (req, res) {
  Peer.find({
    user: req.model._id,
    peer_status: PEERSTATE_SEEDER,
    last_announce_at: {$gt: Date.now() - announceConfig.announceInterval - announceConfig.announceIdleTime}
  }).sort('-peer_uploaded')
    .populate({
      path: 'torrent',
      populate: [
        {path: 'user', select: 'displayName profileImageURL'},
        {path: 'maker', select: 'name'}
      ]
    })
    .exec(function (err, torrents) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(torrents);
      }
    });
};

/**
 * list user getUserLeeching torrents
 * @param req
 * @param res
 */
exports.getUserLeeching = function (req, res) {
  Peer.find({
    user: req.model._id,
    peer_status: PEERSTATE_LEECHER,
    last_announce_at: {$gt: Date.now() - announceConfig.announceInterval - announceConfig.announceIdleTime}
  }).sort('-peer_downloaded')
    .populate({
      path: 'torrent',
      populate: [
        {path: 'user', select: 'displayName profileImageURL'},
        {path: 'maker', select: 'name'}
      ]
    })
    .exec(function (err, torrents) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(torrents);
      }
    });
};

/**
 * list user warning torrents
 * @param req
 * @param res
 */
exports.getUserWarning = function (req, res) {
  Complete.find({
    user: req.model._id,
    hnr_warning: true
  }).populate({
    path: 'torrent',
    populate: [
      {path: 'user', select: 'displayName profileImageURL'},
      {path: 'maker', select: 'name'}
    ]
  }).exec(function (err, complets) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(complets);
    }
  });
};

/**
 * getUserUploadedTotal
 * @param req
 * @param res
 */
exports.getUserUploadedTotal = function (req, res) {
  Torrent.count({
    user: req.user._id
  }, function (err, count) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({
        total: count
      });
    }
  });
};

/**
 * resetUserProfileImage
 * @param req
 * @param res
 */
exports.resetUserProfileImage = function (req, res) {
  var user = req.model;

  user.profileImageURL = User.schema.path('profileImageURL').defaultValue;
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  User.findById(id, '-salt -password -providerData')
    .populate('invited_by', 'username displayName profileImageURL isVip score uploaded downloaded')
    .populate('makers', 'user name')
    .exec(function (err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(new Error('Failed to load user ' + id));
      }

      req.model = user;
      next();
    });
};
