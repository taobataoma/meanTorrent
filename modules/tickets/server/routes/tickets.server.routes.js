'use strict';

/**
 * Module dependencies
 */
var ticketsPolicy = require('../policies/tickets.server.policy'),
  messageTickets = require('../controllers/messageTickets.server.controller'),
  mailTickets = require('../controllers/mailTickets.server.controller');

module.exports = function (app) {
  app.route('/api/messageTickets').all(ticketsPolicy.isAllowed)
    .get(messageTickets.list)
    .post(messageTickets.create);

  app.route('/api/messageTickets/uploadTicketImage').all(ticketsPolicy.isAllowed)
    .post(messageTickets.uploadTicketImage);

  app.route('/api/messageTickets/:messageTicketId').all(ticketsPolicy.isAllowed)
    .get(messageTickets.read)
    .delete(messageTickets.delete)
    .put(messageTickets.update)
    .post(messageTickets.createReply);

  app.route('/api/messageTickets/:messageTicketId/:replyId').all(ticketsPolicy.isAllowed)
    .delete(messageTickets.deleteReply)
    .put(messageTickets.updateReply);


  app.route('/api/mailTickets').all(ticketsPolicy.isAllowed)
    .get(mailTickets.list)
    .delete(mailTickets.delete);

  app.route('/api/mailTickets/:mailTicketId').all(ticketsPolicy.isAllowed)
    .get(mailTickets.read)
    .delete(mailTickets.delete)
    .put(mailTickets.update)
    .post(mailTickets.createReply);

  app.param('messageTicketId', messageTickets.messageTicketById);
  app.param('mailTicketId', mailTickets.mailTicketById);
};
