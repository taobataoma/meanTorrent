'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Maker = mongoose.model('Maker'),
  Rating = mongoose.model('Rating'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  history = require(path.resolve('./config/lib/history')),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;
var appConfig = config.meanTorrentConfig.app;
var mtDebug = require(path.resolve('./config/lib/debug'));
var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;
var historyConfig = config.meanTorrentConfig.history;

/**
 * Create an maker
 */
exports.create = function (req, res) {
  if (req.user.isOper) {
    var user = req.model;
    var maker = new Maker(req.body);

    maker.user = user._id;
    maker.members.push(user._id);

    mtDebug.debugRed(maker);

    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //save user`s maker
        user.makers.push(maker);
        user.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(user);
          }
        });

        //add server message
        if (serverNoticeConfig.action.makerCreated.enable) {
          serverMessage.addMessage(user._id, serverNoticeConfig.action.makerCreated.title, serverNoticeConfig.action.makerCreated.content, {
            maker_name: maker.name,
            maker_id: maker._id,
            site_name: appConfig.name,
            by_name: req.user.displayName,
            by_id: req.user._id
          });
        }

        //create trace log
        traceLogCreate(req, traceConfig.action.adminCreateUserMakerGroup, {
          user: user._id,
          name: maker.name
        });
        // write history
        history.insert(user._id, historyConfig.action.adminCreateUserMakerGroup, {
          name: maker.name,
          by: req.user._id
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
 * Show the current maker
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var maker = req.maker ? req.maker.toJSON() : {};

  maker.isCurrentUserOwner = !!(req.user && maker.user && maker.user._id.toString() === req.user._id.toString());

  res.json(maker);
};

/**
 * Update an maker
 */
exports.update = function (req, res) {
  var maker = req.maker;
  var accessChanged = false;

  accessChanged = (maker.upload_access !== req.body.upload_access);
  maker.name = req.body.name;
  maker.desc = req.body.desc;
  maker.upload_access = req.body.upload_access;

  maker.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(maker);

      //add server message
      if (serverNoticeConfig.action.makerUploadAccessChanged.enable && accessChanged) {
        serverMessage.addMessage(maker.user._id, serverNoticeConfig.action.makerUploadAccessChanged.title, serverNoticeConfig.action.makerUploadAccessChanged.content, {
          maker_name: maker.name,
          maker_id: maker._id,
          maker_access: maker.upload_access === 'review' ? 'UPLOADER.FIELDS_REVIEW' : 'UPLOADER.FIELDS_PASS',
          by_name: req.user.displayName,
          by_id: req.user._id,
          site_name: appConfig.name
        });
      }

      //create trace log
      traceLogCreate(req, traceConfig.action.adminMakerEdit, {
        maker: maker._id,
        name: req.body.name,
        desc: req.body.desc,
        upload_access: req.body.upload_access
      });
    }
  });
};

/**
 * Delete an maker
 */
exports.delete = function (req, res) {
  var maker = req.maker;

  maker.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(maker);

      //add server message
      if (serverNoticeConfig.action.makerDeleted.enable) {
        serverMessage.addMessage(maker.user._id, serverNoticeConfig.action.makerDeleted.title, serverNoticeConfig.action.makerDeleted.content, {
          maker_name: maker.name,
          site_name: appConfig.name,
          by_name: req.user.displayName,
          by_id: req.user._id
        });
      }
    }
  });
};

/**
 * List of makers
 */
exports.list = function (req, res) {
  Maker.find()
    .sort('-torrent_count')
    .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
    .populate('members', 'username displayName profileImageURL isVip score uploaded downloaded')
    .exec(function (err, makers) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(makers);
      }
    });
};

/**
 * rating
 * @param req
 * @param res
 */
exports.rating = function (req, res) {
  var user = req.user;
  var exist = false;
  var maker = req.maker;
  var rat = new Rating();
  rat.user = req.user;
  rat.vote = req.query.vote;

  mtDebug.debugGreen(rat);
  //check if already exist
  exist = false;
  maker._ratings.forEach(function (r) {
    if (r.user._id.equals(user._id)) {
      exist = true;
    }
  });
  if (exist) {
    return res.status(422).send({
      message: 'ALREADY_RATING'
    });
  } else {
    maker._ratings.push(rat);
    maker.vote_count = parseInt(maker.vote_count, 10) + 1;
    maker.vote_total = parseInt(maker.vote_total, 10) + rat.vote;
    maker.vote_average = Math.floor((maker.vote_total / maker.vote_count) * 10) / 10;
    mtDebug.debugGreen(maker);

    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(maker);
      }
    });
  }
};

/**
 * addMember
 * @param req
 * @param res
 */
exports.addMember = function (req, res) {
  var maker = req.maker;
  var mu = req.nameuser;

  var om = [];
  maker.members.forEach(function (m) {
    om.push(m._id.toString());
  });

  if (om.indexOf(mu._id.toString()) >= 0) {
    return res.status(422).send({
      message: 'username "' + mu.username + '" already exist!'
    });
  } else {
    maker.members.push(mu);
    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(maker);

        //save user`s maker
        if (!mu.makers) {
          mu.makers = [];
        }
        mu.makers.push(maker);
        mu.save();

        //add server message
        if (serverNoticeConfig.action.makerAddMember.enable) {
          serverMessage.addMessage(mu._id, serverNoticeConfig.action.makerAddMember.title, serverNoticeConfig.action.makerAddMember.content, {
            maker_name: maker.name,
            maker_id: maker._id,
            site_name: appConfig.name,
            by_name: req.user.displayName,
            by_id: req.user._id
          });
        }
      }
    });
  }
};

/**
 * removeMember
 * @param req
 * @param res
 * @returns {*}
 */
exports.removeMember = function (req, res) {
  var maker = req.maker;
  var mu = req.nameuser;

  var om = [];
  maker.members.forEach(function (m) {
    om.push(m._id.toString());
  });

  if (om.indexOf(mu._id.toString()) < 0) {
    return res.status(422).send({
      message: 'username "' + mu.username + '" not exist!'
    });
  } else {
    maker.members.splice(om.indexOf(mu._id.toString()), 1);
    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(maker);

        //save user`s maker
        if (mu.makers) {
          if (mu.makers.indexOf(maker._id) >= 0) {
            mu.makers.splice(mu.makers.indexOf(maker._id), 1);
            mu.save();
          }
        }

        //add server message
        if (serverNoticeConfig.action.makerRemoveMember.enable) {
          serverMessage.addMessage(mu._id, serverNoticeConfig.action.makerRemoveMember.title, serverNoticeConfig.action.makerRemoveMember.content, {
            maker_name: maker.name,
            maker_id: maker._id,
            site_name: appConfig.name,
            by_name: req.user.displayName,
            by_id: req.user._id
          });
        }
      }
    });
  }
};

/**
 * Maker middleware
 */
exports.makerByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  Maker.findById(id)
    .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
    .populate('members', 'username displayName profileImageURL isVip score uploaded downloaded')
    .populate('_ratings.user', 'username displayName profileImageURL isVip score uploaded downloaded')
    .exec(function (err, maker) {
      if (err) {
        return next(err);
      } else if (!maker) {
        return res.status(404).send();
      }
      req.maker = maker;
      next();
    });
};
