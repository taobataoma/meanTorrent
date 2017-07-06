'use strict';

/**
 * Module dependencies
 */
var forumsPolicy = require('../policies/forums.server.policy'),
  forums = require('../controllers/forums.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/forums').all(forumsPolicy.isAllowed)
    .get(forums.list);

  //Single article routes
  app.route('/api/forums/:forumId').all(forumsPolicy.isAllowed)
    .get(forums.read);

  //Single article routes
  app.route('/api/topics/:forumId').all(forumsPolicy.isAllowed)
    .get(forums.listTopics);

};
