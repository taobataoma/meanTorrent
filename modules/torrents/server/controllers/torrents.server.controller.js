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
  //var existingFileUrl;

  // Filtering to upload only images
  var multerConfig = config.uploads.torrent.file;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).torrentFileFilter;
  var upload = multer(multerConfig).single('newTorrentFile');

  if (user) {
    //existingFileUrl = user.profileImageURL;
    uploadFile()
      .then(function () {
        res.json(user);
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

};

