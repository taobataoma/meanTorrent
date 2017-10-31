'use strict';

/**
 * Module dependencies
 */
var backup = require('../controllers/backup.server.controller'),
  backupPolicy = require('../policies/backup.server.policy');


module.exports = function (app) {
  app.route('/api/backup').all(backupPolicy.isAllowed)
    .get(backup.list)
    .delete(backup.delete);
};
