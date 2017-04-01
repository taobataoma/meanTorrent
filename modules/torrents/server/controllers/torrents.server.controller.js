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
  fs = require('fs'),
  nt = require('nt'),
  validator = require('validator'),
  tmdb = require('moviedb')('7888f0042a366f63289ff571b68b7ce0');

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
              message = 'The private tracker announce url must be: ' + config.announce.url;

              fs.unlink(newfile, function (unlinkError) {
                if (unlinkError) {
                  console.log(unlinkError);
                  message = 'Error occurred while deleting old profile picture';
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

};

