'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Torrent = mongoose.model('Torrent'),
  querystring = require('querystring'),
  url = require('url');


const FAILURE_REASONS = {
  900: 'Generic error',
  901: 'Server error'
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

  console.log('------------ Scrape request ----------------');
  //console.log(req.url);

  var s = req.url.split('?');
  var query = querystringParse(s[1]);
  //console.log(query.info_hash);

  if (Array.isArray(query.info_hash)) {
    query.info_hash.forEach(function (item) {
      info_hash.push(binaryToHex(item));
    });
  } else {
    info_hash.push(binaryToHex(query.info_hash));
  }

  //info_hash.forEach(function (x) {
  //  console.log(hexToBinary(x));
  //});

  //console.log(info_hash);

  //select all torrents with info_hash
  Torrent.find({
    info_hash: {$in: info_hash}
  }, function (err, allt) {
    if (err) {
      sendError(new Failure(901));
    } else if (!allt) {
      sendError(new Failure(901));
    } else {
      var resStr = 'd5:files' + 'd';

      allt.forEach(function (it) {
        resStr += '20:' + hexToBinary(it.info_hash) + 'd';
        resStr += '8:completei' + it.torrent_seeds + 'e';
        resStr += '10:downloadedi' + it.torrent_finished + 'e';
        resStr += '10:incompletei' + it.torrent_leechers + 'e';
        resStr += 'e';
      });
      resStr += 'ee';

      console.log(resStr);

      res.writeHead(200, {
        'Content-Length': resStr.length,
        'Content-Type': 'text/plain'
      });

      res.write(resStr);
      res.end();
    }
  });

  /**
   * sendError
   * @param failure
   */
  function sendError(failure) {
    var respc = failure.bencode();
    console.log(respc);
    res.writeHead(500, {
      'Content-Length': respc.length,
      'Content-Type': 'text/plain'
    });

    res.end(respc);
  }

  /**
   * binaryToHex
   * @param str
   */
  function binaryToHex(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }
    return Buffer.from(str, 'binary').toString('hex');
  }

  /**
   * hexToBinary
   * @param str
   */
  function hexToBinary(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }
    return Buffer.from(str, 'hex').toString('binary');
  }

  /**
   * querystringParse
   * @param q
   */
  function querystringParse(q) {
    return querystring.parse(q, null, null, {decodeURIComponent: unescape});
  }
};
