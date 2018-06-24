'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  common = require(path.resolve('./config/lib/common')),
  mediaInfo = require(path.resolve('./config/lib/mediaInfo')),
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
  Request = mongoose.model('Request'),
  Favorite = mongoose.model('Favorite'),
  objectId = require('mongodb').ObjectId,
  sharp = require('sharp'),
  fs = require('fs'),
  nt = require('nt'),
  benc = require('bncode'),
  async = require('async'),
  tmdb = require('moviedb')(config.meanTorrentConfig.tmdbConfig.key),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create,
  mtRSS = require(path.resolve('./config/lib/mtRSS')),
  populateStrings = require(path.resolve('./config/lib/populateStrings')),
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var traceConfig = config.meanTorrentConfig.trace;
var scoreConfig = config.meanTorrentConfig.score;
var ircConfig = config.meanTorrentConfig.ircAnnounce;
var itemsPerPageConfig = config.meanTorrentConfig.itemsPerPage;
var vsprintf = require('sprintf-js').vsprintf;

var mtDebug = require(path.resolve('./config/lib/debug'));
var serverMessage = require(path.resolve('./config/lib/server-message'));
var serverNoticeConfig = config.meanTorrentConfig.serverNotice;
var announceConfig = config.meanTorrentConfig.announce;
var appConfig = config.meanTorrentConfig.app;
var tmdbConfig = config.meanTorrentConfig.tmdbConfig;
var accessConfig = config.meanTorrentConfig.access;

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
    language: tmdbConfig.resourcesLanguage,
    append_to_response: 'credits,images,alternative_titles,release_dates',
    include_image_language: tmdbConfig.resourcesLanguage + ',null'
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      var condition = {
        'resource_detail_info.id': parseInt(req.params.tmdbid, 10)
      };

      var sInfo = {
        info: info
      };

      Torrent.find(condition, populateStrings.populate_torrent_string)
        .sort('-createdat')
        .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
        .populate('maker', 'name')
        .exec(function (err, torrents) {
          if (err || !torrents) {
            res.json(sInfo);
          } else {
            if (torrents) {
              sInfo.torrents = torrents;
              res.json(sInfo);
            }
          }
        });
    }
  });
};

/**
 * searchmovie
 * @param req
 * @param res
 */
exports.searchmovie = function (req, res) {
  mtDebug.debugGreen('------- API: searchMovie --------------------');
  mtDebug.debugGreen(req.params);

  var type = req.query.type;

  if (type === 'movie') {
    tmdb.searchMovie({
      language: tmdbConfig.resourcesLanguage,
      query: req.query.query
    }, function (err, info) {
      if (err) {
        res.status(900).send(err);
      } else {
        res.json(info);
      }
    });
  } else if (type === 'tvserial') {
    tmdb.searchTv({
      language: tmdbConfig.resourcesLanguage,
      query: req.query.query
    }, function (err, info) {
      if (err) {
        res.status(900).send(err);
      } else {
        res.json(info);
      }
    });
  }
};

/**
 * get tv info from tmdb
 */
