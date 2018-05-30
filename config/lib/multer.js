'use strict';

var path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config'));

/**
 * file filter
 * @param req
 * @param file
 * @param callback
 * @returns {*}
 */
module.exports.imageFileFilter = function (req, file, callback) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/bmp') {
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

/**
 * createUploadFilename
 * @param req
 * @param file
 * @param cb
 */
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

  //replace other pt site prefix
  var reg = /\{([a-zA-Z0-9\_\-\.\s]){2,10}\}[\.|\s]*/gi;
  filename = filename.replace(reg, '');

  if (fs.existsSync(config.uploads.torrent.file.dest + filename)) {
    var err = new Error();
    err.code = 'FILE_ALREADY_EXISTS';
    err.filename = config.uploads.torrent.file.dest + filename;
    cb(err, null);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadDestination = function (req, file, cb) {
  cb(null, config.uploads.torrent.file.temp);
};

/**
 * createUploadAttachFilename
 * @param req
 * @param file
 * @param cb
 */
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

  //replace other pt site prefix
  var reg = /\{([a-zA-Z0-9\_\-\.\s]){2,10}\}[\.|\s]*/gi;
  filename = filename.replace(reg, '');


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

/**
 * createUploadSubtitleFilename
 * @param req
 * @param file
 * @param cb
 */
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

/**
 * createUploadCoverImageFilename
 * @param req
 * @param file
 * @param cb
 */
module.exports.createUploadCoverImageFilename = function (req, file, cb) {
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

  if (fs.existsSync(config.uploads.torrent.cover.temp + filename)) {
    fs.unlinkSync(config.uploads.torrent.cover.temp + filename);
  }

  if (fs.existsSync(config.uploads.torrent.cover.dest + filename)) {
    var ext = file.originalname.replace(/^.+\./, '');
    var regex = new RegExp(ext, 'g');
    filename = filename.replace(regex, Date.now() + '.' + ext);

    cb(null, filename);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadCoverImageDestination = function (req, file, cb) {
  cb(null, config.uploads.torrent.cover.temp);
};

/**
 * createUploadTorrentImageFilename
 * @param req
 * @param file
 * @param cb
 */
module.exports.createUploadTorrentImageFilename = function (req, file, cb) {
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

  if (fs.existsSync(config.uploads.torrent.image.temp + filename)) {
    fs.unlinkSync(config.uploads.torrent.image.temp + filename);
  }

  if (fs.existsSync(config.uploads.torrent.image.dest + filename)) {
    var ext = file.originalname.replace(/^.+\./, '');
    var regex = new RegExp(ext, 'g');
    filename = filename.replace(regex, Date.now() + '.' + ext);

    cb(null, filename);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadTorrentImageDestination = function (req, file, cb) {
  cb(null, config.uploads.torrent.image.temp);
};

/**
 * createUploadTicketImageFilename
 * @param req
 * @param file
 * @param cb
 */
module.exports.createUploadTicketImageFilename = function (req, file, cb) {
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

  if (fs.existsSync(config.uploads.tickets.image.temp + filename)) {
    fs.unlinkSync(config.uploads.tickets.image.temp + filename);
  }

  if (fs.existsSync(config.uploads.tickets.image.dest + filename)) {
    var ext = file.originalname.replace(/^.+\./, '');
    var regex = new RegExp(ext, 'g');
    filename = filename.replace(regex, Date.now() + '.' + ext);

    cb(null, filename);
  } else {
    cb(null, filename);
  }
};

module.exports.getUploadTicketImageDestination = function (req, file, cb) {
  cb(null, config.uploads.tickets.image.temp);
};
