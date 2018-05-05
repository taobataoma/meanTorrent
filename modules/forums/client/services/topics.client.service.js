(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('TopicsService', TopicsService);

  TopicsService.$inject = ['$resource', 'CacheFactory'];

  function TopicsService($resource, CacheFactory) {
    var forumsCache = CacheFactory.get('forumsCache') || CacheFactory.createCache('forumsCache');
    var removeCache = function (res) {
      forumsCache.removeAll();
      return res.resource;
    };

    return $resource('/api/topics/:forumId/:topicId', {
      forumId: '@forum',
      topicId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: forumsCache
      },
      query: {
        method: 'GET',
        cache: forumsCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      getGlobalTopics: {
        method: 'GET',
        url: '/api/globalTopics',
        isArray: true,
        cache: forumsCache
      },
      toggleTopicReadonly: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicReadonly',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      toggleTopicTopStatus: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicTopStatus',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      toggleTopicGlobalStatus: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicGlobalStatus',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      toggleTopicHomeHelpStatus: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicHomeHelpStatus',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      toggleTopicHomeNoticeStatus: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/toggleTopicHomeNoticeStatus',
        params: {
          forumId: '@forum',
          topicId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      thumbsUp: {
        method: 'PUT',
        url: '/api/topics/:forumId/:topicId/thumbsUp',
        params: {
          forumId: '@forum',
          topicId: '@_id',
          replyId: '@_replyId'
        },
        interceptor: {response: removeCache}
      },
      getHomeHelp: {
        method: 'GET',
        url: '/api/topics/getHomeHelpTopic',
        isArray: true,
        cache: forumsCache
      },
      getHomeNotice: {
        method: 'GET',
        url: '/api/topics/getHomeNoticeTopic',
        isArray: true,
        cache: forumsCache
      },
      getHomeNewTopic: {
        method: 'GET',
        url: '/api/topics/getHomeNewTopic',
        isArray: true,
        cache: forumsCache
      }
    });
  }
}());
