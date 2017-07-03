'use strict';

/**
 * Module dependencies
 */
var forumsPolicy = require('../policies/forums.server.policy'),
  forums = require('../controllers/forums.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/forums').all(forumsPolicy.isAllowed)
    .get(forums.list)
    .post(forums.create);

  // Single article routes
  app.route('/api/forums/:forumId').all(forumsPolicy.isAllowed)
    .put(forums.update)
    .delete(forums.delete);

  // Finish by binding the article middleware
  app.param('forumId', forums.forumByID);
};
