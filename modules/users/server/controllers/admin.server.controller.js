'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Peer = mongoose.model('Peer'),
  Torrent = mongoose.model('Torrent'),
  Complete = mongoose.model('Complete'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

const PEERSTATE_SEEDER = 'seeder';
const PEERSTATE_LEECHER = 'leecher';

var traceConfig = config.meanTorrentConfig.trace;
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

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

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
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
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

  user.update({
    $set: {status: req.body.userStatus}
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

  user.score = user.score + parseInt(req.body.userScore, 10);
  if (user.score < 0) {
    user.score = 0;
  }
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);

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
 * list user seeding torrents
 * @param req
 * @param res
 */
exports.getUserSeeding = function (req, res) {
  Peer.find({
    user: req.model._id,
    peer_status: PEERSTATE_SEEDER
  }).sort('-peer_uploaded')
    .populate({
      path: 'torrent',
      populate: {
        path: 'user',
        select: 'displayName profileImageURL'
      }
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
    peer_status: PEERSTATE_LEECHER
  }).sort('-peer_downloaded')
    .populate({
      path: 'torrent',
      populate: {
        path: 'user',
        select: 'displayName profileImageURL'
      }
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
    populate: {
      path: 'user',
      select: 'displayName profileImageURL'
    }
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
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').populate('invited_by', 'username displayName profileImageURL').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
