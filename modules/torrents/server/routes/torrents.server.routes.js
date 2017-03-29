'use strict';

/**
 * Module dependencies
 */
var torrents = require('../controllers/torrents.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/movieinfo/:tmdbid/:language')
    .get(torrents.movieinfo);

  app.route('/api/torrents/upload')
    .post(torrents.upload);

};
