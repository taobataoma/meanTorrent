'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  moment = require('moment'),
  User = mongoose.model('User'),
  Maker = mongoose.model('Maker'),
  Peer = mongoose.model('Peer'),
  Subtitle = mongoose.model('Subtitle'),
  Thumb = mongoose.model('Thumb'),
  Rating = mongoose.model('Rating'),
  Torrent = mongoose.model('Torrent'),
  Complete = mongoose.model('Complete'),
  Forum = mongoose.model('Forum'),
  Topic = mongoose.model('Topic'),
  objectId = require('mongodb').ObjectId,
  fs = require('fs'),
  nt = require('nt'),
  benc = require('bncode'),
  scrape = require(path.resolve('./config/lib/scrape')),
  async = require('async'),
  validator = require('validator'),
  tmdb = require('moviedb')(config.meanTorrentConfig.tmdbConfig.key),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create,
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var traceConfig = config.meanTorrentConfig.trace;
var scoreConfig = config.meanTorrentConfig.score;
var thumbsUpScore = config.meanTorrentConfig.score.thumbsUpScore;
var ircConfig = config.meanTorrentConfig.ircAnnounce;
var vsprintf = require('sprintf-js').vsprintf;

var mtDebug = require(path.resolve('./config/lib/debug'));

const PEERSTATE_SEEDER = 'seeder';
const PEERSTATE_LEECHER = 'leecher';

/**
 * get movie info from tmdb
 */
exports.movieinfo = function (req, res) {
  mtDebug.debugGreen('------- API: movieinfo --------------------');
  mtDebug.debugGreen(req.params);

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
  mtDebug.debugGreen('------- API: tvinfo --------------------');
  mtDebug.debugGreen(req.params);

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
            mtDebug.debugRed(err);
            mtDebug.debugRed('ERROR: DELETE TEMP TORRENT FILE: ' + newfile);
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
      mtDebug.debugGreen(req.file.filename);
      var newfile = config.uploads.torrent.file.temp + req.file.filename;
      nt.read(newfile, function (err, torrent) {
        var message = '';

        if (err) {
          message = 'Read torrent file faild';
          reject(message);
        } else {
          if (config.meanTorrentConfig.announce.privateTorrentCmsMode) {
            if (torrent.metadata.announce !== config.meanTorrentConfig.announce.url) {
              mtDebug.debugGreen(torrent.metadata.announce);
              message = 'ANNOUNCE_URL_ERROR';

              reject(message);
            }
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
 * uploadTorrentCover
 * @param req
 * @param res
 */
exports.uploadTorrentCover = function (req, res) {
  var user = req.user;
  var createUploadCoverImageFilename = require(path.resolve('./config/lib/multer')).createUploadCoverImageFilename;
  var getUploadCoverImageDestination = require(path.resolve('./config/lib/multer')).getUploadCoverImageDestination;
  var fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var coverInfo = {};

  var storage = multer.diskStorage({
    destination: getUploadCoverImageDestination,
    filename: createUploadCoverImageFilename
  });

  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: config.uploads.torrent.cover.limits
  }).single('newTorrentCoverFile');

  if (user) {
    uploadFile()
      .then(function () {
        res.status(200).send(coverInfo);
      })
      .catch(function (err) {
        res.status(422).send(err);
        mtDebug.debugRed(err);

        if (req.file && req.file.filename) {
          var newfile = config.uploads.torrent.cover.temp + req.file.filename;
          if (fs.existsSync(newfile)) {
            mtDebug.debugRed(err);
            mtDebug.debugRed('ERROR: DELETE TEMP COVER FILE: ' + newfile);
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
            message = 'Cover image file too large. Maximum size allowed is ' + (config.uploads.torrent.cover.limits.fileSize / (1024 * 1024)).toFixed(2) + ' Mb files.';
          }

          reject(message);
        } else {
          coverInfo.filename = req.file.filename;
          resolve();
        }
      });
    });
  }
};

/**
 * uploadTorrentImage
 * @param req
 * @param res
 */
exports.uploadTorrentImage = function (req, res) {
  var user = req.user;
  var createUploadTorrentImageFilename = require(path.resolve('./config/lib/multer')).createUploadTorrentImageFilename;
  var getUploadTorrentImageDestination = require(path.resolve('./config/lib/multer')).getUploadTorrentImageDestination;
  var fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var imageInfo = {};

  var storage = multer.diskStorage({
    destination: getUploadTorrentImageDestination,
    filename: createUploadTorrentImageFilename
  });

  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: config.uploads.torrent.cover.limits
  }).single('newTorrentImageFile');

  if (user) {
    uploadFile()
      .then(function () {
        res.status(200).send(imageInfo);
      })
      .catch(function (err) {
        res.status(422).send(err);
        mtDebug.debugRed(err);

        if (req.file && req.file.filename) {
          var newfile = config.uploads.torrent.image.temp + req.file.filename;
          if (fs.existsSync(newfile)) {
            mtDebug.debugRed(err);
            mtDebug.debugRed('ERROR: DELETE TEMP TORRENT IMAGE FILE: ' + newfile);
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
            message = 'Torrent image file too large. Maximum size allowed is ' + (config.uploads.torrent.image.limits.fileSize / (1024 * 1024)).toFixed(2) + ' Mb files.';
          }

          reject(message);
        } else {
          imageInfo.filename = req.file.filename;
          resolve();
        }
      });
    });
  }
};

