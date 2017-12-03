'use strict';

var querystring = require('querystring');

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
