'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  common = require(path.resolve('./config/lib/common')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Torrent = mongoose.model('Torrent'),
  Peer = mongoose.model('Peer'),
  Complete = mongoose.model('Complete'),
  moment = require('moment'),
  async = require('async'),
  sprintf = require('sprintf-js').sprintf,
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create,
  scoreUpdate = require(path.resolve('./config/lib/score')).update;

var traceConfig = config.meanTorrentConfig.trace;
var scoreConfig = config.meanTorrentConfig.score;
var hnrConfig = config.meanTorrentConfig.hitAndRun;
var signConfig = config.meanTorrentConfig.sign;
var announceConfig = config.meanTorrentConfig.announce;
var globalSalesConfig = config.meanTorrentConfig.torrentGlobalSales;

var appConfig = config.meanTorrentConfig.app;

var mtDebug = require(path.resolve('./config/lib/debug'));

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
  154: 'Invalid passkey, if you changed you passkey, please redownload the torrent file from ' + appConfig.domain,

  160: 'Invalid torrent info_hash',
  161: 'No torrent with that info_hash has been found',

  170: 'your account status is banned',
  171: 'your account status is inactive',
  172: 'your client is not allowed, here is the blacklist: ' + appConfig.domain + announceConfig.clientBlackListUrl,
  173: 'this torrent status is not reviewed by administrators, try again later',
  174: 'this torrent is only for VIP members',
  175: 'your account status is idle',

  180: 'You can not open more than 1 downloading processes on the same torrent',
  181: 'You can not open more than 3 seeding processes on the same torrent',
  182: 'save peer failed',
  183: 'save torrent failed',
  184: 'save passkeyuser failed',
  185: 'get H&R completeTorrent failed',
  186: 'create H&R completeTorrent failed',

  190: 'You have more H&R warning, can not download any torrent now!',
  191: 'not find this torrent H&R complete data',

  200: 'Your total ratio is less than %.2f, can not download anything',

  600: 'This tracker only supports compact mode',
  900: 'Generic error'
};

const EVENT_NONE = 0;
const EVENT_COMPLETED = 1;
const EVENT_STARTED = 2;
const EVENT_STOPPED = 3;

const WANT_DEFAULT = 50;

const PEERSTATE_SEEDER = 'seeder';
const PEERSTATE_LEECHER = 'leecher';

const PEER_COMPACT_SIZE = 6;
const ANNOUNCE_INTERVAL = Math.floor(announceConfig.announceInterval / 1000);

const PARAMS_INTEGER = [
  'port', 'uploaded', 'downloaded', 'left', 'compact', 'numwant'
];

const PARAMS_STRING = [
  'event'
];

var isGlobalSaleValid = false;

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
 * info api
 * @param req
 * @param res
 */
