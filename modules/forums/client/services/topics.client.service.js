(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('TopicsService', TopicsService);

  TopicsService.$inject = ['$resource'];

  function TopicsService($resource) {
    return $resource('/api/topics/:forumId/:topicId', {
      forumId: '@forum',
      topicId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getGlobalTopics: {
        method: 'GET',
        url: '/api/globalTopics',
        isArray: true
      },
      toggleTopicReadonly: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicReadonly',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        }
      },
      toggleTopicTopStatus: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicTopStatus',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        }
      },
      toggleTopicGlobalStatus: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicGlobalStatus',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        }
      },
      thumbsUp: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/thumbsUp',
        params: {
          forumId: '@forum',
          topicId: '@_id',
          replyId: '@_replyId'
        }
      }
    });
  }
}());
