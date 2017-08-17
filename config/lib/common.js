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
