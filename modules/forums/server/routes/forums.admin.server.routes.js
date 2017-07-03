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

  // Finish by binding the article middleware
  app.param('forumId', forums.forumByID);
};
