'use strict';

/**
 * Module dependencies
 */
var torrents = require('../controllers/torrents.server.controller'),
  torrentsPolicy = require('../policies/torrents.server.policy');


module.exports = function (app) {
  // Articles collection routes
  app.route('/api/movieinfo/:tmdbid/:language').all(torrentsPolicy.isAllowed)
    .get(torrents.movieinfo);

  app.route('/api/tvinfo/:tmdbid/:language').all(torrentsPolicy.isAllowed)
    .get(torrents.tvinfo);

  app.route('/api/torrents/upload').all(torrentsPolicy.isAllowed)
    .post(torrents.upload);

  app.route('/api/torrents/announceEdit').all(torrentsPolicy.isAllowed)
    .post(torrents.announceEdit);

  app.route('/api/torrents/download/:torrentId').all(torrentsPolicy.isAllowed)
    .get(torrents.download);

  app.route('/api/torrents').all(torrentsPolicy.isAllowed)
    .get(torrents.list)
    .post(torrents.create);

  app.route('/api/torrents/:torrentId').all(torrentsPolicy.isAllowed)
    .get(torrents.read)
    .put(torrents.update)
    .delete(torrents.delete);

  app.route('/api/torrents/:torrentId/set/saletype/:saleType').all(torrentsPolicy.isAllowed)
    .put(torrents.setSaleType);

  app.route('/api/torrents/:torrentId/set/recommendlevel/:rlevel').all(torrentsPolicy.isAllowed)
    .put(torrents.setRecommendLevel);

  app.route('/api/torrents/:torrentId/set/reviewed').all(torrentsPolicy.isAllowed)
    .put(torrents.setReviewedStatus);

  app.param('torrentId', torrents.torrentByID);
};
