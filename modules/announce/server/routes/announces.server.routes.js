'use strict';

/**
 * Module dependencies
 */
var announces = require('../controllers/announces.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/announce/:passkey')
    .get(announces.announce);
  app.route('/announce')
    .get(announces.announce);

  app.param('passkey', announces.userByPasskey);
};
