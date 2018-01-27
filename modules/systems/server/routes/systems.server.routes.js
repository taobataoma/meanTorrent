'use strict';

/**
 * Module dependencies
 */
var systemsPolicy = require('../policies/systems.server.policy'),
  systems = require('../controllers/systems.server.controller');

module.exports = function (app) {
  app.route('/api/systems/systemEnvConfigFiles').all(systemsPolicy.isAllowed)
    .get(systems.getSystemEnvConfigFiles);

  app.route('/api/systems/systemAssetsConfigFiles').all(systemsPolicy.isAllowed)
    .get(systems.getSystemAssetsConfigFiles);

  app.route('/api/systems/systemTransConfigFiles').all(systemsPolicy.isAllowed)
    .get(systems.getSystemTransConfigFiles);

  app.route('/api/systems/systemConfigContent').all(systemsPolicy.isAllowed)
    .get(systems.getSystemConfigContent)
    .put(systems.setSystemConfigContent);
};
