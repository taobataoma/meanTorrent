'use strict';

/**
 * Module dependencies
 */
var messagesPolicy = require('../policies/messages.server.policy'),
  messages = require('../controllers/messages.server.controller');

module.exports = function (app) {
  app.route('/api/messages').all(messagesPolicy.isAllowed)
    .get(messages.list)
    .post(messages.create)
    .delete(messages.delete);

  app.route('/api/messages/:messageId').all(messagesPolicy.isAllowed)
    .get(messages.listReply)
    .put(messages.update)
    .delete(messages.delete)
    .post(messages.createReply);

  app.route('/api/messages/:messageId/:replyId').all(messagesPolicy.isAllowed)
    .delete(messages.deleteReply);

  app.param('messageId', messages.messageByID);
};
