'use strict';

/**
 * Module dependencies
 */
var messagesPolicy = require('../policies/messages.server.policy'),
  messages = require('../controllers/messages.server.controller');

module.exports = function (app) {
  app.route('/api/messages').all(messagesPolicy.isAllowed)
    .get(messages.list)
    .post(messages.create);

  app.route('/api/messages/:messageId').all(messagesPolicy.isAllowed)
    .put(messages.update)
    .delete(messages.delete);

  app.param('messageId', messages.messageByID);
};
