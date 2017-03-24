'use strict';

/**
 * Module dependencies
 */
var announces = require('../controllers/announces.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/announce')
    .get(announces.info);

};
