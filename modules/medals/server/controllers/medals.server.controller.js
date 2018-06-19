'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  Medal = mongoose.model('Medal'),
  objectId = require('mongodb').ObjectId,
  async = require('async'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create,
  history = require(path.resolve('./config/lib/history')),
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var traceConfig = config.meanTorrentConfig.trace;
var historyConfig = config.meanTorrentConfig.history;
var medalsConfig = config.meanTorrentConfig.medals;
var scoreConfig = config.meanTorrentConfig.score;

var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * getMedalsCount
 * @param req
 * @param res
 */
exports.getMedalsCount = function (req, res) {
  var medalName = undefined;

  if (req.query.mName !== undefined) {
    medalName = req.query.mName;
    Medal.count({medalName: medalName}, function (err, count) {
      res.json([{
        _id: medalName,
        count: count
      }]);
    });
  } else {
    Medal.aggregate([{
      $group: {
        _id: '$medalName',
        count: {$sum: 1}
      }
    }]).exec(function (err, counts) {
      res.json(counts);
    });
  }
};

/**
 * viewMedal
 * @param req
 * @param res
 */
exports.viewMedal = function (req, res) {
  var medalsAll = medalsConfig.type;
  var medal = undefined;
  medalsAll.forEach(function (md) {
    if (md.name === req.params.medalName) {
      medal = md;
    }
  });

  if (medal.cats !== 'workers' || medalsConfig.showWorkerUsersListToAll || req.user.isOper) {
    var skip = 0;
    var limit = 0;

    if (req.query.skip !== undefined) {
      skip = parseInt(req.query.skip, 10);
    }
    if (req.query.limit !== undefined) {
      limit = parseInt(req.query.limit, 10);
    }

    var countQuery = function (callback) {
      Medal.count({
        medalName: req.params.medalName
      }, function (err, count) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, count);
        }
      });
    };

    var findQuery = function (callback) {
      Medal.find({
        medalName: req.params.medalName
      }).populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
        .skip(skip)
        .limit(limit)
        .sort('createdAt')
        .exec(function (err, medals) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, medals);
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
  } else {
    return res.status(403).json({
      message: 'ERROR: User is not authorized'
    });
  }
};

/**
 * requestMedal
 * @param req
 * @param res
 */
exports.requestMedal = function (req, res) {
  var user = req.user;
  var medalsAll = medalsConfig.type;
  var medal = undefined;
  medalsAll.forEach(function (md) {
    if (md.name === req.params.medalName) {
      medal = md;
    }
  });

  if (medal.passHelp === 'self') {
    Medal.count({
      user: objectId(user._id),
      medalName: req.params.medalName
    }, function (err, count) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (count > 0) {
        return res.status(422).json({
          message: 'SERVER.USER_ALREADY_HAS_THIS_MEDAL'
        });
      } else {
        if (!medal.score || user.score >= medal.score) {
          var newMedal = new Medal({
            user: user,
            medalName: req.params.medalName,
            addBy: user
          });

          newMedal.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(newMedal);

              // add medalName to user
              user.update({
                $addToSet: {medals: req.params.medalName}
              }).exec();
              //score update
              var act = scoreConfig.action.scoreToRequestMedal;
              act.params = {
                medalDesc: 'MEDALS.DESC.' + medal.prefix.toUpperCase()
              };
              scoreUpdate(req, user, act, -(medal.score));
            }
          });
        } else {
          return res.status(422).send({
            message: 'SERVER.SCORE_NOT_ENOUGH'
          });
        }
      }
    });
  } else {
    return res.status(403).json({
      message: 'ERROR: User is not authorized'
    });
  }
};

/**
 * getUserMedals
 * @param req
 * @param res
 */
exports.getUserMedals = function (req, res) {
  Medal.find({
    user: objectId(req.params.userId)
  })
    .sort('createdAt')
    .exec(function (err, medals) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(medals);
      }
    });
};

/**
 * addToUser
 * @param req
 * @param res
 */
exports.addToUser = function (req, res) {
  var user = req.model;

  if (user._id.equals(req.user._id) || req.user.isOper) {
    Medal.count({
      user: objectId(user._id),
      medalName: req.params.medalName
    }, function (err, count) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (count > 0) {
        return res.status(422).json({
          message: 'SERVER.USER_ALREADY_HAS_THIS_MEDAL'
        });
      } else {
        var medal = new Medal({
          user: user,
          medalName: req.params.medalName,
          addBy: req.user
        });

        medal.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(medal);

            // add medalName to user
            user.update({
              $addToSet: {medals: req.params.medalName}
            }).exec();
            //create trace log
            traceLogCreate(req, traceConfig.action.adminAddUserMedal, {
              user: user._id,
              medalName: req.params.medalName
            });
            // write history
            history.insert(user._id, historyConfig.action.adminAddUserMedal, {
              medalName: req.params.medalName,
              by: req.user._id
            });
          }
        });
      }
    });
  } else {
    return res.status(403).json({
      message: 'ERROR: User is not authorized'
    });
  }
};

/**
 * removeFromUser
 * @param req
 * @param res
 */
exports.removeFromUser = function (req, res) {
  var user = req.model;

  if (user._id.equals(req.user._id) || req.user.isOper) {
    Medal.findOne({
      user: objectId(user._id),
      medalName: req.params.medalName
    }, function (err, medal) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!medal) {
        return res.status(422).json({
          message: 'SERVER.USER_HAS_NOT_THIS_MEDAL'
        });
      } else {
        medal.remove(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(medal);

            // add medalName to user
            user.update({
              $pull: {medals: req.params.medalName}
            }).exec();
            //create trace log
            traceLogCreate(req, traceConfig.action.adminRemoveUserMedal, {
              user: user._id,
              medalName: req.params.medalName
            });
            // write history
            history.insert(user._id, historyConfig.action.adminRemoveUserMedal, {
              medalName: req.params.medalName,
              by: req.user._id
            });
          }
        });
      }
    });
  } else {
    return res.status(403).json({
      message: 'ERROR: User is not authorized'
    });
  }
};
