'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  querystring = require('querystring'),
  tracker = require('./common/tracker'),
  User = mongoose.model('User'),
  Torrent = mongoose.model('Torrent'),
  benc = require('bncode'),
  assert = require('assert'),
  async = require('async'),
  url = require('url'),
  util = require('util');

const FAILURE_REASONS = {
  100: 'Invalid request type: client request was not a HTTP GET',
  101: 'Missing info_hash',
  102: 'Missing peer_id',
  103: 'Missing port',
  104: 'Missing passkey',
  150: 'Invalid infohash: infohash is not 20 bytes long',
  151: 'Invalid peerid: peerid is not 20 bytes long',
  152: 'Invalid numwant. Client requested more peers than allowed by tracker',
  153: 'Passkey length error (length=32)',
  154: 'Invalid passkey, if you changed you passkey, please redownload the torrent file from ' + config.meanTorrentConfig.announce.base_url,

  160: 'Invalid torrent info_hash',
  161: 'No torrent with that info_hash has been found',
  162: 'ip length error',

  200: 'info_hash not found in the database. Sent only by trackers that do not automatically include new hashes into the database',
  500: 'Client sent an eventless request before the specified time',
  600: 'This tracker only supports compact mode',
  900: 'Generic error'
};

const EVENT_NONE = 0;
const EVENT_COMPLETED = 1;
const EVENT_STARTED = 2;
const EVENT_STOPPED = 3;

const WANT_DEFAULT = 50;

const PEERSTATE_SEEDER = 0;
const PEERSTATE_LEECHER = 1;

const PEER_COMPACT_SIZE = 6;
const ANNOUNCE_INTERVAL = 60;

const PARAMS_INTEGER = [
  'port', 'uploaded', 'downloaded', 'left', 'compact', 'numwant'
];

const PARAMS_STRING = [
  'event'
];

/**
 * event
 * @param e
 * @returns {number}
 */
function event(e) {
  switch (e) {
    case 'completed':
      return EVENT_COMPLETED;
    case 'started':
      return EVENT_STARTED;
    case 'stopped':
      return EVENT_STOPPED;
  }
  return EVENT_NONE;
}

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
 * validateRequest
 * @param method
 * @param query
 */
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

  if (query.info_hash.length !== 20)
    throw new Failure(150);

  if (query.peer_id.length !== 20)
    throw new Failure(151);

  if (typeof query.compact === 'undefined' || query.compact !== '1')
    throw new Failure(600);

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
}

/**
 * info api
 * @param req
 * @param res
 */
exports.announce = function (req, res) {
  var torrent;

  console.log('----------------------------');
  //console.log(req.url);

  var parts = url.parse(req.url, true);
  var query = parts.query;
  var passkey = req.params.passkey || query.passkey || undefined;

  async.waterfall([
    /*
     validateQueryCheck
     */
    function (done) {
      try {
        validateRequest(req.method, query);
        done(null);
      } catch (failure) {
        sendError(failure);
      }
    },

    /*
     validatePasskeyCheck
     */
    function (done) {
      if (!config.meanTorrentConfig.announce.open_tracker) {
        if (typeof passkey === 'undefined') {
          done(104);
        }
        if (passkey.length !== 32) {
          done(153);
        }
        if (req.pkuser === undefined) {
          done(154);
        }
      }
      done(null);
    },

    /*
     getTorrentItemData
     */
    function (done) {
      Torrent.findOne({
        info_hash: '5a8a82a7dbfbb46523053b619f026599a59fe192'
      })
        .populate('user')
        .populate('_peers')
        .exec(function (err, t) {
          if (err) {
            done(160);
          } else if (!t) {
            done(161);
          } else {
            torrent = t;
            done(null);
          }
        });
    },

    /*
     validateUserCheck
     check banned
     */
    function (done) {
      done(null);
    },

    /*
     validateClientCheck
     check client blacklist
     */
    function (done) {
      done(null);
    },

    /*
     onEventStarted
     if downloading, check download peer num only 1, ratio check
     if seeding, check seed peer num less 3
     */
    function (done) {
      if (event(query.event) === EVENT_STARTED) {
        console.log('---------------EVENT_STARTED----------------');
      }
      done(null);
    },

    /*
     onEventStopped
     */
    function (done) {
      if (event(query.event) === EVENT_STOPPED) {
        console.log('---------------EVENT_STOPPED----------------');
      }
      done(null);
    },

    /*
     onEventCompleted
     */
    function (done) {
      if (event(query.event) === EVENT_COMPLETED) {
        console.log('---------------EVENT_COMPLETED----------------');
      }
      done(null);
    },

    /*
     writeUpDownData
     */
    function (done) {
      done(null);
    },

    /*
     sendPeers
     */
    function (done) {
      var want = WANT_DEFAULT;
      if (typeof query.numwant !== 'undefined' && query.numwant > 0)
        want = query.numwant;

      var peerBuffer = new Buffer(want * PEER_COMPACT_SIZE);
      var len = writePeers(peerBuffer, want, torrent._peers);
      peerBuffer = peerBuffer.slice(0, len);

      torrent.torrent_seeds = 77;
      torrent.torrent_leechers = 88;
      torrent.torrent_finished = 99;

      var resp = 'd8:intervali' + ANNOUNCE_INTERVAL + 'e8:completei' + torrent.torrent_seeds + 'e10:incompletei' + torrent.torrent_leechers + 'e10:downloadedi' + torrent.torrent_finished + 'e5:peers' + len + ':';
      console.log(resp);

      res.writeHead(200, {
        'Content-Length': resp.length + peerBuffer.length + 1,
        'Content-Type': 'text/plain'
      });

      res.write(resp);
      res.write(peerBuffer);
      res.end('e');

      done(null, 'done');
    }
  ], function (err) {
    if (err) {
      throw new Failure(err);
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
   * writePeers
   * @param buf
   * @param count
   * @param peers
   * @returns {number}
   */
  function writePeers(buf, count, peers) {
    var c = 0;
    var p;

    var m = Math.min(peers.length, count);
    for (var i = 0; i < m; i++) {
      var index = Math.floor(Math.random() * peers.length);
      p = peers[index];
      if (p !== undefined && p.user._id !== req.user._id) {
        var b = compact(p);
        if (b) {
          b.copy(buf, c++ * PEER_COMPACT_SIZE);
        }
      }
    }

    return c * PEER_COMPACT_SIZE;
  }

  /**
   * compact
   * @param p
   * @returns {*}
   */
  function compact(p) {
    var b = new Buffer(PEER_COMPACT_SIZE);

    var parts = p.peer_ip.split('.');
    if (parts.length !== 4) {
      return null;
    } else {
      for (var i = 0; i < 4; i++)
        b[i] = parseInt(parts[i], 10);

      b[4] = (p.peer_port >> 8) & 0xff;
      b[5] = p.peer_port & 0xff;

      return b;
    }
  }
};

/**
 * userByPasskey
 * @param req
 * @param res
 * @param next
 * @param pk
 * @returns {*}
 */
exports.userByPasskey = function (req, res, next, pk) {
  User.findOne({passkey: pk})
    .exec(function (err, u) {
      if (u) {
        req.pkuser = u;
      } else {
        req.pkuser = undefined;
      }
      next();
    });
};
