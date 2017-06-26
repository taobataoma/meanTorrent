'use strict';

/**
 * Module dependencies
 */
var adminMessagesPolicy = require('../policies/admin-messages.server.policy'),
  adminMessages = require('../controllers/admin-messages.server.controller');

module.exports = function (app) {
  app.route('/api/adminMessages').all(adminMessagesPolicy.isAllowed)
    .get(adminMessages.list)
    .post(adminMessages.create);

  app.route('/api/adminMessages/:adminMessageId').all(adminMessagesPolicy.isAllowed)
    .delete(adminMessages.delete);

  app.param('adminMessageId', adminMessages.adminMessageByID);
};
