'use strict';

/**
 * Module dependencies
 */
var subtitles = require('../controllers/subtitles.server.controller'),
  torrentsPolicy = require('../policies/torrents.server.policy');

module.exports = function (app) {
  app.route('/api/subtitles/:torrentId').all(torrentsPolicy.isAllowed)
    .post(subtitles.create);
  app.route('/api/subtitles/:torrentId/:subtitleId').all(torrentsPolicy.isAllowed)
    .get(subtitles.download)
    .delete(subtitles.delete);
};
