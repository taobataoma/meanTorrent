'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  User = mongoose.model('User'),
  Peer = mongoose.model('Peer'),
  Torrent = mongoose.model('Torrent'),
  fs = require('fs'),
  nt = require('nt'),
  benc = require('bncode'),
  async = require('async'),
  validator = require('validator'),
  tmdb = require('moviedb')(config.meanTorrentConfig.tmdbConfig.key);

/**
 * get movie info from tmdb
 */
exports.movieinfo = function (req, res) {
  console.log('------- API: movieinfo --------------------');
  console.log(req.params);

  tmdb.movieInfo({
    id: req.params.tmdbid,
    language: req.params.language,
    append_to_response: 'credits,images,alternative_titles,release_dates',
    include_image_language: req.params.language + ',null'
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      res.json(info);
    }
  });
};

/**
 * get tv info from tmdb
 */
exports.tvinfo = function (req, res) {
  console.log('------- API: tvinfo --------------------');
  console.log(req.params);

  tmdb.tvInfo({
    id: req.params.tmdbid,
    language: req.params.language,
    append_to_response: 'credits,images,alternative_titles',
    include_image_language: req.params.language + ',null'
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      res.json(info);
    }
  });
};

/**
 * upload torrent file
 * @param req
 * @param res
 */
exports.upload = function (req, res) {
  var user = req.user;
  var createUploadFilename = require(path.resolve('./config/lib/multer')).createUploadFilename;
  var getUploadDestination = require(path.resolve('./config/lib/multer')).getUploadDestination;
  var fileFilter = require(path.resolve('./config/lib/multer')).torrentFileFilter;
  var torrentinfo = null;

  var storage = multer.diskStorage({
    destination: getUploadDestination,
    filename: createUploadFilename
  });

  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: config.uploads.torrent.file.limits
  }).single('newTorrentFile');

  if (user) {
    uploadFile()
      .then(checkAnnounce)
      .then(checkHash)
      .then(function () {
        res.status(200).send(torrentinfo);
      })
      .catch(function (err) {
        res.status(422).send(err);

        if (req.file && req.file.filename) {
          var newfile = config.uploads.torrent.file.temp + req.file.filename;
          if (fs.existsSync(newfile)) {
            console.log(err);
            console.log('ERROR: DELETE TEMP TORRENT FILE: ' + newfile);
            fs.unlinkSync(newfile);
          }
        }
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadFile() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          var message = errorHandler.getErrorMessage(uploadError);

          if (uploadError.code === 'LIMIT_FILE_SIZE') {
            message = 'Torrent file too large. Maximum size allowed is ' + (config.uploads.torrent.file.limits.fileSize / (1024 * 1024)).toFixed(2) + ' Mb files.';
          }

          reject(message);
        } else {
          resolve();
        }
      });
    });
  }

  function checkAnnounce() {
    return new Promise(function (resolve, reject) {
      console.log(req.file.filename);
      var newfile = config.uploads.torrent.file.temp + req.file.filename;
      nt.read(newfile, function (err, torrent) {
        var message = '';

        if (err) {
          message = 'Read torrent file faild';
          reject(message);
        } else {
          if (torrent.metadata.announce !== config.meanTorrentConfig.announce.url) {
            console.log(torrent.metadata.announce);
            message = 'ANNOUNCE_URL_ERROR';

            reject(message);
          }
          torrentinfo = torrent.metadata;
          torrentinfo.info_hash = torrent.infoHash();
          torrentinfo.filename = req.file.filename;
          resolve();
        }
      });
    });
  }

  function checkHash() {
    return new Promise(function (resolve, reject) {
      var message = '';

      if (torrentinfo.info_hash === '' || !torrentinfo.info_hash) {
        message = 'INFO_HASH_IS_EMPTY';
        reject(message);
      } else {
        Torrent.findOne({
          info_hash: torrentinfo.info_hash
        }).exec(function (err, torrent) {
          if (err) {
            reject(err);
          } else {
            if (torrent) {
              message = 'INFO_HASH_ALREADY_EXISTS';

              reject(message);
            } else {
              resolve();
            }
          }
        });
      }
    });
  }

};

/**
 * download a torrent file
 * @param req
 * @param res
 */
