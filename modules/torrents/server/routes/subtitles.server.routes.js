'use strict';

/**
 * Module dependencies
 */
var subtitles = require('../controllers/subtitles.server.controller');

module.exports = function (app) {
  app.route('/api/subtitles/:torrentId')
    .post(subtitles.create);
  app.route('/api/subtitles/:torrentId/:subtitleId')
    .delete(subtitles.delete);
};
