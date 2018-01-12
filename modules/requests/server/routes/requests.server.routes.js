'use strict';

/**
 * Module dependencies
 */
var requestsPolicy = require('../policies/requests.server.policy'),
  requests = require('../controllers/requests.server.controller');

module.exports = function (app) {
  app.route('/api/requests').all(requestsPolicy.isAllowed)
    .get(requests.list)
    .post(requests.create);

  app.route('/api/requests/:requestId').all(requestsPolicy.isAllowed)
    .get(requests.read)
    .put(requests.update)
    .delete(requests.delete);

  app.route('/api/requests/:requestId/accept/:torrentId').all(requestsPolicy.isAllowed)
    .put(requests.accept);

  app.param('requestId', requests.requestByID);
};
