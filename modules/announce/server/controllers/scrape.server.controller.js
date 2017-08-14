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

/**
 * info api
 * @param req
 * @param res
 */
exports.scrape = function (req, res) {

};
