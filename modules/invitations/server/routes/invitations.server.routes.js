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

  app.route('/api/invitations/token/:token').all(invitationsPolicy.isAllowed)
    .get(invitations.verifyToken);

  app.route('/api/invitations/count').all(invitationsPolicy.isAllowed)
    .get(invitations.countInvitations);

  app.route('/api/invitations/official').all(invitationsPolicy.isAllowed)
    .post(invitations.official);

  app.route('/api/invitations/:invitationId').all(invitationsPolicy.isAllowed)
    .put(invitations.update)
    .delete(invitations.delete);

  app.param('invitationId', invitations.invitationByID);
};
