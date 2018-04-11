'use strict';

/**
 * Module dependencies
 */
var ticketsPolicy = require('../policies/tickets.server.policy'),
  tickets = require('../controllers/tickets.server.controller');

module.exports = function (app) {
  app.route('/api/messageTickets').all(ticketsPolicy.isAllowed)
    .get(tickets.list)
    .post(tickets.create)
    .delete(tickets.delete);

  app.route('/api/messageTickets/:messageTicketId').all(ticketsPolicy.isAllowed)
    .delete(tickets.delete)
    .put(tickets.update)
    .post(tickets.createReply);

  app.param('messageTicketId', tickets.messageTicketById);
};
