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
  tmdb = require('moviedb')(config.tmdb_api.key);

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

exports.upload = function (req, res) {
  var user = req.user;
  var createUploadFilename = require(path.resolve('./config/lib/multer')).createUploadFilename;
  var getUploadDestination = require(path.resolve('./config/lib/multer')).getUploadDestination;
  var fileFiletr = require(path.resolve('./config/lib/multer')).torrentFileFilter;
  var info_hash = '';

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
        res.status(200).send(info_hash);
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
          info_hash = torrent.infoHash();
          resolve();
        }
      });
    });
  }

  function checkHash() {
    return new Promise(function (resolve, reject) {
      var newfile = config.uploads.torrent.file.dest + req.file.filename;
      var message = '';

      if (info_hash === '') {
        message = 'INFO_HASH_IS_EMPTY';
        reject(message);
      } else {
        Torrent.findOne({
          info_hash: info_hash
        }).exec(function (err, torr) {
          if (err) {
            reject(err);
          } else {
            if (torr) {
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

