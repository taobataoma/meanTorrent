'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Torrent = mongoose.model('Torrent'),
  common = require(path.resolve('./config/lib/common')),
  url = require('url');

var mtDebug = require(path.resolve('./config/lib/debug'));

const FAILURE_REASONS = {
  900: 'Generic error',
  901: 'Server error',
  902: 'Torrent not registered with this tracker'
};

/**
 * Failure
 * @param code
 * @param reason
 * @constructor
 */
function Failure(code, reason) {
  this.code = code;
  this.reason = reason;
  if (reason === undefined && typeof FAILURE_REASONS[this.code] !== 'undefined')
    this.reason = FAILURE_REASONS[this.code];
  else if (this.code == null)
    this.code = 900;
}

/**
 * Failure.prototype
 * @type {{bencode: Function}}
 */
Failure.prototype = {
  bencode: function () {
    return 'd14:failure reason' + this.reason.length + ':' + this.reason + '12:failure codei' + this.code + 'ee';
  }
};

/**
 * info api
 * @param req
 * @param res
 */
exports.scrape = function (req, res) {
  var info_hash = [];

  mtDebug.debugGreen('------------ Scrape request ----------------');
  mtDebug.debugGreen(req.url);

  //var s = req.url.split('?');
  //var query = common.querystringParse(s[1]);
  var query = req.query;
  mtDebug.debugGreen('query.info_hash = ' + unescape(query.info_hash));

  if (Array.isArray(query.info_hash)) {
    query.info_hash.forEach(function (item) {
      info_hash.push(common.binaryToHex(unescape(item)));
    });
  } else {
    info_hash.push(common.binaryToHex(unescape(query.info_hash)));
  }

  mtDebug.debugGreen(info_hash);

  //select all torrents with info_hash
  Torrent.find({
    info_hash: {$in: info_hash}
  }, function (err, allt) {
    if (err) {
      sendError(new Failure(901));
    } else if (!allt) {
      sendError(new Failure(902));
    } else {
      var resStr = 'd5:files' + 'd';

      allt.forEach(function (it) {
        resStr += '20:' + common.hexToBinary(it.info_hash) + 'd';
        resStr += '8:completei' + it.torrent_seeds + 'e';
        resStr += '10:downloadedi' + it.torrent_finished + 'e';
        resStr += '10:incompletei' + it.torrent_leechers + 'e';
        resStr += 'e';
      });
      resStr += 'ee';

      //mtDebug.debugGreen('resStr = ' + resStr);

      res.writeHead(200, {
        'Content-Length': resStr.length,
        'Content-Type': 'text/plain'
      });

      res.end(resStr, 'ascii');
    }
  });

  /**
   * sendError
   * @param failure
   */
  function sendError(failure) {
    var respc = failure.bencode();
    mtDebug.debugRed(respc);
    res.writeHead(200, {
      'Content-Length': respc.length,
      'Content-Type': 'text/plain'
    });

    res.end(respc);
  }
};
