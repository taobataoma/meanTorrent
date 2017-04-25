'use strict';

var path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config'));

module.exports.imageFileFilter = function (req, file, callback) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.torrentFileFilter = function (req, file, callback) {
  var ext = file.originalname.replace(/^.+\./, '');
  if (file.mimetype !== 'application/x-bittorrent' && ext !== 'torrent') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.createUploadFilename = function (req, file, cb) {
  var regex = new RegExp(',', 'g');
  var filename = file.originalname.replace(regex, ' ');

  if (fs.existsSync(config.uploads.torrent.file.dest + filename)) {
    var err = new Error();
    err.code = 'FILE_ALREADY_EXISTS';
    cb(err, null);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadDestination = function (req, file, cb) {
  cb(null, config.uploads.torrent.file.dest);
};

module.exports.createUploadSubtitleFilename = function (req, file, cb) {
  var regex = new RegExp(',', 'g');
  var filename = file.originalname.replace(regex, ' ');

  if (fs.existsSync(config.uploads.subtitles.file.dest + filename)) {
    var err = new Error();
    err.code = 'FILE_ALREADY_EXISTS';
    cb(err, null);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadSubtitleDestination = function (req, file, cb) {
  cb(null, config.uploads.subtitles.file.dest);
};
