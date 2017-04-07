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

  app.route('/api/torrents/download/:torrentId')
    .get(torrents.download);

  app.route('/api/torrents')
    .get(torrents.list)
    .post(torrents.create);

  app.route('/api/torrents/:torrentId')
    .get(torrents.read)
    .put(torrents.update)
    .delete(torrents.delete);

  app.param('torrentId', torrents.torrentByID);
};
