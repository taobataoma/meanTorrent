'use strict';

/**
 * Module dependencies
 */
var ranking = require('../controllers/ranking.server.controller');

module.exports = function (app) {
  // Ranking users collection routes
  app.route('/api/ranking')
    .get(ranking.list);

};