/**
 * announceEdit
 * @param req
 * @param res
 */
exports.announceEdit = function (req, res) {
  var user = req.user;
  var createUploadFilename = require(path.resolve('./config/lib/multer')).createUploadFilename;
  var getUploadDestination = require(path.resolve('./config/lib/multer')).getUploadDestination;
  var fileFilter = require(path.resolve('./config/lib/multer')).torrentFileFilter;
  var torrent_data = null;

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
      .then(function () {
        var filePath = config.uploads.torrent.file.temp + req.file.filename;
        var stat = fs.statSync(filePath);

        fs.exists(filePath, function (exists) {
          if (exists) {
            getTorrentFileData(filePath)
              .then(function () {
                res.set('Content-Type', 'application/x-bittorrent');
                res.set('Content-Disposition', 'attachment; filename=' + encodeURI(req.file.filename));
                res.set('Content-Length', stat.size);

                res.send(benc.encode(torrent_data));
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
      })
      .catch(function (err) {

        res.status(422).send(err);

        if (req.file && req.file.filename) {
          var newfile = config.uploads.torrent.file.temp + req.file.filename;
          if (fs.existsSync(newfile)) {
            mtDebug.debugRed(err);
            mtDebug.debugRed('ERROR: DELETE TEMP TORRENT FILE: ' + newfile);
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

  function getTorrentFileData(file) {
    return new Promise(function (resolve, reject) {
      nt.read(file, function (err, torrent) {
        var message = '';

        if (err) {
          message = 'Read torrent file faild';
          reject(message);
        } else {
          var announce = config.meanTorrentConfig.announce.url;
          torrent.metadata.announce = announce;
          torrent.metadata.comment = req.query.comment;
          torrent_data = torrent.metadata;
          resolve();
        }
      });
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
          res.set('Content-Type', 'application/x-bittorrent');
          res.set('Content-Disposition', 'attachment; filename=' + config.meanTorrentConfig.announce.announcePrefix + encodeURI(req.torrent.torrent_filename));
          res.set('Content-Length', stat.size);

          res.send(benc.encode(torrent_data));
        })
        .catch(function (err) {
          mtDebug.debugRed(err);
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
          if (config.meanTorrentConfig.announce.privateTorrentCmsMode) {
            var announce = config.meanTorrentConfig.announce.url + '/' + req.user.passkey;
            torrent.metadata.announce = announce;
          }
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
  mtDebug.debugGreen(req.body);

  torrent.user = req.user;

  //replace content path
  var tmp = config.uploads.torrent.image.temp.substr(1);
  var dst = config.uploads.torrent.image.dest.substr(1);

  var regex = new RegExp(tmp, 'g');
  torrent.resource_detail_info.overview = torrent.resource_detail_info.overview.replace(regex, dst);

  mtDebug.debugGreen(torrent);

  //move temp torrent file to dest directory
  var oldPath = config.uploads.torrent.file.temp + req.body.torrent_filename;
  var newPath = config.uploads.torrent.file.dest + req.body.torrent_filename;
  move(oldPath, newPath, function (err) {
    if (err) {
      return res.status(422).send({
        message: 'MOVE_TORRENT_FILE_ERROR'
      });
    } else {
      //move temp cover image file to dest directory
      if (req.body.resource_detail_info.cover) {
        var cv = req.body.resource_detail_info.cover;
        var oc = config.uploads.torrent.cover.temp + cv;
        var nc = config.uploads.torrent.cover.dest + cv;
        copy(oc, nc, function (err) {
          if (err) {
            mtDebug.debugRed(err);
          }

          if (req.body._uImage.indexOf(cv) < 0) {
            fs.unlink(oc);
          }
        });

        //move temp torrent image file to dest directory
        req.body._uImage.forEach(function (f) {
          var oi = config.uploads.torrent.image.temp + f;
          var ni = config.uploads.torrent.image.dest + f;
          move(oi, ni, function (err) {
            if (err) {
              mtDebug.debugRed(err);
            }
          });
        });
      }

      torrent.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(torrent);

          scoreUpdate(req, req.user, scoreConfig.action.uploadTorrent);

          //update user uptotal fields
          req.user.update({
            $inc: {uptotal: 1}
          }).exec();
          //update maker torrent count
          if (torrent.maker) {
            Maker.update({_id: torrent.maker}, {
              $inc: {torrent_count: 1}
            }).exec();
          }

          //scrape torrent status info in public cms mode
          if (!config.meanTorrentConfig.announce.privateTorrentCmsMode && config.meanTorrentConfig.scrapeTorrentStatus.onTorrentUpload) {
            scrape.doScrape(torrent, function (err, result) {
              if (err) {
                mtDebug.debugRed(err);
              }
            });
          }
        }
      });
    }
  });

  function copy(oldPath, newPath, callback) {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
      callback();
    });
    readStream.pipe(writeStream);
  }

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
 * scrape
 * scrape torrent status info in public cms mode
 * @param req
 * @param res
 */
exports.scrape = function (req, res) {
  if (!config.meanTorrentConfig.announce.privateTorrentCmsMode) {
    scrape.doScrape(req.torrent, function (err, result) {
      if (err) {
        mtDebug.debugRed(err);
        return res.status(422).send({
          message: err
        });
      }
      if (result && result.length === 1) {
        res.json(result[0]);
      }
    });
  } else {
    return res.status(422).send({
      message: 'privateTorrentCmsMode do not support scrape method'
    });
  }
};

/**
 * toggleHnRStatus
 * @param req
 * @param res
 */
exports.toggleHnRStatus = function (req, res) {
  var torrent = req.torrent;

  torrent.torrent_hnr = !torrent.torrent_hnr;

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);

      //remove the complete data and update user`s warning number when the H&R prop to false
      if (!torrent.torrent_hnr)
        removeTorrentHnRWarning(torrent._id);
    }
  });
};

/**
 * toggleVIPStatus
 * @param req
 * @param res
 */
exports.toggleVIPStatus = function (req, res) {
  var torrent = req.torrent;

  torrent.torrent_vip = !torrent.torrent_vip;

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
 * removeTorrentHnRWarning
 * @param torrent
 */
function removeTorrentHnRWarning(tid) {
  Complete.find({
    torrent: tid
  })
    .populate('user')
    .exec(function (err, cs) {
      if (!err && cs) {
        cs.forEach(function (c) {
          if (c.hnr_warning) {
            c.removeHnRWarning(c.user);
          }
        });
      }
    });
}

/**
 * thumbsUp
 * @param req
 * @param res
 */
exports.thumbsUp = function (req, res) {
  var user = req.user;
  var exist = false;
  var torrent = req.torrent;
  var thumb = new Thumb();
  thumb.user = req.user;
  thumb.score = thumbsUpScore.torrent;

  //check if already exist
  exist = false;
  torrent._thumbs.forEach(function (sr) {
    if (sr.user._id.equals(req.user._id)) {
      exist = true;
    }
  });
  if (exist) {
    return res.status(422).send({
      message: 'ALREADY_THUMBS_UP'
    });
  } else {
    if (req.user.score >= thumbsUpScore.torrent) {
      torrent._thumbs.push(thumb);
      torrent.user.update({
        $inc: {score: thumbsUpScore.torrent}
      }).exec();
      save();
    } else {
      return res.status(422).send({
        message: 'SCORE_NOT_ENOUGH'
      });
    }
  }

  function save() {
    torrent.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(torrent);
      }
    });

    user.update({
      $inc: {score: -thumbsUpScore.torrent}
    }).exec();
  }
};

/**
 * rating
 * @param req
 * @param res
 */
exports.rating = function (req, res) {
  var user = req.user;
  var exist = false;
  var torrent = req.torrent;
  var rat = new Rating();
  rat.user = req.user;
  rat.vote = req.query.vote;

  mtDebug.debugGreen(rat);
  //check if already exist
  exist = false;
  torrent._ratings.forEach(function (r) {
    if (r.user._id.equals(user._id)) {
      exist = true;
    }
  });
  if (exist) {
    return res.status(422).send({
      message: 'ALREADY_RATING'
    });
  } else {
    torrent._ratings.push(rat);

    mtDebug.debugGreen(torrent.resource_detail_info);
    torrent.resource_detail_info.vote_count = parseInt(torrent.resource_detail_info.vote_count, 10) + 1;
    torrent.resource_detail_info.vote_total = parseInt(torrent.resource_detail_info.vote_total, 10) + rat.vote;
    torrent.resource_detail_info.vote_average = Math.floor((torrent.resource_detail_info.vote_total / torrent.resource_detail_info.vote_count) * 10) / 10;
    mtDebug.debugGreen(torrent.resource_detail_info);

    torrent.markModified('resource_detail_info');

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

        //create trace log
        traceLogCreate(req, traceConfig.action.AdminTorrentSetSaleType, {
          torrent: torrent._id,
          sale_status: req.params.saleType
        });
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

        scoreUpdate(req, torrent.user, scoreConfig.action.uploadTorrentBeRecommend);
        //create trace log
        traceLogCreate(req, traceConfig.action.AdminTorrentSetRecommendLevel, {
          torrent: torrent._id,
          recommended: req.params.rlevel
        });
      }
    });
  } else {
    return res.status(422).send({
      message: 'params rlevel error'
    });
  }
};

