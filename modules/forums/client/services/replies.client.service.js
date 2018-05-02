(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('RepliesService', RepliesService);

  RepliesService.$inject = ['$resource', 'CacheFactory'];

  function RepliesService($resource, CacheFactory) {
    var forumsCache = CacheFactory.get('forumsCache') || CacheFactory.createCache('forumsCache');

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
        method: 'PUT'
      }
    });
  }
}());
