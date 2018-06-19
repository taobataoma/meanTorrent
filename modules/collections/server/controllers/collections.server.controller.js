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
  Maker = mongoose.model('Maker'),
  Torrent = mongoose.model('Torrent'),
  Collection = mongoose.model('Collection'),
  objectId = require('mongodb').ObjectId,
  async = require('async'),
  tmdb = require('moviedb')(config.meanTorrentConfig.tmdbConfig.key),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create,
  populateStrings = require(path.resolve('./config/lib/populateStrings')),
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var traceConfig = config.meanTorrentConfig.trace;
var tmdbConfig = config.meanTorrentConfig.tmdbConfig;

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
    language: tmdbConfig.resourcesLanguage,
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
    language: tmdbConfig.resourcesLanguage
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      res.json(info);
    }
  });
};

/**
 * Create an collection
 */
exports.create = function (req, res) {
  if (req.user.isOper) {
    var user = req.user;
    var coll = new Collection(req.body);

    coll.user = user._id;
    mtDebug.debugRed(coll);

    coll.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(user);

        //create trace log
        traceLogCreate(req, traceConfig.action.adminCreateCollection, {
          name: coll.name
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
 * Show the current collection
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var coll = req.collection ? req.collection.toJSON() : {};

  coll.isCurrentUserOwner = !!(req.user && coll.user && coll.user._id.toString() === req.user._id.toString());

  res.json(coll);
};

/**
 * Update an collection
 */
exports.update = function (req, res) {
  var coll = req.collection;

  coll.name = req.body.name;
  coll.overview = req.body.overview;

  coll.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coll);
    }
  });
};

/**
 * insertIntoCollection
 * @param req
 * @param res
 */
exports.insertIntoCollection = function (req, res) {
  var coll = req.collection;
  var torrent = req.torrent;

  coll.torrents.push(torrent);
  coll.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coll);
    }
  });
};

/**
 * removeFromCollection
 * @param req
 * @param res
 */
exports.removeFromCollection = function (req, res) {
  var coll = req.collection;
  var torrent = req.torrent;

  coll.torrents.pull(torrent);
  coll.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coll);
    }
  });
};

/**
 * setRecommendLevel
 * @param req
 * @param res
 */
exports.setRecommendLevel = function (req, res) {
  var coll = req.collection;

  if (req.params.rlevel) {
    coll.recommend_level = req.params.rlevel;
    coll.ordered_at = Date.now();

    coll.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(coll);

        //create trace log
        traceLogCreate(req, traceConfig.action.adminCollectionSetRecommendLevel, {
          coll: coll._id,
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
 * Delete an collection
 */
exports.delete = function (req, res) {
  var coll = req.collection;

  coll.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coll);
    }
  });
};

/**
 * List of collections
 */
exports.list = function (req, res) {
  var skip = 0;
  var limit = 0;
  var tmdb_id = 0;
  var keysA = [];
  var condition = {};

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  if (req.query.tmdb_id !== undefined) {
    tmdb_id = parseInt(req.query.tmdb_id, 10);
  }

  if (req.query.keys && req.query.keys.length > 0) {
    var keysS = req.query.keys + '';
    var keysT = keysS.split(' ');

    keysT.forEach(function (it) {
      var ti = new RegExp(it, 'i');
      keysA.push(ti);
    });
  }

  if (tmdb_id !== 0) {
    condition.tmdb_id = tmdb_id;
  }

  if (keysA.length > 0) {
    condition.$or = [
      {name: {'$all': keysA}},
      {overview: {'$all': keysA}}
    ];
  }

  var countQuery = function (callback) {
    Collection.count(condition, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    Collection.find(condition)
      .sort('-recommend_level -ordered_at -created_at')
      .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
      .populate('torrents', populateStrings.populate_torrent_string)
      .skip(skip)
      .limit(limit)
      .exec(function (err, colls) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, colls);
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
 * getTorrentCollections
 * @param req
 * @param res
 */
exports.getTorrentCollections = function (req, res) {
  Collection.find({
    torrents: {$in: [req.torrent._id]}
  }, function (err, coll) {
    if (coll) {
      res.json(coll);
    }
  });
};

/**
 * Collection middleware
 */
exports.collectionByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  Collection.findById(id)
    .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
    .populate({
      path: 'torrents',
      select: populateStrings.populate_torrent_string,
      populate: [{
        path: 'user',
        select: 'username displayName profileImageURL isVip score uploaded downloaded'
      }, {
        path: 'maker',
        select: 'name'
      }]
    })
    .exec(function (err, coll) {
      if (err) {
        return next(err);
      } else if (!coll) {
        return res.status(404).send();
      }
      req.collection = coll;
      next();
    });
};
