'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  querystring = require('querystring'),
  tracker = require('./common/tracker'),
  url = require('url'),
  util = require('util');


// Until it is possible to tell url.parse that you don't want a string back
// we need to override querystring.unescape so it returns a buffer instead of a
// string
querystring.unescape = function (s, decodeSpaces) {
  return querystring.unescapeBuffer(s, decodeSpaces);
};

const FAILURE_REASONS = {
  100: 'Invalid request type: client request was not a HTTP GET',
  101: 'Missing info_hash',
  102: 'Missing peer_id',
  103: 'Missing port',
  104: 'Missing passkey',
  150: 'Invalid infohash: infohash is not 20 bytes long',
  151: 'Invalid peerid: peerid is not 20 bytes long',
  152: 'Invalid numwant. Client requested more peers than allowed by tracker',
  153: 'Invalid passkey',
  200: 'info_hash not found in the database. Sent only by trackers that do not automatically include new hashes into the database',
  500: 'Client sent an eventless request before the specified time',
  600: 'This tracker only supports compact mode',
  900: 'Generic error'
};

const PARAMS_INTEGER = [
  'port', 'uploaded', 'downloaded', 'left', 'compact', 'numwant'
];

const PARAMS_STRING = [
  'event'
];

function Failure(code, reason) {
  this.code = code;
  this.reason = reason;
  if (reason === undefined && typeof FAILURE_REASONS[this.code] !== 'undefined')
    this.reason = FAILURE_REASONS[this.code];
  else if (this.code == null)
    this.code = 900;
}

Failure.prototype = {
  bencode: function () {
    return 'd14:failure reason' + this.reason.length + ':' + this.reason + '12:failure codei' + this.code + 'ee';
  }
};

function validateRequest(method, query) {
  var i = 0;
  var p;

  if (method !== 'GET')
    throw new Failure(100);

  if (typeof query.info_hash === 'undefined')
    throw new Failure(101);

  if (typeof query.peer_id === 'undefined')
    throw new Failure(102);

  if (typeof query.port === 'undefined')
    throw new Failure(103);

  if (typeof query.passkey === 'undefined')
    throw new Failure(104);

  if (query.info_hash.length !== 20)
    throw new Failure(150);

  if (query.peer_id.length !== 20)
    throw new Failure(151);

  if (query.passkey.length !== 32)
    throw new Failure(153);

  for (i = 0; i < PARAMS_INTEGER.length; i++) {
    p = PARAMS_INTEGER[i];
    if (typeof query[p] !== 'undefined')
      query[p] = parseInt(query[p].toString(), 10);
  }

  for (i = 0; i < PARAMS_STRING.length; i++) {
    p = PARAMS_STRING[i];
    if (typeof query[p] !== 'undefined')
      query[p] = query[p].toString();
  }

  if (typeof query.compact === 'undefined' || query.compact !== 1)
    throw new Failure(600);
}
/**
 * Create an article
 */
exports.info = function (req, res) {
  console.log('----------------------------');
  console.log(req.url);

  var parts = url.parse(req.url, true);
  var query = parts.query;

  console.log(query);

  try {
    validateRequest(req.method, query);

    //var file = tracker.getFile(query.info_hash);
    //var peer = tracker.peer(req.connection.remoteAddress, query.port, query.left);
    //peer = file.addPeer(query.peer_id, peer, tracker.event(query.event));
    //
    //var want = 50;
    //if (typeof query.numwant !== 'undefined' && query.numwant > 0)
    //  want = query.numwant;
    //
    //var peerBuffer = new Buffer(want * tracker.PEER_COMPACT_SIZE);
    //var len = file.writePeers(peerBuffer, want, peer);
    //peerBuffer = peerBuffer.slice(0, len);
    //
    //var resp = 'd8:intervali' + tracker.ANNOUNCE_INTERVAL + 'e8:completei' + file.seeders + 'e10:incompletei' + file.leechers + 'e10:downloadedi' + file.downloads + 'e5:peers' + len + ':';
    //
    //res.writeHead(200, {
    //  'Content-Length': resp.length + peerBuffer.length + 1,
    //  'Content-Type': 'text/plain'
    //});
    //
    //res.write(resp);
    //res.write(peerBuffer);
    //res.end('e');
  } catch (failure) {
    var respc = failure.bencode();
    console.log(respc);
    res.writeHead(500, {
      'Content-Length': respc.length,
      'Content-Type': 'text/plain'
    });

    res.end(respc);
  }

  res.end('OK');
};

