'use strict';

/**
 * Module dependencies
 */
var tracesPolicy = require('../policies/traces.server.policy'),
  traces = require('../controllers/traces.server.controller');

module.exports = function (app) {
  app.route('/api/traces').all(tracesPolicy.isAllowed)
    .get(traces.list);

  app.route('/api/traces/:traceId').all(tracesPolicy.isAllowed)
    .delete(traces.delete);

  app.param('traceId', traces.traceByID);
};