exports.tvinfo = function (req, res) {
  mtDebug.debugGreen('------- API: tvinfo --------------------');
  mtDebug.debugGreen(req.params);

  tmdb.tvInfo({
    id: req.params.tmdbid,
    language: tmdbConfig.resourcesLanguage,
    append_to_response: 'credits,images,alternative_titles',
    include_image_language: tmdbConfig.resourcesLanguage + ',null'
  }, function (err, info) {
    if (err) {
      res.status(900).send(err);
    } else {
      var condition = {
        'resource_detail_info.id': parseInt(req.params.tmdbid, 10)
      };

      var sInfo = {
        info: info
      };

      Torrent.find(condition, populateStrings.populate_torrent_string)
        .sort('-createdat')
        .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
        .populate('maker', 'name')
        .exec(function (err, torrents) {
          if (err || !torrents) {
            res.json(sInfo);
          } else {
            console.log(torrents);
            if (torrents) {
              sInfo.torrents = torrents;
              res.json(sInfo);
            }
          }
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
      .then(checkCanUpload)
      .then(function () {
        res.status(200).send(torrentinfo);
      })
      .catch(function (err) {
        res.status(422).send({
          message: err.message,
          params: err.params
        });

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

          reject({message: message, params: {filename: uploadError.filename}});
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
          mtDebug.debugError(err, 'READ_TORRENT_FILE_FAILD');
          message = 'SERVER.READ_TORRENT_FILE_FAILD';
          reject({message: message});
        } else {
          //force change announce url to config value
          var announce = config.meanTorrentConfig.announce.url;

          //Prevent metadata.announce is failure
          if (!!torrent.metadata['announce-list']) {
            delete torrent.metadata['announce-list'];
          }
          torrent.metadata.announce = announce;
          torrent.metadata.comment = config.meanTorrentConfig.announce.comment;

          //Add filed "private" into the torrent file and set it true to
          //transform a public torrent into a private one.
          torrent.metadata.info.private = 1;
          //Add filed "sourceInto" the torrent file to distingush it
          //from the uploaded file which may be downloaded directly from
          //other private tracker, avoiding to be treated as cheating at
          //the original tracker.
          var sourceInfo = config.meanTorrentConfig.announce.sourceInfo;
          torrent.metadata.info.sourceInfo = sourceInfo;
          torrent.metadata.info.source = appConfig.name;

          var cws = fs.createWriteStream(newfile);
          cws.write(benc.encode(torrent.metadata));
          cws.end();

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
        message = 'SERVER.INFO_HASH_IS_EMPTY';
        reject({message: message});
      } else {
        Torrent.findOne({
          info_hash: torrentinfo.info_hash
        }).exec(function (err, torrent) {
          if (err) {
            reject(err);
          } else {
            if (torrent) {
              message = 'SERVER.INFO_HASH_ALREADY_EXISTS';

              reject({message: message, params: {hash: torrentinfo.info_hash}});
            } else {
              resolve();
            }
          }
        });
      }
    });
  }

  function checkCanUpload() {
    return new Promise(function (resolve, reject) {
      if (!accessConfig.upload.limitToMakerGroup) {
        resolve();
      } else {
        if (req.user.makers.length > 0) {
          resolve();
        } else {
          reject('SERVER.UPLOAD_ACCESS_DENY');
        }
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
    limits: config.uploads.torrent.image.limits
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

        fs.exists(filePath, function (exists) {
          if (exists) {
            var stat = fs.statSync(filePath);
            getTorrentFileData(filePath)
              .then(function () {
                res.set('Content-Type', 'application/x-bittorrent');
                res.set('Content-Disposition', 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(req.file.filename));
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
          mtDebug.debugError(err, 'READ_TORRENT_FILE_FAILD');
          message = 'SERVER.READ_TORRENT_FILE_FAILD';
          reject(message);
        } else {
          var announce = config.meanTorrentConfig.announce.url;
          //Prevent metadata.announce is failure
          if (!!torrent.metadata['announce-list']) {
            delete torrent.metadata['announce-list'];
          }
          torrent.metadata.announce = announce;
          torrent.metadata.comment = req.query.comment;

          //Add filed "private" into the torrent file and set it true to
          //transform a public torrent into a private one.
          torrent.metadata.info.private = 1;
          //Add filed "sourceInto" the torrent file to distingush it
          //from the uploaded file which may be downloaded directly from
          //other private tracker, avoiding to be treated as cheating at
          //the original tracker.
          var sourceInfo = config.meanTorrentConfig.announce.sourceInfo;
          torrent.metadata.info.sourceInfo = sourceInfo;
          torrent.metadata.info.source = appConfig.name;

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

  var user = req.user || req.passkeyuser || undefined;

  if (user) {
    if (req.torrent.torrent_vip && !user.isVip && !user.isOper) {
      return res.status(701).send({
        message: 'SERVER.ONLY_VIP_CAN_DOWNLOAD'
      });
    } else if (user.status === 'banned') {
      return res.status(702).send({
        message: 'SERVER.CAN_NOT_DOWNLOAD_BANNED'
      });
    } else if (user.status === 'idle') {
      return res.status(703).send({
        message: 'SERVER.CAN_NOT_DOWNLOAD_IDLE'
      });
    } else if (req.torrent.torrent_status !== 'reviewed' && !user._id.equals(req.torrent.user._id)) {
      return res.status(704).send({
        message: 'SERVER.TORRENT_STATUS_ERROR'
      });
    } else {
      fs.exists(filePath, function (exists) {
        if (exists) {
          var stat = fs.statSync(filePath);
          getTorrentFileData(filePath)
            .then(function () {
              res.set('Content-Type', 'application/x-bittorrent');
              res.set('Content-Disposition', 'attachment; filename*=UTF-8\'\'' + config.meanTorrentConfig.announce.announcePrefix + encodeURIComponent(req.torrent.torrent_filename));
              res.set('Content-Length', stat.size);

              res.send(benc.encode(torrent_data));
            })
            .catch(function (err) {
              mtDebug.debugRed(err);
              res.status(422).send(err);
            });
        } else {
          res.status(422).send({
            message: 'SERVER.FILE_DOES_NOT_EXISTS'
          });
        }
      });
    }
  } else {
    return res.status(403).json({
      message: 'SERVER.USER_IS_NOT_AUTHORIZED'
    });
  }

  function getTorrentFileData(file) {
    return new Promise(function (resolve, reject) {
      nt.read(file, function (err, torrent) {
        var message = '';

        if (err) {
          mtDebug.debugError(err, 'READ_TORRENT_FILE_FAILD');
          message = 'SERVER.READ_TORRENT_FILE_FAILD';
          reject(message);
        } else {
          var announce = config.meanTorrentConfig.announce.url + '/' + user.passkey;
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
  var reqId = req.body.reqId;
  //mtDebug.debugGreen(req.body);

  torrent.user = req.user;

  //get media info detail
  if (torrent.torrent_nfo) {
    torrent.torrent_media_info = mediaInfo.getMediaInfo(torrent.torrent_nfo);
  }

  //replace content path
  var tmp = config.uploads.torrent.image.temp.substr(1);
  var dst = config.uploads.torrent.image.dest.substr(1);

  var regex = new RegExp(tmp, 'g');
  torrent.resource_detail_info.overview = torrent.resource_detail_info.overview.replace(regex, dst);

  //mtDebug.debugGreen(torrent);

  //move temp torrent file to dest directory
  var oldPath = config.uploads.torrent.file.temp + req.body.torrent_filename;
  var newPath = config.uploads.torrent.file.dest + req.body.torrent_filename;
  move(oldPath, newPath, function (err) {
    if (err) {
      mtDebug.debugError(err, 'MOVE_TORRENT_FILE_ERROR');
      return res.status(422).send({
        message: 'SERVER.MOVE_TORRENT_FILE_ERROR'
      });
    } else {
      //move temp cover image file to dest directory
      if (req.body.resource_detail_info.cover) {
        var cv = req.body.resource_detail_info.cover;
        var oc = config.uploads.torrent.cover.temp + cv;
        var nc = config.uploads.torrent.cover.dest + cv;
        var cc = config.uploads.torrent.cover.crop + cv;
        copy(oc, nc, function (err) {
          if (err) {
            mtDebug.debugRed(err);
          } else {
            sharp(nc)
              .resize(500)
              .toFile(cc, function (err) {
                if (err) {
                  mtDebug.debugError(err);
                } else {
                  torrent.resource_detail_info.cover_crop = true;
                  torrent.markModified('resource_detail_info');
                  torrent.save();
                }
              });
          }

          if (req.body._uImage.indexOf(cv) < 0 && req.body.screenshots_image.indexOf(cv) < 0) {
            fs.unlinkSync(oc);
          }
        });
      }

      //move temp torrent image file to dest directory
      if (req.body._uImage && req.body._uImage.length > 0) {
        req.body._uImage.forEach(function (f) {
          var oi = config.uploads.torrent.image.temp + f;
          var ni = config.uploads.torrent.image.dest + f;
          var ci = config.uploads.torrent.image.crop + f;

          move(oi, ni, function (err) {
            if (err) {
              mtDebug.debugRed(err);
            } else {
              sharp(ni)
                .resize(400)
                .toFile(ci, function (err) {
                  if (err) {
                    mtDebug.debugError(err);
                  }
                });
            }
          });
        });
      }

      //move temp torrent resource screenshots image file to dest directory
      if (req.body.screenshots_image && req.body.screenshots_image.length > 0) {
        req.body.screenshots_image.forEach(function (f, key) {
          if (!f.startsWith('http://') && !f.startsWith('https://')) {
            var os = config.uploads.torrent.image.temp + f;
            var ns = config.uploads.torrent.image.dest + f;
            var cs = config.uploads.torrent.image.crop + f;

            torrent.screenshots_image[key] = dst + f;

            move(os, ns, function (err) {
              if (err) {
                mtDebug.debugRed(err);
              } else {
                sharp(ns)
                  .resize(400)
                  .toFile(cs, function (err) {
                    if (err) {
                      mtDebug.debugError(err);
                    }
                  });
              }
            });
          }
        });
      }

      torrent.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(torrent);

          //update user uptotal fields
          req.user.update({
            $inc: {uptotal: 1}
          }).exec();
          //update maker torrent count
          var act = scoreConfig.action.uploadTorrent;
          act.params = {
            tid: torrent._id
          };

          if (torrent.maker) {
            Maker.update({_id: torrent.maker}, {
              $inc: {torrent_count: 1}
            }).exec();

            //set status to reviewed when maker upload access is pass
            Maker.findOne({
              _id: torrent.maker,
              upload_access: 'pass'
            }, function (err, m) {
              if (!err && m) {
                torrent.update({torrent_status: 'reviewed'}).exec();
                announceTorrentToIRC(torrent, req);
                scoreUpdate(req, req.user, act);
              }
            });
          } else {
            //set status to reviewed when user upload access is pass
            if (req.user.upload_access === 'pass') {
              torrent.update({torrent_status: 'reviewed'}).exec();
              announceTorrentToIRC(torrent, req);
              scoreUpdate(req, req.user, act);
            }
          }

          //write request data if reqId is not undefined and send server notice
          if (reqId) {
            Request.findOneAndUpdate({_id: reqId}, {
              $addToSet: {torrents: torrent, responses: req.user._id}
            }, {new: true}, function (err, doc) {
              if (err) {
                mtDebug.debugError(err);
              } else {
                //add server message
                if (serverNoticeConfig.action.requestTorrentUpload.enable) {
                  serverMessage.addMessage(doc.user, serverNoticeConfig.action.requestTorrentUpload.title, serverNoticeConfig.action.requestTorrentUpload.content, {
                    request_title: doc.title,
                    request_id: doc._id,
                    torrent_file_name: torrent.torrent_filename,
                    torrent_id: torrent._id,
                    by_name: req.user.displayName,
                    by_id: req.user._id
                  });
                }
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
  if (req.torrent.torrent_vip && !req.user.isVip && !req.user.isOper && !isOwner(req)) {
    return res.status(403).send({
      message: 'SERVER.ONLY_VIP_CAN_DOWNLOAD'
    });
  } else {
    // convert mongoose document to JSON
    var torrent = req.torrent ? req.torrent.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    torrent.isCurrentUserOwner = !!(req.user && torrent.user && torrent.user._id.toString() === req.user._id.toString());

    res.json(torrent);
  }
};

/**
 * isOwner
 * @returns {boolean}
 */
function isOwner(req) {
  return !!(req.user && req.torrent.user && req.torrent.user._id.equals(req.user._id.toString()));
}

/**
 * update a torrent
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var torrent = req.torrent;

  if (req.body.hasOwnProperty('resource_detail_info')) {
    torrent.resource_detail_info = req.body.resource_detail_info;
  }
  if (req.body.hasOwnProperty('torrent_nfo')) {
    torrent.torrent_nfo = req.body.torrent_nfo;
    torrent.torrent_media_info = mediaInfo.getMediaInfo(req.body.torrent_nfo);
  }
  if (req.body.hasOwnProperty('custom_title')) {
    torrent.resource_detail_info.custom_title = req.body.custom_title;
    torrent.markModified('resource_detail_info');
  }
  if (req.body.hasOwnProperty('custom_subtitle')) {
    torrent.resource_detail_info.custom_subtitle = req.body.custom_subtitle;
    torrent.markModified('resource_detail_info');
  }
  if (req.body.hasOwnProperty('screenshots_image')) {
    torrent.screenshots_image = req.body.screenshots_image;

    if (req.body.screenshots_image && req.body.screenshots_image.length > 0) {
      var dst = config.uploads.torrent.image.dest.substr(1);

      req.body.screenshots_image.forEach(function (f, key) {
        if (!f.startsWith('http://') && !f.startsWith('https://')) {
          var os = config.uploads.torrent.image.temp + f;
          var ns = config.uploads.torrent.image.dest + f;
          var cs = config.uploads.torrent.image.crop + f;

          if (!f.startsWith(dst)) {
            torrent.screenshots_image[key] = dst + f;

            move(os, ns, function (err) {
              if (err) {
                mtDebug.debugRed(err);
              } else {
                sharp(ns)
                  .resize(400)
                  .toFile(cs, function (err) {
                    if (err) {
                      mtDebug.debugError(err);
                    }
                  });
              }
            });
          }
        }
      });
    }
  }

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);
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
      if (!torrent.torrent_hnr) {
        removeTorrentHnRWarning(torrent._id, true);
      }

      //add server message
      if (serverNoticeConfig.action.torrentHnRChanged.enable) {
        serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentHnRChanged.title, serverNoticeConfig.action.torrentHnRChanged.content, {
          torrent_file_name: torrent.torrent_filename,
          torrent_id: torrent._id,
          by_name: req.user.displayName,
          by_id: req.user._id,
          hnr_status: torrent.torrent_hnr ? 'ON' : 'OFF'
        });
      }
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

      //add server message
      if (serverNoticeConfig.action.torrentVipChanged.enable) {
        serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentVipChanged.title, serverNoticeConfig.action.torrentVipChanged.content, {
          torrent_file_name: torrent.torrent_filename,
          torrent_id: torrent._id,
          by_name: req.user.displayName,
          by_id: req.user._id,
          vip_status: torrent.torrent_vip ? 'ON' : 'OFF'
        });
      }
    }
  });
};

/**
 * toggleTOPStatus
 * @param req
 * @param res
 */
exports.toggleTOPStatus = function (req, res) {
  var torrent = req.torrent;

  torrent.isTop = !torrent.isTop;
  torrent.topedat = Date.now();

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);

      //add server message
      if (serverNoticeConfig.action.torrentTopChanged.enable) {
        serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentTopChanged.title, serverNoticeConfig.action.torrentTopChanged.content, {
          torrent_file_name: torrent.torrent_filename,
          torrent_id: torrent._id,
          by_name: req.user.displayName,
          by_id: req.user._id,
          top_status: torrent.isTop ? 'ON' : 'OFF'
        });
      }
    }
  });
};

/**
 * toggleUniqueStatus
 * @param req
 * @param res
 */
exports.toggleUniqueStatus = function (req, res) {
  var torrent = req.torrent;

  torrent.isUnique = !torrent.isUnique;

  torrent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);

      //add server message
      if (serverNoticeConfig.action.torrentUniqueChanged.enable) {
        serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentUniqueChanged.title, serverNoticeConfig.action.torrentUniqueChanged.content, {
          torrent_file_name: torrent.torrent_filename,
          torrent_id: torrent._id,
          by_name: req.user.displayName,
          by_id: req.user._id,
          unique_status: torrent.isUnique ? 'ON' : 'OFF'
        });
      }
    }
  });
};

/**
 * removeTorrentHnRWarning
 * @param torrent
 */
function removeTorrentHnRWarning(tid, removeComplete) {
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
          if (removeComplete) {
            c.remove();
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
  thumb.score = scoreConfig.action.thumbsUpScoreOfTorrentTo.value;

  //check if already exist
  exist = false;
  torrent._thumbs.forEach(function (sr) {
    if (sr.user._id.equals(req.user._id)) {
      exist = true;
    }
  });
  if (exist) {
    return res.status(422).send({
      message: 'SERVER.ALREADY_THUMBS_UP'
    });
  } else {
    if (req.user.score >= thumb.score) {
      torrent._thumbs.push(thumb);
      save();

      //score update
      var act = scoreConfig.action.thumbsUpScoreOfTorrentTo;
      act.params = {
        tid: torrent._id
      };
      scoreUpdate(req, torrent.user, act);

      //add server message
      if (serverNoticeConfig.action.torrentThumbsUp.enable) {
        serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentThumbsUp.title, serverNoticeConfig.action.torrentThumbsUp.content, {
          torrent_file_name: torrent.torrent_filename,
          torrent_id: torrent._id,
          by_name: user.displayName,
          by_id: user._id
        });
      }
    } else {
      return res.status(422).send({
        message: 'SERVER.SCORE_NOT_ENOUGH'
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

    //score update
    var act = scoreConfig.action.thumbsUpScoreOfTorrentFrom;
    act.params = {
      tid: torrent._id
    };
    scoreUpdate(req, user, act);
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

        //add server message
        if (serverNoticeConfig.action.torrentSaleChanged.enable) {
          serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentSaleChanged.title, serverNoticeConfig.action.torrentSaleChanged.content, {
            torrent_file_name: torrent.torrent_filename,
            torrent_id: torrent._id,
            by_name: req.user.displayName,
            by_id: req.user._id,
            sale_status: torrent.torrent_sale_status
          });
        }

        //create trace log
        traceLogCreate(req, traceConfig.action.adminTorrentSetSaleType, {
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

        if (torrent.torrent_recommended !== 'level0') {
          var act = scoreConfig.action.uploadTorrentBeRecommend;
          act.params = {
            tid: torrent._id
          };
          scoreUpdate(req, torrent.user, act);
        }

        //create trace log
        traceLogCreate(req, traceConfig.action.adminTorrentSetRecommendLevel, {
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

      announceTorrentToIRC(torrent, req);
      var act = scoreConfig.action.uploadTorrent;
      act.params = {
        tid: torrent._id
      };
      scoreUpdate(req, torrent.user, act);

      //add server message
      if (serverNoticeConfig.action.torrentReviewed.enable) {
        serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentReviewed.title, serverNoticeConfig.action.torrentReviewed.content, {
          torrent_file_name: torrent.torrent_filename,
          torrent_id: torrent._id,
          by_name: req.user.displayName,
          by_id: req.user._id
        });
      }

      //create trace log
      traceLogCreate(req, traceConfig.action.adminTorrentSetReviewedStatus, {
        torrent: torrent._id,
        status: 'reviewed'
      });
    }
  });
};

function announceTorrentToIRC(torrent, req) {
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
        appConfig.domain + '/api/torrents/download/' + torrent._id + '/' + torrent.user.passkey,
        moment().format('YYYY-MM-DD HH:mm:ss')
      ]);
    } else {
      msg = vsprintf(ircConfig.defaultMsgFormat, [
        torrent.user.displayName,
        torrent.torrent_filename,
        torrent.torrent_type,
        torrent.torrent_size,
        torrent.torrent_sale_status,
        appConfig.domain + '/api/torrents/download/' + torrent._id + '/' + torrent.user.passkey,
        moment().format('YYYY-MM-DD HH:mm:ss')
      ]);
    }
    client.notice(ircConfig.channel, msg);
  }
}

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
  }).exec();
  //remove all subtitle of the torrent
  Subtitle.remove({
    torrent: torrent._id
  }).exec();
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
  removeTorrentHnRWarning(torrent._id, true);

  torrent.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(torrent);

      //add server message
      if (serverNoticeConfig.action.torrentDeleted.enable) {
        serverMessage.addMessage(torrent.user._id, serverNoticeConfig.action.torrentDeleted.title, serverNoticeConfig.action.torrentDeleted.content, {
          torrent_file_name: torrent.torrent_filename,
          torrent_id: torrent._id,
          by_name: req.user.displayName,
          by_id: req.user._id,
          reason: req.query.reason
        });
      }

      //only update score when torrent status is reviewed
      if (torrent.torrent_status === 'reviewed') {
        var act = scoreConfig.action.uploadTorrentBeDeleted;
        act.params = {
          tid: torrent._id
        };
        scoreUpdate(req, torrent.user, act);
      }

      //create trace log
      traceLogCreate(req, traceConfig.action.adminTorrentDelete, {
        torrent: torrent._id,
        reason: req.query.reason
      });
    }
  });
};

/**
 * getTorrentsHomeList
 * @param req
 * @param res
 */
exports.getTorrentsHomeList = function (req, res) {
  var getOrderList = function (callback) {
    var query = Torrent.aggregate([
      {'$match': {torrent_status: 'reviewed', torrent_vip: false}},
      {'$sort': {torrent_recommended: -1, orderedat: -1, createdat: -1}},
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
      },
      {'$group': {_id: '$torrent_type', typeTorrents: {$push: '$$ROOT'}}},
      {'$project': {'typeTorrents': {'$slice': ['$typeTorrents', itemsPerPageConfig.homeOrderTorrentListPerType]}}}
    ]);

    query.exec(function (err, orderList) {
      if (err) {
        callback(err, null);
      } else {
        Torrent.populate(orderList,
          [
            {path: 'typeTorrents.user', select: 'username displayName profileImageURL isVip score uploaded downloaded', model: 'User'},
            {path: 'typeTorrents.maker', select: 'name', model: 'Maker'}
          ], function (err, items) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              callback(null, items);
            }
          });
      }
    });
  };

  var getNewestList = function (callback) {
    var query = Torrent.aggregate([
      {'$match': {torrent_status: 'reviewed', torrent_vip: false}},
      {'$sort': {createdat: -1}},
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
      },
      {'$group': {_id: '$torrent_type', typeTorrents: {$push: '$$ROOT'}}},
      {'$project': {'typeTorrents': {'$slice': ['$typeTorrents', itemsPerPageConfig.homeNewestTorrentListPerType]}}}
    ]);

    query.exec(function (err, newestList) {
      if (err) {
        callback(err, null);
      } else {
        Torrent.populate(newestList,
          [
            {path: 'typeTorrents.user', select: 'username displayName profileImageURL isVip score uploaded downloaded', model: 'User'},
            {path: 'typeTorrents.maker', select: 'name', model: 'Maker'}
          ], function (err, items) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              callback(null, items);
            }
          });
      }
    });
  };

  async.parallel([getOrderList, getNewestList], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({orderList: results[0], newestList: results[1]});
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
  var rlevel = 'level0';
  var stype = 'movie';
  var newest = false;
  var hnr = false;
  var top = false;
  var unique = false;
  var sale = false;
  var vip = undefined;
  var release = undefined;
  var userid = undefined;
  var maker = undefined;
  var tagsA = [];
  var keysA = [];

  var isHome = false;

  //var sort = 'torrent_recommended -orderedat -createdat';
  var sort = {torrent_recommended: -1, orderedat: -1, createdat: -1};

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
    hnr = (req.query.torrent_hnr === 'true');
  }
  if (req.query.isTop !== undefined) {
    top = (req.query.isTop === 'true');
  }
  if (req.query.isUnique !== undefined) {
    unique = (req.query.isUnique === 'true');
  }
  if (req.query.torrent_sale !== undefined) {
    sale = (req.query.torrent_sale === 'true');
  }
  if (req.query.torrent_vip !== undefined) {
    vip = (req.query.torrent_vip === 'true');
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

  if (req.query.isHome !== undefined) {
    isHome = (req.query.isHome === 'true');
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

    if (keysT.length === 1 && mongoose.Types.ObjectId.isValid(keysT[0])) {
      keysA = objectId(keysT[0]);
    } else {
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
  }

  var condition = {};
  if (status !== 'all') {
    condition.torrent_status = status;
  }
  if (rlevel !== 'level0') {
    condition.torrent_recommended = rlevel;
  }
  if (stype !== 'all') {
    condition.torrent_type = stype;
  }
  if (hnr === true) {
    condition.torrent_hnr = true;
  }
  if (top === true) {
    condition.isTop = true;
    sort = {topedat: -1, createdat: -1};
  }
  if (unique === true) {
    condition.isUnique = true;
  }
  if (sale === true) {
    condition.torrent_sale_status = {
      $ne: 'U1/D1'
    };
  }
  if (vip !== undefined) {
    if (vip === true) {
      condition.torrent_vip = true;
    } else {
      condition.torrent_vip = false;
    }
  }

  if (tagsA.length > 0) {
    condition.torrent_tags = {$all: tagsA};
  }
  if (release !== undefined) {
    condition['resource_detail_info.release_date'] = release;
  }
  if (mongoose.Types.ObjectId.isValid(keysA)) {
    condition._id = keysA;
  } else {
    if (keysA.length > 0) {
      condition.$or = [
        {torrent_filename: {'$all': keysA}},
        {info_hash: {'$all': keysA}},
        {'resource_detail_info.title': {'$all': keysA}},
        {'resource_detail_info.subtitle': {'$all': keysA}},
        {'resource_detail_info.custom_title': {'$all': keysA}},
        {'resource_detail_info.custom_subtitle': {'$all': keysA}},
        {'resource_detail_info.name': {'$all': keysA}},
        {'resource_detail_info.original_title': {'$all': keysA}},
        {'resource_detail_info.original_name': {'$all': keysA}}
      ];
    }
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
              'cond': {'$eq': ['$$p.user', (req.user ? req.user._id : undefined)]}
            }
          }
        }
      },
      {
        '$project': isHome ? populateStrings.populate_torrent_object_is_home : populateStrings.populate_torrent_object
      }
    ]);

    if (limit === 0) {
      var i = query._pipeline.length;
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
        globalUpdateTorrent(torrents, function (ntorrents) {

          Torrent.populate(ntorrents,
            [
              {path: 'user', select: 'username displayName profileImageURL isVip score uploaded downloaded'},
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
 * countNewTorrents
 * @param req
 * @param res
 */
exports.countNewTorrents = function (req, res) {
  if (!req.user) {
    return res.status(422).send({
      message: 'User is not signed in'
    });
  }

  Torrent.count({
    torrent_status: 'new'
  }, function (err, count) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({newCount: count});
    }
  });
};

/**
 * makeRss
 * @param req
 * @param res
 */
exports.makeRss = function (req, res) {
  var limit = 0;
  var status = 'reviewed';
  var stype = 'movie';
  var hnr = false;
  var sale = false;
  var vip = false;
  var release = undefined;
  var tagsA = [];
  var keysA = [];

  var sort = '-createdat';

  if (req.query.torrent_vip !== undefined) {
    vip = (req.query.torrent_vip === 'true');
  }

  if (!req.passkeyuser) {
    res.end('user is not authorized');
  } else {
    if (req.query.favorite === 'true') {
      if (req.query.limit !== undefined) {
        limit = parseInt(req.query.limit, 10);
      }
      Favorite.find({
        user: req.user._id
      }, 'torrent')
        .sort('-createdAt')
        .populate({
          path: 'torrent',
          select: populateStrings.populate_torrent_string,
          populate: [{
            path: 'user',
            select: 'username displayName profileImageURL isVip score uploaded downloaded'
          }, {
            path: 'maker',
            select: 'name'
          }]
        })
        .limit(limit)
        .exec(function (err, favs) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var arrFavs = favs.map(function (f) {
              return f.torrent;
            });
            mtRSS.sendRSS(req, res, arrFavs);
          }
        });

    } else {
      if (vip && !req.passkeyuser.isVip && !req.passkeyuser.isOper) {
        res.end('You are not vip user!');
      } else {
        if (req.query.limit !== undefined) {
          limit = parseInt(req.query.limit, 10);
        }
        if (req.query.torrent_type !== undefined) {
          stype = req.query.torrent_type;
        }
        if (req.query.torrent_release !== undefined) {
          release = req.query.torrent_release;
        }
        if (req.query.torrent_hnr !== undefined) {
          hnr = (req.query.torrent_hnr === 'true');
        }
        if (req.query.torrent_sale !== undefined) {
          sale = (req.query.torrent_sale === 'true');
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
        condition.torrent_status = status;
        if (stype !== 'all') {
          condition.torrent_type = stype;
        }
        if (hnr === true) {
          condition.torrent_hnr = true;
        }
        if (sale === true) {
          condition.torrent_sale_status = {
            $ne: 'U1/D1'
          };
        }
        if (vip === true) {
          condition.torrent_vip = true;
        } else {
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
            {'resource_detail_info.subtitle': {'$all': keysA}},
            {'resource_detail_info.name': {'$all': keysA}},
            {'resource_detail_info.original_title': {'$all': keysA}},
            {'resource_detail_info.original_name': {'$all': keysA}}
          ];
        }

        mtDebug.debugGreen(JSON.stringify(condition));
        mtDebug.debugGreen(sort);


        Torrent.find(condition)
          .sort(sort)
          .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
          .populate('maker', 'name')
          .limit(limit)
          .exec(function (err, torrents) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              mtRSS.sendRSS(req, res, torrents);
            }
          });
      }
    }
  }
};

