'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  moment = require('moment');

var appConfig = config.meanTorrentConfig.app;
var rssConfig = config.meanTorrentConfig.rss;
var vsprintf = require('sprintf-js').vsprintf;

/**
 * sendRSS
 * @param req
 * @param res
 * @param torrents
 */
module.exports.sendRSS = function (req, res, torrents) {
  var language = 'en';
  var stype = 'movie';

  if (req.query.language !== undefined) {
    language = req.query.language;
  }
  if (req.query.torrent_type !== undefined) {
    stype = req.query.torrent_type;
  }

  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });

  res.write('<?xml version="1.0" encoding="utf-8" ?>');
  res.write('<rss version="2.0">');
  res.write('<channel>');

  var title = vsprintf(rssConfig.title, [appConfig.name + ' - ' + stype]);
  var link = appConfig.domain;
  var desc = vsprintf(rssConfig.description, [appConfig.name]);
  var lang = language;
  var copy = vsprintf(rssConfig.copyright, [appConfig.name]);
  var editor = vsprintf(rssConfig.managingEditor, [appConfig.name]);
  var master = vsprintf(rssConfig.webMaster, [appConfig.name]);
  var lastBuild = moment().toString();
  var gen = rssConfig.generator;
  var docs = 'http://www.rssboard.org/rss-specification';
  var ttl = rssConfig.ttl;
  var img = {
    title: title,
    link: link,
    desc: desc,
    url: appConfig.domain + '/modules/core/client/img/rss.jpeg'
  };

  res.write('<title>' + getEscapeData(title) + '</title>');
  res.write('<link>' + getEscapeData(link) + '</link>');
  res.write('<description>' + getEscapeData(desc) + '</description>');
  res.write('<language>' + getEscapeData(lang, false) + '</language>');
  res.write('<copyright>' + getEscapeData(copy) + '</copyright>');
  res.write('<managingEditor>' + getEscapeData(editor) + '</managingEditor>');
  res.write('<webMaster>' + getEscapeData(master) + '</webMaster>');
  res.write('<lastBuildDate>' + getEscapeData(lastBuild, false) + '</lastBuildDate>');
  res.write('<generator>' + getEscapeData(gen) + '</generator>');
  res.write('<docs>' + getEscapeData(docs) + '</docs>');
  res.write('<ttl>' + getEscapeData(ttl, false) + '</ttl>');
  res.write('<image>');
  res.write('<title>' + getEscapeData(img.title) + '</title>');
  res.write('<link>' + getEscapeData(img.link) + '</link>');
  res.write('<url>' + getEscapeData(img.url) + '</url>');
  res.write('<width>100</width>');
  res.write('<height>100</height>');
  res.write('<description>' + getEscapeData(img.desc) + '</description>');
  res.write('</image>');

  torrents.forEach(function (t) {
    var tTitle = t.torrent_filename;
    var tLink = appConfig.domain + '/torrents/' + t._id;
    var tDesc = t.resource_detail_info.overview;
    var tAuth = t.user.displayName;
    var tComm = tLink;
    var tPub = moment(t.createdat).toString();
    var tGuid = t.info_hash;
    var tCat = {
      value: stype,
      domain: appConfig.domain + '/torrents/' + stype
    };
    var tEnc = {
      url: appConfig.domain + '/api/torrents/download/' + t._id + '/' + req.passkeyuser.passkey,
      type: 'application/x-bittorrent',
      length: t.torrent_size
    };


    res.write('<item>');
    res.write('<title>' + getEscapeData(tTitle) + '</title>');
    res.write('<link>' + getEscapeData(tLink) + '</link>');
    res.write('<description>' + getEscapeData(tDesc) + '</description>');
    res.write('<author>' + getEscapeData(tAuth) + '</author>');
    res.write('<category domain="' + getEscapeData(tCat.domain, false) + '">' + getEscapeData(tCat.value) + '</category>');
    res.write('<comments>' + getEscapeData(tComm) + '</comments>');
    res.write('<enclosure url="' + getEscapeData(tEnc.url, false) + '" length="' + getEscapeData(tEnc.length, false) + '" type="' + getEscapeData(tEnc.type, false) + '" />');
    res.write('<guid isPermaLink="false">' + getEscapeData(tGuid, false) + '</guid>');
    res.write('<pubDate>' + getEscapeData(tPub, false) + '</pubDate>');
    res.write('</item>');

  });

  res.write('</channel>');
  res.write('</rss>');
  res.end();
};

/**
 * getEscapeData
 * @param s
 * @param cdata
 * @returns {string}
 */
function getEscapeData(s, cdata = true) {
  s = s + '';
  var RexStr = /\<|\>|\&|\'|\"/g;
  var ns = s.replace(RexStr, function (MatchStr) {
    switch (MatchStr) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        break;
    }
  });

  if (cdata) {
    return '<![CDATA[' + ns + ']]>';
  } else {
    return ns;
  }
}