exports.announce = function (req, res) {
  req.torrent = undefined;
  req.currentPeer = undefined;
  req.completeTorrent = undefined;
  req.selfpeer = [];
  req.seeder = false;

  mtDebug.debugGreen('------------ Announce request ----------------', 'ANNOUNCE_REQUEST');
  //mtDebug.debugGreen(req.url);

  var s = req.url.split('?');
  var query = common.querystringParse(s[1]);
  var passkey = req.params.passkey || query.passkey || undefined;

  async.waterfall([
    /*---------------------------------------------------------------
     validateQueryCheck
     ---------------------------------------------------------------*/
    function (done) {
      var i = 0;
      var p;

      if (req.method !== 'GET') {
        done(100);
      } else if (typeof query.info_hash === 'undefined') {
        done(101);
      } else if (typeof query.peer_id === 'undefined') {
        done(102);
      } else if (typeof query.port === 'undefined') {
        done(103);
      } else if (query.info_hash.length !== 20) {
        done(150);
      } else if (query.peer_id.length !== 20) {
        done(151);
      } else if (typeof query.compact === 'undefined' || query.compact !== '1') {
        done(600);
      } else {
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

        query.info_hash = common.binaryToHex(query.info_hash);
        req.seeder = (query.left === 0) ? true : false;

        done(null);
      }
    },

    /*---------------------------------------------------------------
     validatePasskeyCheck
     ---------------------------------------------------------------*/
    function (done) {
      if (typeof passkey === 'undefined') {
        done(104);
      } else if (passkey.length !== 32) {
        done(153);
      } else if (req.passkeyuser === undefined) {
        done(154);
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     validateUserCheck
     check normal, banned, idle, inactive
     ---------------------------------------------------------------*/
    function (done) {
      switch (req.passkeyuser.status) {
        case 'banned':
          done(170);
          break;
        case 'idle':
          done(175);
          break;
        case 'inactive':
          done(171);
          break;
        default:
          done(null);
      }
    },

    /*---------------------------------------------------------------
     validateClientCheck
     check client blacklist
     ---------------------------------------------------------------*/
    function (done) {
      var ua = req.get('User-Agent');
      var inlist = false;
      if (ua) {
        config.meanTorrentConfig.clientBlackList.forEach(function (client) {
          if (ua.toUpperCase().indexOf(client.name.toUpperCase()) >= 0) {
            inlist = true;
          }
        });
      }
      if (inlist) {
        done(172);
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     getTorrentItemData
     torrent data include peers
     ---------------------------------------------------------------*/
    function (done) {
      Torrent.findOne({
        info_hash: query.info_hash
      })
        .populate('user')
        .populate({
          path: '_peers'
        })
        .exec(function (err, t) {
          if (err) {
            done(160);
          } else if (!t) {
            done(161);
          } else if (t.torrent_status === 'new') {
            done(173);
          } else {
            req.torrent = t;
            done(null);
          }
        });
    },

    /*---------------------------------------------------------------
     refresh user`s vip status and ratio
     update torrent isSaling status
     ---------------------------------------------------------------*/
    function (done) {
      req.passkeyuser.globalUpdateMethod(function (u) {
        req.passkeyuser = u;

        if (req.torrent.isSaling) {
          req.torrent.globalUpdateMethod(function (t) {
            req.torrent = t;
            done(null);
          });
        } else {
          done(null);
        }
      });
    },

    /*---------------------------------------------------------------
     check torrent_vip and user_vip status
     ---------------------------------------------------------------*/
    function (done) {
      if (!req.seeder && req.torrent.torrent_vip && !req.passkeyuser.isVip) {
        done(174);
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     find complete torrent data
     if not find and torrent is h&r and user isn`t vip, then create complete record
     ---------------------------------------------------------------*/
    function (done) {
      if (req.torrent.torrent_hnr && !req.passkeyuser.isVip) {
        Complete.findOne({
          torrent: req.torrent._id,
          user: req.passkeyuser._id
        })
          .populate('user')
          .populate('torrent')
          .exec(function (err, t) {
            if (err) {
              done(185);
            } else {
              if (!t) {
                var comp = new Complete();
                comp.torrent = req.torrent;
                comp.user = req.passkeyuser;
                comp.complete = req.seeder ? true : false;

                comp.save(function (err) {
                  if (err) {
                    done(186);
                  } else {
                    req.completeTorrent = comp;
                    done(null);
                  }
                });
              } else {
                req.completeTorrent = t;
                done(null);
              }
            }
          });
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     some time, when user close download client directly, maybe some ghost peer stay in peers table and not in torrent._peers
     delete them on start event of any user
     ----------------------------------------------------------------*/
    function (done) {
      if (event(query.event) === EVENT_STARTED) {
        Peer.remove({
          torrent: req.torrent._id,
          _id: {$nin: req.torrent._peers}
        }, function (err, removed) {
          if (removed.n > 0) {
            mtDebug.debugRed('Removed ' + removed + ' peers not in torrent._peers: ' + req.torrent._id, 'ANNOUNCE_REQUEST');
          }
        });
      }

      done(null);
    },

    /*---------------------------------------------------------------
     check N&R can download
     if user has too more H&R warning numbers, can not download any torrent
     but can continue download the warning status torrent
     vip user not checked
     ---------------------------------------------------------------*/
    function (done) {
      if (!req.seeder && !req.passkeyuser.isVip && event(query.event) === EVENT_STARTED) {
        if (req.passkeyuser.hnr_warning >= hnrConfig.forbiddenDownloadMinWarningNumber) {
          if (!req.torrent.torrent_hnr) {
            done(190);
          } else {
            if (!req.completeTorrent) {
              done(191);
            } else {
              if (!req.completeTorrent.hnr_warning) {
                done(190);
              } else {
                done(null);
              }
            }
          }
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     announce download check
     ratio check, setting in announce.downloadCheck
     vip user not checked
     ---------------------------------------------------------------*/
    function (done) {
      if (!req.seeder && !req.passkeyuser.isVip && event(query.event) === EVENT_STARTED) {
        if (req.passkeyuser.ratio !== -1 && req.passkeyuser.ratio < announceConfig.downloadCheck.ratio) {
          var checkTimeBegin = moment(req.passkeyuser.created).add(announceConfig.downloadCheck.checkAfterSignupDays, 'd');
          if (checkTimeBegin < moment(Date.now())) {
            var reason = sprintf(FAILURE_REASONS[200], announceConfig.downloadCheck.ratio);
            done(200, reason);
          } else {
            done(null);
          }
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     find myself peers and get current peer with same peer_id
     ----------------------------------------------------------------*/
    function (done) {
      if (req.torrent._peers.length > 0) {
        for (var i = req.torrent._peers.length; i > 0; i--) {
          var p = req.torrent._peers[i - 1];
          if (p.user.equals(req.passkeyuser._id)) {
            req.selfpeer.push(p);
          }
        }
      }

      getCurrentPeer(function () {
        done(null);
      });
    },

    /*---------------------------------------------------------------
     onEventStarted
     if downloading, check download peer num only 1
     if seeding, check seed peer num can not more than 3
     numbers is in setting announceConfig.announceCheck
     ---------------------------------------------------------------*/
    function (done) {
      if (event(query.event) === EVENT_STARTED) {
        mtDebug.debugGreen('---------------EVENT_STARTED----------------', 'ANNOUNCE_REQUEST');

        var lcount = getSelfLeecherCount();
        var scount = getSelfSeederCount();

        if (lcount > announceConfig.announceCheck.maxLeechNumberPerUserPerTorrent && !req.seeder) {
          mtDebug.debugYellow('getSelfLeecherCount = ' + lcount, 'ANNOUNCE_REQUEST');
          removeCurrPeer();
          done(180);
        } else if (scount > announceConfig.announceCheck.maxSeedNumberPerUserPerTorrent && req.seeder) {
          mtDebug.debugYellow('getSelfSeederCount = ' + scount, 'ANNOUNCE_REQUEST');
          removeCurrPeer();
          done(181);
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     writeUpDownData
     uploaded,downloaded
     update complete data if completeTorrent is exist
     if has upload and download data size, write data size,
     write time of seed(complete) whether or not u/d is 0
     ---------------------------------------------------------------*/
    function (done) {
      mtDebug.debugGreen('---------------WRITE_UP_DOWN_DATA----------------', 'ANNOUNCE_REQUEST');

      var curru = 0;
      var currd = 0;

      if (!req.currentPeer.isNewCreated) {
        var udr = getUDRatio();

        curru = query.uploaded - req.currentPeer.peer_uploaded;
        currd = query.downloaded - req.currentPeer.peer_downloaded;

        if (curru > 0 || currd > 0) {
          var u = Math.round(curru * udr.ur);
          var d = Math.round(currd * udr.dr);

          if (req.passkeyuser.isVip) {
            u = u * globalSalesConfig.vip.value.Ur;
            d = d * globalSalesConfig.vip.value.Dr;
          }

          req.passkeyuser.uploaded += u;
          req.passkeyuser.downloaded += d;
          req.passkeyuser.save();

          //write peer speed
          req.currentPeer.update({
            $set: {
              peer_uspeed: Math.round(curru / (Date.now() - req.currentPeer.last_announce_at) * 1000),
              peer_dspeed: Math.round(currd / (Date.now() - req.currentPeer.last_announce_at) * 1000)
            }
          }).exec();

          //create trace log
          traceLogCreate(req, traceConfig.action.userAnnounceData, {
            user: req.passkeyuser._id,
            torrent: req.torrent._id,

            query_uploaded: query.uploaded,
            query_downloaded: query.downloaded,
            currentPeer_uploaded: req.currentPeer.peer_uploaded,
            currentPeer_downloaded: req.currentPeer.peer_downloaded,

            curr_uploaded: curru,
            curr_downloaded: currd,
            write_uploaded: u,
            write_downloaded: d,

            isVip: req.passkeyuser.isVip,
            torrentSalesValue: req.torrent.torrent_sale_status,
            globalSalesValue: isGlobalSaleValid ? globalSalesConfig.global.value : undefined,
            vipSalesValue: globalSalesConfig.vip.value,

            agent: req.get('User-Agent'),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            port: query.port
          });

          //update score
          //upload score and download score
          var action = scoreConfig.action.seedUpDownload;
          if (action.enable) {
            var uploadScore = 0;
            var downloadScore = 0;
            if (curru > 0 && action.uploadEnable) {
              var upUnitScore = 1;
              if (req.torrent.torrent_size > action.additionSize) {
                upUnitScore = Math.round(Math.sqrt(req.torrent.torrent_size / action.additionSize) * 100) / 100;
              }
              var upScore = Math.round((curru / action.perlSize) * 100) / 100;
              uploadScore = upUnitScore * action.uploadValue * upScore;
            }
            if (currd > 0 && action.downloadEnable) {
              var downUnitScore = 1;
              if (req.torrent.torrent_size > action.additionSize) {
                downUnitScore = Math.round(Math.sqrt(req.torrent.torrent_size / action.additionSize) * 100) / 100;
              }
              var downScore = Math.round((curru / action.perlSize) * 100) / 100;
              downloadScore = downUnitScore * action.downloadValue * downScore;
            }

            var totalScore = uploadScore + downloadScore;
            if (totalScore > 0) {
              //vip addition
              if (req.passkeyuser.isVip) {
                totalScore = totalScore * action.vipRatio;
              }

              //torrent seeders count addition
              if (req.torrent.torrent_seeds <= 10) {
                var seederUnit = action.seederBasicRatio + 1 - ((req.torrent.torrent_seeds - 1) * action.seederCoefficient);
                totalScore = totalScore * seederUnit;
              }

              //torrent life addition
              var life = moment(Date.now()) - moment(req.torrent.createdat);
              var days = Math.floor(life / (60 * 60 * 1000 * 24));
              var lifeUnit = action.lifeBasicRatio + action.lifeCoefficientOfDay * days;
              totalScore = totalScore * lifeUnit;
              totalScore = Math.round(totalScore * 100) / 100;

              scoreUpdate(req, req.passkeyuser, action, totalScore);
            }
          }
        }
      }

      //write peer data
      req.currentPeer.peer_uploaded = query.uploaded;
      req.currentPeer.peer_downloaded = query.downloaded;
      req.currentPeer.peer_left = query.peer_left;
      req.currentPeer.save();

      done(null, curru, currd);
    },

    /*---------------------------------------------------------------
      write complete data to completeTorrent and refresh completed ratio
     ---------------------------------------------------------------*/
    function (curru, currd, done) {
      if (curru > 0 || currd > 0) {
        if (req.completeTorrent) {
          req.completeTorrent.total_uploaded += curru;
          req.completeTorrent.total_downloaded += currd;
          req.completeTorrent.save(function () {
            done(null);
          });
        }
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     update H&R completeTorrent.total_seed_time
     update H&R ratio in save
     ---------------------------------------------------------------*/
    function (done) {
      if (!req.currentPeer.isNewCreated) {
        if (req.completeTorrent && req.completeTorrent.complete && event(query.event) !== EVENT_COMPLETED) {
          req.completeTorrent.total_seed_time += (Date.now() - req.currentPeer.last_announce_at);
          req.completeTorrent.save(function () {
            done(null);
          });
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     upload user getting score through seed timed
     include torrent seeders count coefficient value and life coefficient value
     ---------------------------------------------------------------*/
    function (done) {
      if (!req.currentPeer.isNewCreated) {
        if (req.seeder && event(query.event) !== EVENT_COMPLETED) {
          var action = scoreConfig.action.seedTimed;
          if (action.enable) {
            var timed = Date.now() - req.currentPeer.last_announce_at;
            var seedUnit = Math.round((timed / action.additionTime) * 100) / 100;
            var seedScore = seedUnit * action.timedValue;

            if (seedScore > 0) {
              //vip addition
              if (req.passkeyuser.isVip) {
                seedScore = seedScore * action.vipRatio;
              }

              //torrent seeders count addition
              if (req.torrent.torrent_seeds <= 10) {
                var seederUnit = action.seederBasicRatio + 1 - ((req.torrent.torrent_seeds - 1) * action.seederCoefficient);
                seedScore = seedScore * seederUnit;
              }

              //torrent life addition
              var life = moment(Date.now()) - moment(req.torrent.createdat);
              var days = Math.floor(life / (60 * 60 * 1000 * 24));
              var lifeUnit = action.lifeBasicRatio + action.lifeCoefficientOfDay * days;
              seedScore = seedScore * lifeUnit;
              seedScore = Math.round(seedScore * 100) / 100;

              scoreUpdate(req, req.passkeyuser, action, seedScore);
            }
          }
        } else {
          done(null);
        }
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     update currentPeer.last_announce_at
     update complateTorrent refreshat
     ---------------------------------------------------------------*/
    function (done) {
      if (!req.currentPeer.isNewCreated) {
        req.currentPeer.last_announce_at = Date.now();
        req.currentPeer.save();
      }

      if (req.completeTorrent) {
        req.completeTorrent.globalUpdateMethod();
      }

      done(null);
    },

    /*---------------------------------------------------------------
     onEventCompleted
     ---------------------------------------------------------------*/
    function (done) {
      if (event(query.event) === EVENT_COMPLETED) {
        mtDebug.debugGreen('---------------EVENT_COMPLETED----------------', 'ANNOUNCE_REQUEST');
        doCompleteEvent(function () {
          done(null);
        });
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     count H&R warning for user on normal up/down process
     ---------------------------------------------------------------*/
    function (done) {
      if (!req.currentPeer.isNewCreated) {
        if (req.completeTorrent && event(query.event) !== EVENT_COMPLETED) {
          req.completeTorrent.countHnRWarning(false, true);
        }
      }
      done(null);
    },

    /*---------------------------------------------------------------
     onEventStopped
     count H&R warning for user when EVENT_STOPPED
     delete peers
     ---------------------------------------------------------------*/
    function (done) {
      if (event(query.event) === EVENT_STOPPED) {
        mtDebug.debugGreen('---------------EVENT_STOPPED----------------', 'ANNOUNCE_REQUEST');

        if (req.completeTorrent) {
          req.completeTorrent.countHnRWarning(true, false);
        }
        removeCurrPeer(function () {
          done(null);
        });
      } else {
        done(null);
      }
    },

    /*---------------------------------------------------------------
     update torrent and user seeding/leeching count numbers
     ---------------------------------------------------------------*/
    function (done) {
      req.torrent.updateSeedLeechNumbers(function (slCount) {
        req.passkeyuser.updateSeedLeechNumbers();

        if (slCount) {
          mtDebug.debugYellow(slCount, 'ANNOUNCE_REQUEST');
          req.torrent.torrent_seeds = slCount.seedCount;
          req.torrent.torrent_leechers = slCount.leechCount;
        }
        done(null);
      });
    },

    /*---------------------------------------------------------------
     sendPeers
     compact mode
     ---------------------------------------------------------------*/
    function (done) {
      var want = WANT_DEFAULT;
      if (typeof query.numwant !== 'undefined' && query.numwant > 0)
        want = query.numwant;

      var peerBuffer = new Buffer(want * PEER_COMPACT_SIZE);
      var len = writePeers(peerBuffer, want, req.torrent._peers);
      peerBuffer = peerBuffer.slice(0, len);

      var resp = 'd8:intervali' + ANNOUNCE_INTERVAL + 'e8:completei' + req.torrent.torrent_seeds + 'e10:incompletei' + req.torrent.torrent_leechers + 'e10:downloadedi' + req.torrent.torrent_finished + 'e5:peers' + len + ':';
      mtDebug.debugGreen(resp, 'ANNOUNCE_REQUEST');

      res.writeHead(200, {
        'Content-Length': resp.length + peerBuffer.length + 1,
        'Content-Type': 'text/plain'
      });

      if (len > 0) {
        mtDebug.debug(peerBuffer, 'ANNOUNCE_REQUEST');
      }
      res.write(resp);
      res.write(peerBuffer);
      res.end('e');

      done(null, 'done');
    }
  ], function (err, reason) {
    if (err) {
      sendError(new Failure(err, reason));
    }
  });

  /**
   * getCurrentPeer
   * @returns {boolean}
   */
  function getCurrentPeer(callback) {
    req.selfpeer.forEach(function (p) {
      if (p.peer_id === query.peer_id) {
        req.currentPeer = p;
        req.currentPeer.isNewCreated = false;

        if (req.seeder && req.currentPeer.peer_status !== PEERSTATE_SEEDER && event(query.event) !== EVENT_COMPLETED) {
          mtDebug.debugGreen('---------------PEER STATUS CHANGED: Seeder----------------', 'ANNOUNCE_REQUEST');
          doCompleteEvent(function () {
            if (callback) callback();
          });
        } else {
          if (callback) callback();
        }
      }
    });

    //if not found then create req.currentPeer
    if (!req.currentPeer) {
      createCurrentPeer(function () {
        if (callback) callback();
      });
    }
  }

  /**
   * doCompleteEvent
   */
  function doCompleteEvent(callback) {
    req.currentPeer.peer_status = PEERSTATE_SEEDER;
    req.currentPeer.save();

    req.torrent.torrent_finished += 1;
    req.torrent.save();

    req.passkeyuser.finished += 1;
    req.passkeyuser.save();

    //update completeTorrent complete status
    if (req.completeTorrent) {
      req.completeTorrent.complete = true;
      req.completeTorrent.save(function () {
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  /**
   * createCurrentPeer
   */
  function createCurrentPeer(callback) {
    var peer = new Peer();

    peer.user = req.passkeyuser;
    peer.torrent = req.torrent;
    peer.peer_id = query.peer_id;
    peer.peer_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    peer.peer_port = query.port;
    peer.peer_left = query.left;
    peer.peer_status = req.seeder ? PEERSTATE_SEEDER : PEERSTATE_LEECHER;
    peer.user_agent = req.get('User-Agent');
    peer.isNewCreated = true;
    peer.last_announce_at = Date.now();

    if (req.seeder) {
      peer.finishedat = Date.now();
    }

    req.selfpeer.push(peer);

    req.torrent.update({
      $addToSet: {_peers: peer}
    }).exec();

    //save ip to user
    req.passkeyuser.addLeechedIp(peer.peer_ip);
    req.passkeyuser.addClientAgent(peer.user_agent);

    peer.save(function (err) {
      if (!err) {
        req.currentPeer = peer;
        mtDebug.debugGreen('---------------createCurrentPeer()----------------', 'ANNOUNCE_REQUEST');
        if (callback) callback();
      }
    });
  }

  /**
   * removeCurrPeer
   */
  function removeCurrPeer(callback) {
    req.selfpeer.splice(req.selfpeer.indexOf(req.currentPeer), 1);

    req.torrent.update({
      $pull: {_peers: req.currentPeer._id}
    }).exec();

    req.currentPeer.remove(function () {
      if (callback) callback();
      mtDebug.debugGreen('---------------removeCurrPeer()----------------', 'ANNOUNCE_REQUEST');
    });
  }

  /**
   * getSelfLeecherCount
   * @returns {number}
   */
  function getSelfLeecherCount() {
    if (req.selfpeer.length === 0) {
      return 0;
    } else {
      var i = 0;

      req.selfpeer.forEach(function (p) {
        if (p.peer_status === PEERSTATE_LEECHER) {
          i++;
        }
      });

      return i;
    }
  }

  /**
   * getSelfSeederCount
   * @returns {number}
   */
  function getSelfSeederCount() {
    if (req.selfpeer.length === 0) {
      return 0;
    } else {
      var i = 0;

      req.selfpeer.forEach(function (p) {
        if (p.peer_status === PEERSTATE_SEEDER) {
          i++;
        }
      });

      return i;
    }
  }

  /**
   * getUDRatio
   * @returns {{}}
   */
  function getUDRatio() {
    var udr = {};
    var sale = req.torrent.torrent_sale_status;

    var start = moment(globalSalesConfig.global.startAt, globalSalesConfig.global.timeFormats).utc().valueOf();
    var end = start + globalSalesConfig.global.expires;
    var now = Date.now();
    isGlobalSaleValid = (now > start && now < end && globalSalesConfig.global.value) ? true : false;

    if (isGlobalSaleValid && globalSalesConfig.global.value) {
      sale = globalSalesConfig.global.value;
    }

    switch (sale) {
      case 'U1/FREE':
        udr.ur = 1;
        udr.dr = 0;
        break;
      case 'U1/D.3':
        udr.ur = 1;
        udr.dr = 0.3;
        break;
      case 'U1/D.5':
        udr.ur = 1;
        udr.dr = 0.5;
        break;
      case 'U1/D.8':
        udr.ur = 1;
        udr.dr = 0.8;
        break;
      case 'U2/FREE':
        udr.ur = 2;
        udr.dr = 0;
        break;
      case 'U2/D.3':
        udr.ur = 2;
        udr.dr = 0.3;
        break;
      case 'U2/D.5':
        udr.ur = 2;
        udr.dr = 0.5;
        break;
      case 'U2/D.8':
        udr.ur = 2;
        udr.dr = 0.8;
        break;
      case 'U2/D1':
        udr.ur = 2;
        udr.dr = 1;
        break;
      case 'U3/FREE':
        udr.ur = 3;
        udr.dr = 0;
        break;
      case 'U3/D.5':
        udr.ur = 3;
        udr.dr = 0.5;
        break;
      case 'U3/D.8':
        udr.ur = 3;
        udr.dr = 0.8;
        break;
      case 'U3/D1':
        udr.ur = 3;
        udr.dr = 1;
        break;
      default: /* U1D1 */
        udr.ur = 1;
        udr.dr = 1;
    }
    return udr;
  }

  /**
   * sendError
   * @param failure
   */
  function sendError(failure) {
    var respc = failure.bencode();
    mtDebug.debugRed(respc, 'ANNOUNCE_REQUEST');
    res.writeHead(200, {
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

    if (!req.seeder && event(query.event) !== EVENT_STOPPED && event(query.event) !== EVENT_COMPLETED) {
      var p;
      var bc;
      var m = Math.min(peers.length, count);
      for (var i = 0; i < m; i++) {
        var index = 0;
        if (peers.length < count) {
          index = i;
        } else {
          Math.floor(Math.random() * peers.length);
        }
        p = peers[index];

        if (p !== undefined && p !== req.currentPeer) {
          if (p.last_announce_at > (Date.now() - announceConfig.announceInterval - 60 * 1000)) { //do not send ghost peer
            if (p.user.equals(req.passkeyuser._id)) {
              if (announceConfig.peersCheck.peersSendListIncludeOwnSeed) {
                mtDebug.info(p._id);
                bc = compact(p);
                if (bc) {
                  bc.copy(buf, c++ * PEER_COMPACT_SIZE);
                }
              }
            } else {
              mtDebug.info(p._id);
              bc = compact(p);
              if (bc) {
                bc.copy(buf, c++ * PEER_COMPACT_SIZE);
              }
            }
          }
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
        req.passkeyuser = u;

        if ((moment(Date.now()) - moment(req.passkeyuser.last_signed)) > signConfig.accountIdleForTime) {
          req.passkeyuser.update({
            $set: {status: 'idle'}
          }).exec();
          req.passkeyuser.status = 'idle';
        }
      } else {
        req.passkeyuser = undefined;
      }
      next();
    });
};
