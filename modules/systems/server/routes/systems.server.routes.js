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

  app.route('/api/systems/systemTemplateFrontConfigFiles').all(systemsPolicy.isAllowed)
    .get(systems.getSystemTemplateFrontConfigFiles);

  app.route('/api/systems/systemTemplateBackConfigFiles').all(systemsPolicy.isAllowed)
    .get(systems.getSystemTemplateBackConfigFiles);

  app.route('/api/systems/systemConfigContent').all(systemsPolicy.isAllowed)
    .get(systems.getSystemConfigContent)
    .put(systems.setSystemConfigContent);

  app.route('/api/systems/shellCommand').all(systemsPolicy.isAllowed)
    .put(systems.shellCommand);

  app.route('/api/systems/initExaminationData').all(systemsPolicy.isAllowed)
    .put(systems.initExaminationData);

  app.route('/api/systems/getExaminationStatus').all(systemsPolicy.isAllowed)
    .get(systems.getExaminationStatus);

  app.route('/api/systems/listFinishedUsers').all(systemsPolicy.isAllowed)
    .get(systems.listFinishedUsers);

  app.route('/api/systems/listUnfinishedUsers').all(systemsPolicy.isAllowed)
    .get(systems.listUnfinishedUsers);

  app.route('/api/systems/banAllUnfinishedUser').all(systemsPolicy.isAllowed)
    .put(systems.banAllUnfinishedUser);
};