/**
 * setTorrentTags
 * @param req
 * @param res
 */
exports.setTorrentTags = function (req, res) {
  var torrent = req.torrent;

  if (req.body.tags) {
    torrent.torrent_tags = req.body.tags;

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
      message: 'params tags error'
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

      //irc announce
      if (ircConfig.enable) {
        var msg = '';
        var client = req.app.get('ircClient');

        if (torrent.torrent_type === 'tvserial') {
          msg = vsprintf(ircConfig.tvserialMsgFormat, [
            torrent.user.displayName,
            torrent.torrent_filename,
            torrent.torrent_type,
            torrent.torrent_size,
            torrent.torrent_seasons,
            torrent.torrent_episodes,
            torrent.torrent_sale_status,
            moment().format('YYYY-MM-DD HH:mm:ss')
          ]);
        } else {
          msg = vsprintf(ircConfig.defaultMsgFormat, [
            torrent.user.displayName,
            torrent.torrent_filename,
            torrent.torrent_type,
            torrent.torrent_size,
            torrent.torrent_sale_status,
            moment().format('YYYY-MM-DD HH:mm:ss')
          ]);
        }
        client.notice(ircConfig.channel, msg);
      }

      //create trace log
      traceLogCreate(req, traceConfig.action.AdminTorrentSetReviewedStatus, {
        torrent: torrent._id,
        status: 'reviewed'
      });
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
  fs.exists(tfile, function (exists) {
    if (exists) {
      fs.unlinkSync(tfile);
    }
  });

  //update users seed/leech number
  Peer.find({
    torrent: torrent._id
  })
    .populate('user')
    .exec(function (err, ps) {
      ps.forEach(function (p) {
        if (p.user && p.peer_status === PEERSTATE_SEEDER) {
          p.user.update({
            $inc: {seeded: -1}
          }).exec();
        }
        if (p.user && p.peer_status === PEERSTATE_LEECHER) {
          p.user.update({
            $inc: {leeched: -1}
          }).exec();
        }
      });
    });

  //remove all peers of the torrent
  Peer.remove({
    torrent: torrent._id
  });
  //remove all subtitle of the torrent
  Subtitle.remove({
    torrent: torrent._id
  });
  //update maker torrent count
  if (torrent.maker) {
    torrent.maker.update({
      $inc: {torrent_count: -1}
    }).exec();
  }

  //update user uptotal fields
  torrent.user.update({
    $inc: {uptotal: -1}
  }).exec();

  //remove the complete data and update user`s warning number if the torrent has H&R prop
  removeTorrentHnRWarning(torrent._id);
  Complete.remove({
    torrent: torrent._id
  });

  torrent.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);

      scoreUpdate(req, torrent.user, scoreConfig.action.uploadTorrentBeDeleted);
      //create trace log
      traceLogCreate(req, traceConfig.action.AdminTorrentDelete, {
        torrent: torrent._id
      });
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
  var hnr = false;
  var vip = undefined;
  var release = undefined;
  var userid = undefined;
  var maker = undefined;
  var tagsA = [];
  var keysA = [];

  //var sort = 'torrent_recommended -orderedat -createdat';
  var sort = {torrent_recommended: 1, orderedat: -1, createdat: -1};

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }
  if (req.query.sort !== undefined) {
    sort = JSON.parse(req.query.sort);
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
  if (req.query.torrent_hnr !== undefined) {
    hnr = req.query.torrent_hnr;
  }
  if (req.query.torrent_vip !== undefined) {
    vip = req.query.torrent_vip;
  }
  if (req.query.newest !== undefined) {
    newest = (req.query.newest === 'true');
  }
  if (req.query.userid !== undefined) {
    userid = objectId(req.query.userid);
  }
  if (req.query.maker !== undefined) {
    maker = objectId(req.query.maker);
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
  if (hnr === 'true') {
    condition.torrent_hnr = true;
  }
  if (vip === 'true') {
    condition.torrent_vip = true;
  } else if (vip === undefined) {
    condition.torrent_vip = false;
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
  if (maker !== undefined) {
    condition.maker = maker;
  }

  mtDebug.debugGreen(JSON.stringify(condition));
  mtDebug.debugGreen(sort);

  if (newest) {
    //sort = '-createdat';
    sort = {createdat: -1};
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
    //Torrent.find(condition)
    //  .sort(sort)
    //  .populate('user', 'username displayName isVip')
    //  .populate('maker', 'name')
    //  .skip(skip)
    //  .limit(limit)
    //  .exec(function (err, torrents) {
    //    if (err) {
    //      callback(err, null);
    //    } else {
    //      callback(null, torrents);
    //    }
    //  });

    var query = Torrent.aggregate([
      {'$match': condition},
      {'$sort': sort},
      {'$skip': skip},
      {'$limit': limit},
      {
        '$lookup': {
          from: 'peers',
          localField: '_id',
          foreignField: 'torrent',
          as: 't_peer'
        }
      },
      {
        '$addFields': {
          'my_peers': {
            '$filter': {
              'input': '$t_peer',
              'as': 'p',
              'cond': {'$eq': ['$$p.user', req.user._id]}
            }
          }
        }
      },
      {
        '$project': {
          't_peer': 0
        }
      }
    ]);

    if (limit === 0) {
      let i = query._pipeline.length;
      while (i--) {
        if (Object.keys(query._pipeline[i])[0] === '$limit') {
          query._pipeline.splice(i, 1);
          break;
        }
      }
    }

    query.exec(function (err, torrents) {
      if (err) {
        callback(err, null);
      } else {
        Torrent.populate(torrents,
          [
            {path: 'user', select: 'username displayName isVip'},
            {path: 'maker', select: 'name'}
          ], function (err, ts) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              callback(null, ts);
            }
          });
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
 * siteInfo - get site torrent info, seeders/leechers/torrents count/users etc.
 * @param req
 * @param res
 */
exports.siteInfo = function (req, res) {
  var countUsers = function (callback) {
    User.count(function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countVipUsers = function (callback) {
    User.count({isVip: true}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countTorrents = function (callback) {
    Torrent.count(function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var totalUpDown = function (callback) {
    User.aggregate({
      $group: {
        _id: null,
        uploaded: {$sum: '$uploaded'},
        downloaded: {$sum: '$downloaded'}
      }
    }).exec(function (err, total) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, total);
      }
    });
  };

  var totalTorrentsSize = function (callback) {
    Torrent.aggregate({
      $group: {
        _id: null,
        size: {$sum: '$torrent_size'},
        seeders: {$sum: '$torrent_seeds'},
        leechers: {$sum: '$torrent_leechers'}
      }
    }).exec(function (err, total) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, total);
      }
    });
  };

  var countForumTopics = function (callback) {
    Topic.count(function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var totalForumReplies = function (callback) {
    Topic.aggregate({
      $group: {
        _id: null,
        replies: {$sum: '$replyCount'}
      }
    }).exec(function (err, total) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, total);
      }
    });
  };

  async.parallel([countUsers, countTorrents, totalTorrentsSize, totalUpDown, countForumTopics, totalForumReplies, countVipUsers], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({
        totalUsers: results[0],
        totalTorrents: results[1],
        totalTorrentsSize: results[2][0] ? results[2][0].size : 0,
        totalSeeders: results[2][0] ? results[2][0].seeders : 0,
        totalLeechers: results[2][0] ? results[2][0].leechers : 0,
        totalUploaded: results[3][0] ? results[3][0].uploaded : 0,
        totalDownloaded: results[3][0] ? results[3][0].downloaded : 0,
        totalForumTopics: results[4],
        totalForumReplies: results[5][0] ? results[5][0].replies : 0,
        totalVipUsers: results[6]
      });
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
      .populate('user', 'username displayName profileImageURL isVip')
      .populate('maker', 'name')
      .populate('_thumbs.user', 'username displayName profileImageURL isVip uploaded downloaded')
      .populate('_ratings.user', 'username displayName profileImageURL isVip uploaded downloaded')
      .populate({
        path: '_replies.user',
        select: 'username displayName profileImageURL isVip uploaded downloaded',
        model: 'User'
      })
      .populate({
        path: '_replies._replies.user',
        select: 'username displayName profileImageURL isVip uploaded downloaded',
        model: 'User'
      })
      .populate({
        path: '_subtitles',
        populate: {
          path: 'user',
          select: 'username displayName profileImageURL isVip'
        }
      })
      .populate({
        path: '_peers',
        populate: {
          path: 'user',
          select: 'username displayName profileImageURL isVip'
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
    if (torrent.resource_detail_info.id) {
      var condition = {
        torrent_status: 'reviewed',
        'resource_detail_info.id': torrent.resource_detail_info.id
      };

      mtDebug.debugGreen(condition);

      var fields = 'user maker torrent_filename torrent_tags torrent_seeds torrent_leechers torrent_finished torrent_seasons torrent_episodes torrent_size torrent_sale_status torrent_type torrent_hnr torrent_vip torrent_sale_expires createdat';

      Torrent.find(condition, fields)
        .sort('-createdat')
        .populate('user', 'username displayName isVip')
        .populate('maker', 'name')
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
    } else {
      callback(null, torrent);
    }
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
