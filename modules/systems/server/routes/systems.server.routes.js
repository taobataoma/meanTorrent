'use strict';

/**
 * Module dependencies
 */
var systemsPolicy = require('../policies/systems.server.policy'),
  systems = require('../controllers/systems.server.controller');

module.exports = function (app) {
  app.route('/api/systems/systemConfig').all(systemsPolicy.isAllowed)
    .get(systems.getSystemConfig)
    .put(systems.setSystemConfig);
};
