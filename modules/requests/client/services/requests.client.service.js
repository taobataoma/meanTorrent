(function () {
  'use strict';

  angular
    .module('requests.services')
    .factory('RequestsService', RequestsService);

  RequestsService.$inject = ['$resource', 'CacheFactory'];

  function RequestsService($resource, CacheFactory) {
    var requestsCache = CacheFactory.get('requestsCache') || CacheFactory.createCache('requestsCache');
    var removeCache = function (res) {
      requestsCache.removeAll();
      return res.data;
    };

    return $resource('/api/requests/:requestId', {
      requestId: '@_id'
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
      },
      accept: {
        method: 'PUT',
        url: '/api/requests/:requestId/accept/:torrentId',
        params: {
          requestId: '@_id',
          torrentId: 'torrentId'
        },
        interceptor: {response: removeCache}
      }
    });
  }
}());
