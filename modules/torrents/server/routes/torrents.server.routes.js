'use strict';

/**
 * Module dependencies
 */
var torrents = require('../controllers/torrents.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/movieinfo')
    .get(torrents.movieinfo);

};
