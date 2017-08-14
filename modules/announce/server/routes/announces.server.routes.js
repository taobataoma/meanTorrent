'use strict';

/**
 * Module dependencies
 */
var announces = require('../controllers/announces.server.controller'),
  scrape = require('../controllers/scrape.server.controller');

module.exports = function (app) {
  app.route('/announce/:passkey')
    .get(announces.announce);
  app.route('/announce')
    .get(announces.announce);
  app.route('/scrape')
    .get(scrape.scrape);

  app.param('passkey', announces.userByPasskey);
};
