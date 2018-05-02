(function () {
  'use strict';

  angular
    .module('requests.services')
    .factory('RequestsService', RequestsService);

  RequestsService.$inject = ['$resource', 'CacheFactory'];

  function RequestsService($resource, CacheFactory) {
    var requestsCache = CacheFactory.get('requestsCache') || CacheFactory.createCache('requestsCache');

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
        method: 'PUT'
      },
      accept: {
        method: 'PUT',
        url: '/api/requests/:requestId/accept/:torrentId',
        params: {
          requestId: '@_id',
          torrentId: 'torrentId'
        }
      }
    });
  }
}());
