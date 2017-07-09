'use strict';

/**
 * Module dependencies
 */
var forumsPolicy = require('../policies/forums.server.policy'),
  forums = require('../controllers/forums.server.controller');

module.exports = function (app) {
  app.route('/api/forums').all(forumsPolicy.isAllowed)
    .get(forums.list);

  app.route('/api/forums/:forumId').all(forumsPolicy.isAllowed)
    .get(forums.read);

  app.route('/api/topics/:forumId').all(forumsPolicy.isAllowed)
    .post(forums.postNewTopic)
    .get(forums.listTopics);

  app.route('/api/topics/:forumId/:topicId').all(forumsPolicy.isAllowed)
    .get(forums.readTopic)
    .put(forums.updateTopic)
    .delete(forums.deleteTopic)
    .post(forums.postNewReply);

  app.route('/api/topics/:forumId/:topicId/:replyId').all(forumsPolicy.isAllowed)
    .put(forums.updateReply)
    .delete(forums.deleteReply);

  app.param('topicId', forums.topicById);
};
