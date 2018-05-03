(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('requests.services')
    .factory('RequestsCommentsService', RequestsCommentsService);

  RequestsCommentsService.$inject = ['$resource', 'CacheFactory'];

  function RequestsCommentsService($resource, CacheFactory) {
    var requestsCache = CacheFactory.get('requestsCache') || CacheFactory.createCache('requestsCache');
    var removeCache = function (res) {
      requestsCache.removeAll();
      return res.data;
    };

    var Comments = $resource('/api/reqComments/:requestId/:commentId/:subCommentId', {
      requestId: '@_requestId',
      commentId: '@_commentId',
      subCommentId: '@_subCommentId'
    }, {
      get: {
        method: 'GET',
        cache: requestsCache
      },
      query: {
        method: 'GET',
        cache: requestsCache
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

    return Comments;
  }
}());
