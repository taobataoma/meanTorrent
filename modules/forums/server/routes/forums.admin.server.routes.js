'use strict';

/**
 * Module dependencies
 */
var forumsPolicy = require('../policies/forums.admin.server.policy'),
  forums = require('../controllers/forums.admin.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/admin/forums').all(forumsPolicy.isAllowed)
    .get(forums.list)
    .post(forums.create);

  // Single article routes
  app.route('/api/admin/forums/:forumId').all(forumsPolicy.isAllowed)
    .put(forums.update)
    .delete(forums.delete);

  // Single article routes
  app.route('/api/admin/forums/:forumId/addModerator/:username').all(forumsPolicy.isAllowed)
    .put(forums.addModerator);

  // Single article routes
  app.route('/api/admin/forums/:forumId/removeModerator/:username').all(forumsPolicy.isAllowed)
    .put(forums.removeModerator);

  // Finish by binding the article middleware
  app.param('forumId', forums.forumByID);
  app.param('username', forums.userByUsername);
};