/**
 * globalUpdateTorrent
 * @param torrents
 */
function globalUpdateTorrent(torrents, cb) {
  function updateFunc(ts, t, i) {
    return function (callback) {
      Torrent.findById(t._id).exec(function (err, ft) {
        if (err)
          return callback(ts);
        ft.globalUpdateMethod(function (sft) {
          ts[i] = sft;
          callback(null, ts);
        });
      });
    };
  }

  var funcs = [];
  torrents.forEach(function (t, i) {
    if (t.isSaling) {
      funcs.push(updateFunc(torrents, t, i));
    }
  });

  if (funcs.length <= 0) {
    cb(torrents);
  } else {
    async.parallel(funcs, function (err, result) {
      cb(result[result.length - 1]);
    });
  }
}

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
    User.aggregate([{
      $group: {
        _id: null,
        uploaded: {$sum: '$uploaded'},
        downloaded: {$sum: '$downloaded'}
      }
    }]).exec(function (err, total) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, total);
      }
    });
  };

  var totalTorrentsSize = function (callback) {
    Torrent.aggregate([{
      $group: {
        _id: null,
        size: {$sum: '$torrent_size'},
        seeders: {$sum: '$torrent_seeds'},
        leechers: {$sum: '$torrent_leechers'}
      }
    }]).exec(function (err, total) {
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
    Topic.aggregate([{
      $group: {
        _id: null,
        replies: {$sum: '$replyCount'}
      }
    }]).exec(function (err, total) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, total);
      }
    });
  };

  var countIdleUsers = function (callback) {
    User.count({status: 'idle'}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countBannedUsers = function (callback) {
    User.count({status: 'banne'}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  var countInactiveUsers = function (callback) {
    User.count({status: 'inactive'}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  async.parallel([countUsers, countTorrents, totalTorrentsSize, totalUpDown, countForumTopics, totalForumReplies, countVipUsers, countIdleUsers, countBannedUsers, countInactiveUsers], function (err, results) {
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
        totalVipUsers: results[6],
        totalIdleUsers: results[7],
        totalBannedUsers: results[8],
        totalInactiveUsers: results[9]
      });
    }
  });
};

/**
 * getSeederUsers
 * @param req
 * @param res
 */
exports.getSeederUsers = function (req, res) {
  var skip = 0;
  var limit = 0;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  var countSeederUsers = function (callback) {
    Peer.count({
      torrent: req.torrent._id,
      peer_status: PEERSTATE_SEEDER,
      last_announce_at: {$gt: Date.now() - announceConfig.announceInterval - announceConfig.announceIdleTime}
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });

  };

  var findSeederUsers = function (callback) {
    Peer.find({
      torrent: req.torrent._id,
      peer_status: PEERSTATE_SEEDER,
      last_announce_at: {$gt: Date.now() - announceConfig.announceInterval - announceConfig.announceIdleTime}
    })
      .sort('-peer_uploaded')
      .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
      .skip(skip)
      .limit(limit)
      .exec(function (err, peers) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          callback(null, peers);
        }
      });
  };

  async.parallel([countSeederUsers, findSeederUsers], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({rows: results[1], total: results[0]});
    }
  });
};

