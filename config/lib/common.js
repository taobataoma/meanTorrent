'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  moment = require('moment');

var querystring = require('querystring');
var examinationConfig = config.meanTorrentConfig.examination;
var languageConfig = config.meanTorrentConfig.language;

/**
 * binaryToHex
 * @param str
 */
module.exports.binaryToHex = function (str) {
  if (typeof str !== 'string') {
    str = String(str);
  }
  return Buffer.from(str, 'binary').toString('hex');
};

/**
 * hexToBinary
 * @param str
 */
module.exports.hexToBinary = function (str) {
  if (typeof str !== 'string') {
    str = String(str);
  }
  return Buffer.from(str, 'hex').toString('binary');
};


/**
 * querystringParse
 * @param q
 */
module.exports.querystringParse = function (q) {
  return querystring.parse(q, null, null, {decodeURIComponent: unescape});
};

/**
 * fileSizeFormat
 * @param bytes
 * @param precision
 * @returns {*}
 */
module.exports.fileSizeFormat = function (bytes, precision) {
  if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
  if (typeof precision === 'undefined') precision = 1;
  //var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
  var units = ['b', 'K', 'M', 'G', 'T', 'P'],
    number = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + units[number];
};

/**
 * examinationIsValid
 * @param user
 * @returns {boolean}
 */
module.exports.examinationIsValid = function (user) {
  var start = moment(examinationConfig.timeSet.startAt, examinationConfig.timeSet.timeFormats).valueOf();
  var end = moment(examinationConfig.timeSet.endAt, examinationConfig.timeSet.timeFormats).valueOf();
  var now = Date.now();

  if (now > start && now < end && user.examinationData) {
    return true;
  } else {
    return false;
  }
};

/**
 * getRequestLanguage
 * @param req
 */
module.exports.getRequestLanguage = function (req) {
  var mtLang = languageConfig.map(function (l) {
    return l.name;
  });
  var lang = req.acceptsLanguages(mtLang);
  return lang || 'en';
};
