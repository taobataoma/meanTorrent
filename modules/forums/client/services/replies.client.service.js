(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('RepliesService', RepliesService);

  RepliesService.$inject = ['$resource', 'CacheFactory'];

  function RepliesService($resource, CacheFactory) {
    var forumsCache = CacheFactory.get('forumsCache') || CacheFactory.createCache('forumsCache');
    var removeCache = function (res) {
      forumsCache.removeAll();
      return res.resource;
    };

    return $resource('/api/topics/:forumId/:topicId/:replyId', {
      forumId: '@forum',
      topicId: '@topic',
      replyId: '@_id'
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
      }
    });
  }
}());
