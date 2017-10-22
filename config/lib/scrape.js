'use strict';

var path = require('path'),
  bencoding = require('bencoding'),
  common = require(path.resolve('./config/lib/common')),
  request = require('request'),
  dgram = require('dgram'),
  URL = require('url');

/**
 * doScrape
 * @param t - torrent object
 */
module.exports.doScrape = function (t, cb) {
  var scrapeInfo = [];
  var regex = new RegExp('announce', 'g');
  console.log('torrent_announce = ' + t.torrent_announce);
  console.log('info_hash = ' + t.info_hash);

  var url = URL.parse(t.torrent_announce);
  var protocol = url.protocol;
  var hostname = url.hostname;
  var port = url.port;
  var path = url.pathname;
  var npath = '';
  var info_hash = escape(common.hexToBinary(t.info_hash));

  var i = path.indexOf('announce');
  if (i >= 0) {
    var j = path.indexOf('/', i);
    if (j >= 0) {
      path = path.slice(0, j);
    }
    npath = path.replace(regex, 'scrape');
  } else {
    npath = '/scrape';
  }

  var scrapeUrl = protocol + '//' + hostname;
  scrapeUrl += port ? ':' + port : '';
  scrapeUrl += npath;

  scrapeUrl += '?info_hash=' + info_hash;
  console.log('-= scrape =- ' + scrapeUrl);

  if (scrapeUrl.toUpperCase().startsWith('HTTP')) {
    doHTTPScrape();
  } else {
    doUDPScrape();
  }

  /**
   * doHTTPScrape
   */
  function doHTTPScrape() {
    request(scrapeUrl, {encoding: null}, function (error, response, body) {
      //console.log('error:', error);
      //console.log('statusCode:', response && response.statusCode);
      //console.log('body:', body);
      if (error) {
        //console.log('-= scrape error =- ' + scrapeUrl);
        if (cb) cb(error, null);
      } else if (response) {
        if (response.statusCode === 200) {
          var data = new Buffer(body);
          var result = bencoding.decode(data);

          //console.log(result);
          //console.log(result.toJSON());
          //console.log(result.vals[0]);
          result.keys.forEach(function (k1, idx1) {
            //console.log(k1.toString('utf8').toUpperCase() + ' - ' + idx1 + ' - ' + result.vals[idx1]);
            if (k1.toString('utf8').toUpperCase() === 'FAILURE REASON') {
              //console.log('-= scrape error =- ' + result.vals[idx1].toString('utf8'));
              if (cb) cb(result.vals[idx1].toString('utf8'), null);
            } else if (k1.toString('utf8').toUpperCase() === 'FILES') {
              var val = result.vals[idx1];
              val.keys.forEach(function (k2, idx2) {
                //console.log(k2.toString('hex'));
                //console.log(val.vals[idx2].toJSON());

                scrapeInfo.push({
                  info_hash: k2.toString('hex'),
                  data: val.vals[idx2].toJSON()
                });
              });
              //console.log(scrapeInfo);
              if (scrapeInfo.length > 0) {
                scrapeInfo.forEach(function (s) {
                  console.log(s);
                  if (s.info_hash === t.info_hash) {
                    t.update({
                      torrent_seeds: s.data.complete,
                      torrent_finished: s.data.downloaded,
                      torrent_leechers: s.data.incomplete
                    }).exec();
                  }
                });
                if (cb) cb(null, scrapeInfo);
              } else {
                if (cb) cb('422 result is empty', null);
              }
            }
          });
        } else if (response.statusCode === 403) {
          if (cb) cb('403 Forbidden', null);
        }

        //update torrent last scrape time
        t.update({
          last_scrape: Date.now()
        }).exec();
      }
    });
  }

  /**
   * doUDPScrape
   */
  function doUDPScrape() {
    var server = dgram.createSocket('udp4');
    var connectionIdHigh = 0x417;
    var connectionIdLow = 0x27101980;
    var transactionId = Math.floor((Math.random() * 100000) + 1);
    var action;

    var ACTION_CONNECT = 0;
    var ACTION_ANNOUNCE = 1;
    var ACTION_SCRAPE = 2;
    var ACTION_ERROR = 3;

    //server.on('listening', function () {
    //  var address = server.address();
    //  console.log('server listening ' + address.address + ':' + address.port);
    //});

    server.on('message', function (msg, rinfo) {
      var buf = new Buffer(msg);

      //console.log(rinfo);
      action = buf.readUInt32BE(0, 4);
      transactionId = buf.readUInt32BE(4, 4);
      //console.log('returned action: ' + action);
      //console.log('returned transactionId: ' + transactionId);

      if (action === ACTION_CONNECT) {
        //console.log('connect response');
        connectionIdHigh = buf.readUInt32BE(8, 4);
        connectionIdLow = buf.readUInt32BE(12, 4);
        scrapeTorrent();
      } else if (action === ACTION_SCRAPE) {
        //console.log('scrape response');
        var _info = {};
        _info.complete = buf.readUInt32BE(8, 4);
        _info.downloaded = buf.readUInt32BE(12, 4);
        _info.incomplete = buf.readUInt32BE(16, 4);

        scrapeInfo.push({
          info_hash: t.info_hash,
          data: _info
        });
        //console.log(scrapeInfo);
        if (scrapeInfo.length > 0) {
          scrapeInfo.forEach(function (s) {
            console.log(s);
            if (s.info_hash === t.info_hash) {
              t.update({
                torrent_seeds: s.data.complete,
                torrent_finished: s.data.downloaded,
                torrent_leechers: s.data.incomplete
              }).exec();
            }
          });
          if (cb) cb(null, scrapeInfo);
        } else {
          if (cb) cb('422 result is empty', null);
        }

        //update torrent last scrape time
        t.update({
          last_scrape: Date.now()
        }).exec();
      } else if (action === ACTION_ERROR) {
        //console.log('error response');
        if (cb) cb('ACTION_ERROR', null);
      }
    });

    server.bind();
    startConnection();

    function startConnection() {
      var buf = new Buffer(16);

      buf.fill(0);

      buf.writeUInt32BE(connectionIdHigh, 0);
      buf.writeUInt32BE(connectionIdLow, 4);
      buf.writeUInt32BE(ACTION_CONNECT, 8);
      buf.writeUInt32BE(transactionId, 12);

      sendPacket(buf);
    }

    function sendPacket(buf) {
      server.send(buf, 0, buf.length, port, hostname, function (err, bytes) {
        if (err) {
          //console.log(err.message);
          if (cb) cb(err, null);
        }
      });
    }

    function scrapeTorrent() {
      var buf = new Buffer(36);

      buf.fill(0);

      buf.writeUInt32BE(connectionIdHigh, 0);
      buf.writeUInt32BE(connectionIdLow, 4);
      buf.writeUInt32BE(ACTION_SCRAPE, 8);
      buf.writeUInt32BE(transactionId, 12);
      buf.write(info_hash, 16, buf.length, 'hex');

      // do scrape
      sendPacket(buf);
    }
  }
};
