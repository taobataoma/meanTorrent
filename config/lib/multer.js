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

module.exports.subtitleFileFilter = function (req, file, callback) {
  var ext = file.originalname.replace(/^.+\./, '');
  if (ext !== 'srt' && ext !== 'ass' && ext !== 'rar' && ext !== 'zip' && ext !== '7z') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.createUploadFilename = function (req, file, cb) {
  //var regex = new RegExp(',', 'g');
  //var filename = file.originalname.replace(regex, ' ');
  var RexStr = /\(|\)|\[|\]|\,/g;
  var filename = file.originalname.replace(RexStr, function (MatchStr) {
    switch (MatchStr) {
      case '(':
        return '<';
      case ')':
        return '>';
      case '[':
        return '{';
      case ']':
        return '}';
      case ',':
        return ' ';
      default:
        break;
    }
  });

  if (fs.existsSync(config.uploads.torrent.file.temp + filename)) {
    fs.unlinkSync(config.uploads.torrent.file.temp + filename);
  }

  if (fs.existsSync(config.uploads.torrent.file.dest + filename)) {
    var err = new Error();
    err.code = 'FILE_ALREADY_EXISTS';
    cb(err, null);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadDestination = function (req, file, cb) {
  cb(null, config.uploads.torrent.file.temp);
};

module.exports.createUploadAttachFilename = function (req, file, cb) {
  var RexStr = /\(|\)|\[|\]|\,/g;
  var filename = file.originalname.replace(RexStr, function (MatchStr) {
    switch (MatchStr) {
      case '(':
        return '<';
      case ')':
        return '>';
      case '[':
        return '{';
      case ']':
        return '}';
      case ',':
        return ' ';
      default:
        break;
    }
  });

  if (fs.existsSync(config.uploads.attach.file.temp + filename)) {
    fs.unlinkSync(config.uploads.attach.file.temp + filename);
  }

  if (fs.existsSync(config.uploads.attach.file.dest + filename)) {
    var ext = file.originalname.replace(/^.+\./, '');
    var regex = new RegExp(ext, 'g');
    filename = filename.replace(regex, Date.now() + '.' + ext);

    cb(null, filename);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadAttachDestination = function (req, file, cb) {
  cb(null, config.uploads.attach.file.temp);
};

module.exports.createUploadSubtitleFilename = function (req, file, cb) {
  var regex = new RegExp(',', 'g');
  var filename = file.originalname.replace(regex, ' ');

  if (fs.existsSync(config.uploads.subtitle.file.dest + filename)) {
    var err = new Error();
    err.code = 'FILE_ALREADY_EXISTS';
    cb(err, null);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadSubtitleDestination = function (req, file, cb) {
  cb(null, config.uploads.subtitle.file.dest);
};
