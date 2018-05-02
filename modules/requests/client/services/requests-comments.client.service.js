(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('requests.services')
    .factory('RequestsCommentsService', RequestsCommentsService);

  RequestsCommentsService.$inject = ['$resource', 'CacheFactory'];

  function RequestsCommentsService($resource, CacheFactory) {
    var requestsCache = CacheFactory.get('requestsCache') || CacheFactory.createCache('requestsCache');

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
        method: 'PUT'
      }
    });

    return Comments;
  }
}());
