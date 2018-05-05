(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('CompleteService', CompleteService);

  CompleteService.$inject = ['$resource', 'CacheFactory'];

  function CompleteService($resource, CacheFactory) {
    var completesCache = CacheFactory.get('completesCache') || CacheFactory.createCache('completesCache');
    var removeCache = function (res) {
      completesCache.removeAll();
      return res.resource;
    };

    var completes = $resource('/api/completes/:completeId', {
      completeId: '@completeId'
    }, {
      get: {
        method: 'GET',
        cache: completesCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: completesCache
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

    return completes;
  }
}());
