'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  tmdb = require('moviedb')('7888f0042a366f63289ff571b68b7ce0');

/**
 * Create an article
 */
exports.movieinfo = function (req, res) {
  console.log('------- API: movieinfo --------------------');

  tmdb.movieInfo({id: 263115, language: 'zh'}, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      res.json(info);
    }
  });
};

