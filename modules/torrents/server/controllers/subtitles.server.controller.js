'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  fs = require('fs'),
  User = mongoose.model('User'),
  Torrent = mongoose.model('Torrent'),
  Subtitle = mongoose.model('Subtitle'),
  async = require('async');

/**
 * create a subtitle of torrent
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var user = req.user;
  var createUploadSubtitleFilename = require(path.resolve('./config/lib/multer')).createUploadSubtitleFilename;
  var getUploadSubtitleDestination = require(path.resolve('./config/lib/multer')).getUploadSubtitleDestination;
  var fileFilter = require(path.resolve('./config/lib/multer')).subtitleFileFilter;

  var storage = multer.diskStorage({
    destination: createUploadSubtitleFilename,
    filename: getUploadSubtitleDestination
  });

  var upload = multer({storage: storage}).single('newSubtitleFile');
  upload.fileFilter = fileFilter;

  if (user) {
    uploadFile()
      .then(function () {
        var torrent = req.torrent;
        var newfile = config.uploads.subtitles.file.dest + req.file.filename;
        var stat = fs.statSync(newfile);
        var subfile = new Subtitle();

        subfile.user = req.user;
        subfile.torrent = req.torrent;
        subfile.subtitle_filename = req.file.filename;
        subfile.subtitle_filesize = stat.size;

        subfile.save();

        torrent.update({
          $addToSet: {_subtitles: subfile}
        }).exec();

        res.json(torrent);
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
            message = 'Subtitle file too large. Maximum size allowed is ' + (config.upload.subtitle.file.limits.fileSize / (1024 * 1024)).toFixed(2) + ' Mb files.';
          }
          reject(message);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * delete a subtitle of torrent
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  var torrent = req.torrent;

  torrent._subtitles.forEach(function (r) {
    if (r._id.equals(req.params.subtitleId)) {
      torrent.update({
        $pull: {_subtitles: r._id}
      }).exec();

      r.remove();
      res.json(torrent);
    }
  });
};