/**
 * getLeecherUsers
 * @param req
 * @param res
 */
exports.getLeecherUsers = function (req, res) {
  var skip = 0;
  var limit = 0;

  if (req.query.skip !== undefined) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit !== undefined) {
    limit = parseInt(req.query.limit, 10);
  }

  var countLeecherUsers = function (callback) {
    Peer.count({
      torrent: req.torrent._id,
      peer_status: PEERSTATE_LEECHER,
      last_announce_at: {$gt: Date.now() - announceConfig.announceInterval - announceConfig.announceIdleTime}
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });

  };

  var findLeecherUsers = function (callback) {
    Peer.find({
      torrent: req.torrent._id,
      peer_status: PEERSTATE_LEECHER,
      last_announce_at: {$gt: Date.now() - announceConfig.announceInterval - announceConfig.announceIdleTime}
    })
      .sort('-peer_downloaded')
      .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
      .skip(skip)
      .limit(limit)
      .exec(function (err, peers) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          callback(null, peers);
        }
      });
  };

  async.parallel([countLeecherUsers, findLeecherUsers], function (err, results) {
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
      message: 'SERVER.INVALID_OBJECTID'
    });
  }

  var findTorrents = function (callback) {
    Torrent.find({_id: id}, {'_peers': 0})
      .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
      .populate('maker', 'name')
      .populate('_thumbs.user', 'username displayName profileImageURL isVip score uploaded downloaded')
      .populate('_ratings.user', 'username displayName profileImageURL isVip score  uploaded downloaded')
      .populate({
        path: '_replies.user',
        select: 'username displayName profileImageURL isVip score uploaded downloaded',
        model: 'User'
      })
      .populate({
        path: '_replies._replies.user',
        select: 'username displayName profileImageURL isVip score uploaded downloaded',
        model: 'User'
      })
      .populate({
        path: '_subtitles',
        populate: {
          path: 'user',
          select: 'username displayName profileImageURL isVip score uploaded downloaded'
        }
      })
      .exec(function (err, torrent) {
        if (err) {
          callback(err);
        } else if (!torrent) {
          callback(new Error('No torrent with that id has been found'));
        }
        callback(null, torrent[0]);
      });
  };

  var findOtherTorrents = function (torrent, callback) {
    if (torrent && torrent.resource_detail_info.id) {
      var condition = {
        torrent_status: 'reviewed',
        'resource_detail_info.id': torrent.resource_detail_info.id
      };

      mtDebug.debugGreen(condition);

      var fields = 'user maker torrent_filename torrent_tags torrent_seeds torrent_leechers torrent_finished torrent_seasons torrent_episodes torrent_size torrent_sale_status torrent_type torrent_hnr isSaling torrent_vip torrent_sale_expires createdat';

      Torrent.find(condition, fields)
        .sort('-createdat')
        .populate('user', 'username displayName profileImageURL isVip score uploaded downloaded')
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

  var writeAllFiles = function (torrent, callback) {
    if (torrent) {
      try {
        var filePath = config.uploads.torrent.file.dest + torrent.torrent_filename;
        fs.exists(filePath, function (exists) {
          if (exists) {
            nt.read(filePath, function (err, torrent_data) {
              if (err) {
                callback(err);
              } else {
                var mdata = torrent_data.metadata;
                torrent._all_files = [];

                if (mdata.info.files) {
                  mdata.info.files.forEach(function (f) {
                    torrent._all_files.push(f.path.join('/') + ', ' + common.fileSizeFormat(f.length, 2));
                  });
                } else {
                  torrent._all_files.push(mdata.info.name + ', ' + common.fileSizeFormat(mdata.info.length, 2));
                }

                callback(null, torrent);
              }
            });
          } else {
            callback(null, torrent);
          }
        });
      } catch (e) {
        callback(null, torrent);
      }
    } else {
      callback(null, torrent);
    }
  };

  async.waterfall([findTorrents, findOtherTorrents, writeAllFiles], function (err, torrent) {
    if (err) {
      next(err);
    } else {
      if (torrent) {
        req.torrent = torrent;
      } else {
        return res.status(404).send();
      }
      next();
    }
  });
};
