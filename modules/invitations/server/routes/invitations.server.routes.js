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
};