exports.download = function (req, res) {
  var torrent_data = null;
  var filePath = config.uploads.torrent.file.dest + req.torrent.torrent_filename;
  var stat = fs.statSync(filePath);

  fs.exists(filePath, function (exists) {
    if (exists) {
      getTorrentFileData(filePath)
        .then(function () {
          //var options = {
          //  root: path.join(__dirname, '../../../../'),
          //  headers: {
          //    'Content-Type': 'application/x-bittorrent',
          //    'Content-Disposition': 'attachment; filename=' + config.meanTorrentConfig.announce.announce_prefix + req.torrent.torrent_filename,
          //    'Content-Length': stat.size
          //  }
          //};
          //res.sendFile(filePath, options);

          res.set('Content-Type', 'application/x-bittorrent');
          res.set('Content-Disposition', 'attachment; filename=' + config.meanTorrentConfig.announce.announce_prefix + req.torrent.torrent_filename);
          res.set('Content-Length', stat.size);

          res.send(benc.encode(torrent_data));

          //res.writeHead(200, {
          //  'Content-Type': 'application/octet-stream',
          //  'Content-Disposition': 'attachment; filename=' + config.meanTorrentConfig.announce.announce_prefix + req.torrent.torrent_filename,
          //  'Content-Length': stat.size
          //});
          //fs.createReadStream(filePath).pipe(res);
        })
        .catch(function (err) {
          res.status(422).send(err);
        });
    } else {
      res.status(422).send({
        message: 'FILE_DOES_NOT_EXISTS'
      });
    }
  });

  function getTorrentFileData(file) {
    return new Promise(function (resolve, reject) {
      nt.read(file, function (err, torrent) {
        var message = '';

        if (err) {
          message = 'Read torrent file faild';
          reject(message);
        } else {
          var announce = config.meanTorrentConfig.announce.url + '/' + req.user.passkey;
          torrent.metadata.announce = announce;
          torrent_data = torrent.metadata;
          resolve();
        }
      });
    });
  }
};

/**
 * create a torrent
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var torrent = new Torrent(req.body);
  torrent.user = req.user;

  //console.log(torrent);

  //move temp torrent file to dest directory
  var oldPath = config.uploads.torrent.file.temp + req.body.torrent_filename;
  var newPath = config.uploads.torrent.file.dest + req.body.torrent_filename;
  move(oldPath, newPath, function (err) {
    if (err) {
      return res.status(422).send({
        message: 'MOVE_TORRENT_FILE_ERROR'
      });
    } else {
      torrent.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(torrent);
        }
      });
    }
  });

  function move(oldPath, newPath, callback) {
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        if (err.code === 'EXDEV') {
          copy();
        } else {
          callback(err);
        }
        return;
      }
      callback();
    });

    function copy() {
      var readStream = fs.createReadStream(oldPath);
      var writeStream = fs.createWriteStream(newPath);

      readStream.on('error', callback);
      writeStream.on('error', callback);

      readStream.on('close', function () {
        fs.unlink(oldPath, callback);
      });
      readStream.pipe(writeStream);
    }
  }
};

/**
 * read a torrent
 * @param req
 * @param res
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var torrent = req.torrent ? req.torrent.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  torrent.isCurrentUserOwner = !!(req.user && torrent.user && torrent.user._id.toString() === req.user._id.toString());

  res.json(torrent);
};

/**
 * update a torrent
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var torrent = req.torrent;

  //torrent.info_hash = req.body.info_hash;
  //torrent.tmdb_id = req.body.tmdb_id;

  torrent.resource_detail_info = req.body.resource_detail_info;

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);
    }
  });
};

/**
 * setSaleType
 * @param req
 * @param res
 */
exports.setSaleType = function (req, res) {
  var torrent = req.torrent;

  if (req.params.saleType) {
    var gbit = Math.ceil(torrent.torrent_size / config.meanTorrentConfig.torrentSalesType.expires.size);
    torrent.torrent_sale_status = req.params.saleType;
    torrent.torrent_sale_expires = Date.now() + gbit * config.meanTorrentConfig.torrentSalesType.expires.time;

    torrent.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(torrent);
      }
    });
  } else {
    return res.status(422).send({
      message: 'params saleType error'
    });
  }
};

/**
 * setRecommendLevel
 * @param req
 * @param res
 */
exports.setRecommendLevel = function (req, res) {
  var torrent = req.torrent;

  if (req.params.rlevel) {
    torrent.torrent_recommended = req.params.rlevel;
    torrent.orderedat = Date.now();

    torrent.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(torrent);
      }
    });
  } else {
    return res.status(422).send({
      message: 'params rlevel error'
    });
  }
};

/**
 * setReviewedStatus
 * @param req
 * @param res
 * @returns {*}
 */
exports.setReviewedStatus = function (req, res) {
  var torrent = req.torrent;

  torrent.torrent_status = 'reviewed';

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);
    }
  });
};

