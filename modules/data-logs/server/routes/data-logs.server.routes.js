'use strict';

/**
 * Module dependencies
 */
var dataLogs = require('../controllers/data-logs.server.controller'),
  dataLogsPolicy = require('../policies/data-logs.server.policy');


module.exports = function (app) {
  app.route('/api/userDaysLogs/:userId').all(dataLogsPolicy.isAllowed)
    .get(dataLogs.getUserDaysLogs);

  app.route('/api/userMonthsLogs/:userId').all(dataLogsPolicy.isAllowed)
    .get(dataLogs.getUserMonthsLogs);
};
