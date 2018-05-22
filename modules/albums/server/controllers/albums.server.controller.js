'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Maker = mongoose.model('Maker'),
  Album = mongoose.model('Album'),
  async = require('async'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;

var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * Create an album
 */
exports.create = function (req, res) {
  if (req.user.isOper) {
    var user = req.user;
    var album = new Album(req.body);

    album.user = user._id;
    mtDebug.debugRed(album);

    album.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(user);

        //create trace log
        traceLogCreate(req, traceConfig.action.OperCreateAlbum, {
          name: album.name
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
 * Show the current album
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var album = req.album ? req.album.toJSON() : {};

  album.isCurrentUserOwner = !!(req.user && album.user && album.user._id.toString() === req.user._id.toString());

  res.json(album);
};

/**
 * Update an album
 */
exports.update = function (req, res) {
  var album = req.album;

  album.name = req.body.name;
  album.overview = req.body.overview;

  album.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(album);
    }
  });
};

/**
 * insertIntoAlbum
 * @param req
 * @param res
 */
exports.insertIntoAlbum = function (req, res) {
  var album = req.album;
  var torrent = req.torrent;

  album.torrents.push(torrent);
  album.cover = torrent.resource_detail_info.cover || '';
  album.backdrop_path = torrent.resource_detail_info.backdrop_path || '';
  album.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(album);
    }
  });
};

/**
 * removeFromAlbum
 * @param req
 * @param res
 */
exports.removeFromAlbum = function (req, res) {
  var album = req.album;
  var torrent = req.torrent;

  album.torrents.pull(torrent);
  album.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(album);
    }
  });
};

/**
 * setRecommendLevel
 * @param req
 * @param res
 */
exports.setRecommendLevel = function (req, res) {
  var album = req.album;

  if (req.params.rlevel) {
    album.recommend_level = req.params.rlevel;
    album.ordered_at = Date.now();

    album.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(album);

        //create trace log
        traceLogCreate(req, traceConfig.action.AdminAlbumSetRecommendLevel, {
          album: album._id,
          recommended: req.params.rlevel
        });
      }
    });
  } else {
    return res.status(422).send({
      message: 'PARAMS_RLEVEL_ERROR'
    });
  }

};

/**
 * Delete an album
 */
exports.delete = function (req, res) {
  var album = req.album;

  album.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(album);
    }
  });
};

/**
 * List of albums
 */
exports.list = function (req, res) {
  var skip = 0;
  var limit = 0;
  var type = undefined;
  var keysA = [];
  var condition = {};

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }
  if (req.query.type !== undefined) {
    type = req.query.type;
  }

  if (req.query.keys && req.query.keys.length > 0) {
    var keysS = req.query.keys + '';
    var keysT = keysS.split(' ');

    keysT.forEach(function (it) {
      var ti = new RegExp(it, 'i');
      keysA.push(ti);
    });
  }

  if (type !== undefined) {
    condition.type = type;
  }

  if (keysA.length > 0) {
    condition.$or = [
      {name: {'$all': keysA}},
      {overview: {'$all': keysA}}
    ];
  }

  var countQuery = function (callback) {
    Album.count(condition, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    Album.find(condition)
      .sort('-recommend_level -ordered_at -created_at')
      .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
      .populate('torrents')
      .skip(skip)
      .limit(limit)
      .exec(function (err, albums) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, albums);
        }
      });
  };

  async.parallel([countQuery, findQuery], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({rows: results[1], total: results[0]});
    }
  });
};

/**
 * Album middleware
 */
exports.albumByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  Album.findById(id)
    .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
    .populate({
      path: 'torrents',
      populate: [{
        path: 'user',
        select: 'username displayName profileImageURL isVip score uploaded downloaded'
      }]
    })
    .exec(function (err, album) {
      if (err) {
        return next(err);
      } else if (!album) {
        return res.status(404).send();
      }
      req.album = album;
      next();
    });
};