/**
 * delete a torrent
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  var torrent = req.torrent;

  //DELETE the torrent file
  var tfile = config.uploads.torrent.file.dest + req.torrent.torrent_filename;
  fs.unlinkSync(tfile);

  torrent.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);
    }
  });
};

/**
 * list all torrents
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  var skip = 0;
  var limit = 0;
  var status = 'reviewed';
  var rlevel = 'none';
  var stype = 'movie';
  var newest = false;
  var release = undefined;
  var userid = undefined;
  var tagsA = [];
  var keysA = [];

  var sort = 'torrent_recommended -orderedat -createdat';

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }
  if (req.query.torrent_status !== undefined) {
    status = req.query.torrent_status;
  }
  if (req.query.torrent_rlevel !== undefined) {
    rlevel = req.query.torrent_rlevel;
  }
  if (req.query.torrent_type !== undefined) {
    stype = req.query.torrent_type;
  }
  if (req.query.torrent_release !== undefined) {
    release = req.query.torrent_release;
  }
  if (req.query.newest !== undefined) {
    newest = (req.query.newest === 'true');
  }
  if (req.query.userid !== undefined) {
    userid = req.query.userid;
  }

  if (req.query.torrent_tags !== undefined) {
    var tagsS = req.query.torrent_tags + '';
    var tagsT = tagsS.split(',');

    tagsT.forEach(function (it) {
      tagsA.push(it + '');
    });
  }
  if (req.query.keys !== undefined && req.query.keys.length > 0) {
    var keysS = req.query.keys + '';
    var keysT = keysS.split(' ');

    keysT.forEach(function (it) {
      if (!isNaN(it)) {
        if (it > 1900 && it < 2050) {
          release = it;
        }
      } else {
        var ti = new RegExp(it, 'i');
        keysA.push(ti);
      }
    });
  }

  var condition = {};
  if (status !== 'all') {
    condition.torrent_status = status;
  }
  if (rlevel !== 'none') {
    condition.torrent_recommended = rlevel;
  }
  if (stype !== 'all') {
    condition.torrent_type = stype;
  }

  if (tagsA.length > 0) {
    condition.torrent_tags = {$all: tagsA};
  }
  if (release !== undefined) {
    condition['resource_detail_info.release_date'] = release;
  }
  if (keysA.length > 0) {
    condition.$or = [
      {torrent_filename: {'$all': keysA}},
      {'resource_detail_info.title': {'$all': keysA}},
      {'resource_detail_info.original_title': {'$all': keysA}}
    ];
  }
  if (userid !== undefined) {
    condition.user = userid;
  }

  console.log(JSON.stringify(condition));

  if (newest) {
    sort = '-createdat';
  }

  var countQuery = function (callback) {
    Torrent.count(condition, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var findQuery = function (callback) {
    Torrent.find(condition)
      .sort(sort)
      .populate('user', 'displayName')
      .skip(skip)
      .limit(limit)
      .exec(function (err, torrents) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, torrents);
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
 * Torrent middleware
 */
exports.torrentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'TORRENT_ID_INVALID'
    });
  }

  var findTorrents = function (callback) {
    Torrent.findById(id)
      .populate('user', 'displayName profileImageURL')
      .populate({
        path: '_replies.user',
        select: 'displayName profileImageURL uploaded downloaded',
        model: 'User'
      })
      .populate({
        path: '_replies._replies.user',
        select: 'displayName profileImageURL uploaded downloaded',
        model: 'User'
      })
      .populate({
        path: '_subtitles',
        populate: {
          path: 'user',
          select: 'displayName profileImageURL'
        }
      })
      .populate({
        path: '_peers',
        populate: {
          path: 'user',
          select: 'displayName profileImageURL'
        }
      })
      .exec(function (err, torrent) {
        if (err) {
          callback(err);
        } else if (!torrent) {
          callback(new Error('No torrent with that id has been found'));
        }
        callback(null, torrent);
      });
  };

  var findOtherTorrents = function (torrent, callback) {
    var condition = {
      torrent_status: 'reviewed',
      'resource_detail_info.id': torrent.resource_detail_info.id
    };

    console.log(condition);

    var fields = 'user torrent_filename torrent_tags torrent_seeds torrent_leechers torrent_finished torrent_seasons torrent_episodes torrent_size torrent_sale_status torrent_type torrent_sale_expires createdat';

    Torrent.find(condition, fields)
      .sort('-createdat')
      .populate('user', 'displayName')
      .exec(function (err, torrents) {
        if (err) {
          callback(err);
        } else {
          torrent._other_torrents.splice(0, torrent._other_torrents.length);
          torrents.forEach(function (t) {
            if (!t._id.equals(torrent._id)) {
              torrent._other_torrents.push(t.toJSON());
            }
          });
          callback(null, torrent);
        }
      });
  };

  async.waterfall([findTorrents, findOtherTorrents], function (err, torrent) {
    if (err) {
      next(err);
    } else {
      req.torrent = torrent;
      next();
    }
  });
};
