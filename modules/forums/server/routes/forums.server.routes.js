'use strict';

/**
 * Module dependencies
 */
var forumsPolicy = require('../policies/forums.server.policy'),
  forums = require('../controllers/forums.server.controller');

module.exports = function (app) {
  app.route('/api/forums').all(forumsPolicy.isAllowed)
    .get(forums.list);

  app.route('/api/globalTopics').all(forumsPolicy.isAllowed)
    .get(forums.globalTopics);

  app.route('/api/attach/upload').all(forumsPolicy.isAllowed)
    .post(forums.attachUpload);

  app.route('/api/attach/:topicId').all(forumsPolicy.isAllowed)
    .get(forums.attachDownload);
  app.route('/api/attach/:topicId/:replyId').all(forumsPolicy.isAllowed)
    .get(forums.attachDownload);

  app.route('/api/forums/search').all(forumsPolicy.isAllowed)
    .put(forums.forumsSearch);

  app.route('/api/forums/:forumId').all(forumsPolicy.isAllowed)
    .get(forums.read);

  app.route('/api/topics/getHomeHelpTopic').all(forumsPolicy.isAllowed)
    .get(forums.getHomeHelpTopic);

  app.route('/api/topics/getHomeNoticeTopic').all(forumsPolicy.isAllowed)
    .get(forums.getHomeNoticeTopic);

  app.route('/api/topics/getHomeNewTopic').all(forumsPolicy.isAllowed)
    .get(forums.getHomeNewTopic);

  app.route('/api/topics/:forumId').all(forumsPolicy.isAllowed)
    .post(forums.postNewTopic)
    .get(forums.listTopics);

  app.route('/api/topics/:forumId/:topicId').all(forumsPolicy.isAllowed)
    .get(forums.readTopic)
    .put(forums.updateTopic)
    .delete(forums.deleteTopic)
    .post(forums.postNewReply);

  app.route('/api/topics/:forumId/:topicId/toggleTopicReadonly').all(forumsPolicy.isAllowed)
    .put(forums.toggleTopicReadonly);

  app.route('/api/topics/:forumId/:topicId/toggleTopicTopStatus').all(forumsPolicy.isAllowed)
    .put(forums.toggleTopicTopStatus);

  app.route('/api/topics/:forumId/:topicId/toggleTopicGlobalStatus').all(forumsPolicy.isAllowed)
    .put(forums.toggleTopicGlobalStatus);

  app.route('/api/topics/:forumId/:topicId/toggleTopicHomeHelpStatus').all(forumsPolicy.isAllowed)
    .put(forums.toggleTopicHomeHelpStatus);

  app.route('/api/topics/:forumId/:topicId/toggleTopicHomeNoticeStatus').all(forumsPolicy.isAllowed)
    .put(forums.toggleTopicHomeNoticeStatus);

  app.route('/api/topics/:forumId/:topicId/thumbsUp').all(forumsPolicy.isAllowed)
    .put(forums.thumbsUp);

  app.route('/api/topics/:forumId/:topicId/:replyId').all(forumsPolicy.isAllowed)
    .put(forums.updateReply)
    .delete(forums.deleteReply);

  app.param('topicId', forums.topicById);
};
