'use strict';

function now() {
  return Math.floor(new Date().getTime() / 1000);
}

const EVENT_NONE = 0;
const EVENT_COMPLETED = 1;
const EVENT_STARTED = 2;
const EVENT_STOPPED = 3;

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


const PEERSTATE_SEEDER = 0;
const PEERSTATE_LEECHER = 1;

const PEER_COMPACT_SIZE = 6;

const ANNOUNCE_INTERVAL = 60;

function Peer(ip, port, left) {
  if (!(this instanceof Peer))
    return new Peer(ip, port, left);

  this.compact = this._compact(ip, port);

  this.state = (left > 0) ? PEERSTATE_LEECHER : PEERSTATE_SEEDER;

  this.touch();
}

Peer.prototype = {
  touch: function () {
    this.lastAction = now();
  },
  timedOut: function (n) {
    return n - this.lastAction > ANNOUNCE_INTERVAL * 2;
  },
  _compact: function (ip, port) {
    var b = new Buffer(PEER_COMPACT_SIZE);

    var parts = ip.split('.');
    if (parts.length !== 4)
      throw new Error('ip length error');

    for (var i = 0; i < 4; i++)
      b[i] = parseInt(parts[i], 10);

    b[4] = (port >> 8) & 0xff;
    b[5] = port & 0xff;

    return b;
  }
};

function File() {
  if (!(this instanceof File))
    return new File();

  this.peerList = [];
  this.peerDict = {};

  this.downloads = 0;
  this.seeders = 0;
  this.leechers = 0;

  this.lastCompact = now();
}

File.prototype = {
  addPeer: function (peerId, peer, event) {
    // Check if it is time to compact the peer list
    var n = now();
    if (this.seeders + this.leechers < this.peerList.length / 2 && this.peerList.length > 10 || (n - this.lastCompact) > ANNOUNCE_INTERVAL * 2) {
      var newPeerList = [];
      var i = 0;
      for (var p in this.peerDict) {
        if (!this.peerDict.hasOwnProperty(p))
          continue;

        var tmpPeer = this.peerList[this.peerDict[p]];

        // Check if the peer is still alive
        if (tmpPeer.timedOut(n)) {
          if (tmpPeer.state === PEERSTATE_LEECHER)
            this.leechers--;
          else
            this.seeders--;

          delete this.peerDict[p];
          continue;
        }

        newPeerList.push(tmpPeer);
        this.peerDict[p] = i++;
      }

      this.peerList = newPeerList;

      this.lastCompact = n;
    }

    if (event === EVENT_COMPLETED && peer.state === PEERSTATE_SEEDER)
      this.downloads++;

    // Check if the peer already exists
    if (this.peerDict.hasOwnProperty(peerId)) {
      var index = this.peerDict[peerId];
      var oldPeer = this.peerList[index];

      if (event === EVENT_STOPPED) {
        if (oldPeer.state === PEERSTATE_LEECHER)
          this.leechers--;
        else
          this.seeders--;

        delete this.peerList[index];
        delete this.peerDict[peerId];
      } else {
        // TODO: Should probably update compact in the old peer. So we
        // handle the case if the user switched IP or Port. But we
        // probably only want to do it if they differ
        // oldPeer.compact = peer.compact;

        if (oldPeer.state !== peer.state) {
          if (peer.state === PEERSTATE_LEECHER) {
            this.leechers++;
            this.seeders--;
          } else {
            this.leechers--;
            this.seeders++;
          }

          oldPeer.state = peer.state;
        }
      }

      peer = oldPeer;
      peer.touch();

    } else if (event !== EVENT_STOPPED) {
      this.peerDict[peerId] = this.peerList.length;
      this.peerList.push(peer);

      if (peer.state === PEERSTATE_LEECHER)
        this.leechers++;
      else
        this.seeders++;
    }

    return peer;
  },
  writePeers: function (b, count, selfPeer) {
    var c = 0;
    var i = 0;
    var p;

    if (count > this.seeders + this.leechers) {
      for (i = this.peerList.length - 1; i >= 0; i--) {
        p = this.peerList[i];
        if (p !== undefined && p !== selfPeer)
          p.compact.copy(b, c++ * PEER_COMPACT_SIZE);
      }
    } else {
      var m = Math.min(this.peerList.length, count);
      for (i = 0; i < m; i++) {
        var index = Math.floor(Math.random() * this.peerList.length);
        p = this.peerList[index];
        if (p !== undefined && p !== selfPeer)
          p.compact.copy(b, c++ * PEER_COMPACT_SIZE);
      }
    }

    return c * PEER_COMPACT_SIZE;
  }
};

function Tracker() {
  if (!(this instanceof Tracker))
    return new Tracker();

  this.files = {};
}

Tracker.prototype = {
  getFile: function (infoHash) {
    if (this.files.hasOwnProperty(infoHash))
      return this.files[infoHash];

    return this.addFile(infoHash);
  },
  addFile: function (infoHash) {
    return (this.files[infoHash] = new File());
  }
};

exports.PEER_COMPACT_SIZE = PEER_COMPACT_SIZE;
exports.ANNOUNCE_INTERVAL = ANNOUNCE_INTERVAL;

exports.event = event;
exports.Peer = Peer;
exports.Tracker = Tracker;
