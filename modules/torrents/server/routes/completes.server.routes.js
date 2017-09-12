'use strict';

/**
 * Module dependencies
 */
var completes = require('../controllers/completes.server.controller'),
  torrentsPolicy = require('../policies/torrents.server.policy');


module.exports = function (app) {
  app.route('/api/completes/:completeId').all(torrentsPolicy.isAllowed)
    .put(completes.removeWarning);

  app.param('completeId', completes.completeByID);
};
