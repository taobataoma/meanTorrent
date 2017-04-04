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
  Torrent = mongoose.model('Torrent'),
  fs = require('fs'),
  nt = require('nt'),
  validator = require('validator'),
  tmdb = require('moviedb')(config.tmdbConfig.key);

/**
 * Create an article
 */
exports.movieinfo = function (req, res) {
  console.log('------- API: movieinfo --------------------');
  console.log(req.params);

  tmdb.movieInfo({
    id: req.params.tmdbid,
    language: req.params.language
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      tmdb.movieCredits({
        id: req.params.tmdbid,
        language: req.params.language
      }, function (err, cinfo) {
        if (!err) {
          info.credits = cinfo;
        }
        res.json(info);
      });
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
  var fileFiletr = require(path.resolve('./config/lib/multer')).torrentFileFilter;
  var torrentinfo = null;

  var storage = multer.diskStorage({
    destination: getUploadDestination,
    filename: createUploadFilename
  });

  var upload = multer({storage: storage}).single('newTorrentFile');
  upload.fileFilter = fileFiletr;

  if (user) {
    uploadFile()
      .then(checkAnnounce)
      .then(checkHash)
      .then(function () {
        res.status(200).send(torrentinfo);
      })
      .catch(function (err) {
        res.status(422).send(err);
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

          //reject(errorHandler.getErrorMessage(uploadError));
          reject(message);
        } else {
          resolve();
        }
      });
    });
  }

  function checkAnnounce() {
    return new Promise(function (resolve, reject) {
      var newfile = config.uploads.torrent.file.dest + req.file.filename;
      nt.read(newfile, function (err, torrent) {
        var message = '';

        if (err) {
          message = 'Read torrent file faild';
          reject(message);
        } else {
          if (!config.announce.open_tracker) {
            if (torrent.metadata.announce !== config.announce.url) {
              console.log(torrent.metadata.announce);
              message = 'ANNOUNCE_URL_ERROR';

              fs.unlink(newfile, function (unlinkError) {
                if (unlinkError) {
                  console.log(unlinkError);
                  message = 'Error occurred while deleting torrent file';
                  reject(message);
                }
              });
              reject(message);
            }
          }
          torrentinfo = torrent.metadata;
          torrentinfo.info_hash = torrent.infoHash();
          resolve();
        }
      });
    });
  }

  function checkHash() {
    return new Promise(function (resolve, reject) {
      var newfile = config.uploads.torrent.file.dest + req.file.filename;
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

              fs.unlink(newfile, function (unlinkError) {
                if (unlinkError) {
                  console.log(unlinkError);
                  message = 'Error occurred while deleting torrent file';
                  reject(message);
                }
              });

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
 * create a torrent
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var torrent = new Torrent(req.body);
  torrent.user = req.user;

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

  torrent.info_hash = req.body.info_hash;
  torrent.tmdb_id = req.body.tmdb_id;

  // ********** add other fileds value ***************

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

  if (req.query.skip !== undefined) {
    skip = req.query.skip;
  }
  if (req.query.limit !== undefined) {
    limit = req.query.limit;
  }
  if (req.query.status !== undefined) {
    status = req.query.status;
  }

  Torrent.find({'torrent_status': status}).sort('-createdat').populate('user', 'displayName').skip(skip).limit(limit).exec(function (err, torrents) {
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
 * Torrent middleware
 */
exports.torrentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'TORRENT_ID_INVALID'
    });
  }

  Torrent.findById(id).populate('user', 'displayName').exec(function (err, torrent) {
    if (err) {
      return next(err);
    } else if (!torrent) {
      return res.status(404).send({
        message: 'No torrent with that id has been found'
      });
    }
    req.torrent = torrent;
    next();
  });
};

