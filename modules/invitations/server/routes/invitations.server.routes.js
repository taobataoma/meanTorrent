'use strict';

/**
 * Module dependencies
 */
var invitationsPolicy = require('../policies/invitations.server.policy'),
  invitations = require('../controllers/invitations.server.controller');

module.exports = function (app) {
  app.route('/api/invitations').all(invitationsPolicy.isAllowed)
    .get(invitations.list)
    .post(invitations.create);

  app.route('/api/invitations/:invitationId').all(invitationsPolicy.isAllowed)
    .put(invitations.update)
    .delete(invitations.delete);

  app.param('invitationId', invitations.invitationByID);
};
