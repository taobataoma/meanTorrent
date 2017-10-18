'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  User = mongoose.model('User'),
  Rating = mongoose.model('Rating'),
  Torrent = mongoose.model('Torrent'),
  async = require('async'),
  tmdb = require('moviedb')(config.meanTorrentConfig.tmdbConfig.key),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create,
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var traceConfig = config.meanTorrentConfig.trace;

var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * searchcollection
 * @param req
 * @param res
 */
exports.searchcollection = function (req, res) {
  mtDebug.debugGreen('------- API: searchCollection --------------------');
  mtDebug.debugGreen(req.params);

  tmdb.searchCollection({
    language: req.params.language,
    query: req.query.query
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      res.json(info);
    }
  });
};

/**
 * collectioninfo
 * @param req
 * @param res
 */
exports.collectioninfo = function (req, res) {
  mtDebug.debugGreen('------- API: collectioninfo --------------------');
  mtDebug.debugGreen(req.params);

  tmdb.collectionInfo({
    id: req.params.id,
    language: req.params.language
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      res.json(info);
    }
  });
};

/**
 * Collection middleware
 */
exports.collectionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'COLLECTION_ID_INVALID'
    });
  }

  //var findTorrents = function (callback) {
  //  Torrent.findById(id)
  //    .populate('user', 'username displayName profileImageURL isVip')
  //    .populate('_thumbs.user', 'username displayName profileImageURL isVip uploaded downloaded')
  //    .populate('_ratings.user', 'username displayName profileImageURL isVip uploaded downloaded')
  //    .populate({
  //      path: '_replies.user',
  //      select: 'username displayName profileImageURL isVip uploaded downloaded',
  //      model: 'User'
  //    })
  //    .populate({
  //      path: '_replies._replies.user',
  //      select: 'username displayName profileImageURL isVip uploaded downloaded',
  //      model: 'User'
  //    })
  //    .populate({
  //      path: '_subtitles',
  //      populate: {
  //        path: 'user',
  //        select: 'username displayName profileImageURL isVip'
  //      }
  //    })
  //    .populate({
  //      path: '_peers',
  //      populate: {
  //        path: 'user',
  //        select: 'username displayName profileImageURL isVip'
  //      }
  //    })
  //    .exec(function (err, torrent) {
  //      if (err) {
  //        callback(err);
  //      } else if (!torrent) {
  //        callback(new Error('No torrent with that id has been found'));
  //      }
  //      callback(null, torrent);
  //    });
  //};
  //
  //var findOtherTorrents = function (torrent, callback) {
  //  if (torrent.resource_detail_info.id) {
  //    var condition = {
  //      torrent_status: 'reviewed',
  //      'resource_detail_info.id': torrent.resource_detail_info.id
  //    };
  //
  //    mtDebug.debugGreen(condition);
  //
  //    var fields = 'user torrent_filename torrent_tags torrent_seeds torrent_leechers torrent_finished torrent_seasons torrent_episodes torrent_size torrent_sale_status torrent_type torrent_hnr torrent_vip torrent_sale_expires createdat';
  //
  //    Torrent.find(condition, fields)
  //      .sort('-createdat')
  //      .populate('user', 'username displayName isVip')
  //      .exec(function (err, torrents) {
  //        if (err) {
  //          callback(err);
  //        } else {
  //          torrent._other_torrents.splice(0, torrent._other_torrents.length);
  //          torrents.forEach(function (t) {
  //            if (!t._id.equals(torrent._id)) {
  //              torrent._other_torrents.push(t.toJSON());
  //            }
  //          });
  //          callback(null, torrent);
  //        }
  //      });
  //  } else {
  //    callback(null, torrent);
  //  }
  //};
  //
  //async.waterfall([findTorrents, findOtherTorrents], function (err, torrent) {
  //  if (err) {
  //    next(err);
  //  } else {
  //    req.torrent = torrent;
  //    next();
  //  }
  //});
};
