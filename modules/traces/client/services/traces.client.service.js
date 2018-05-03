(function () {
  'use strict';

  angular
    .module('traces.services')
    .factory('TracesService', TracesService);

  TracesService.$inject = ['$resource', 'CacheFactory'];

  function TracesService($resource, CacheFactory) {
    var tracesCache = CacheFactory.get('tracesCache') || CacheFactory.createCache('tracesCache');
    var removeCache = function (res) {
      tracesCache.removeAll();
      return res.data;
    };

    return $resource('/api/traces/:traceId', {
      traceId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: tracesCache
      },
      query: {
        method: 'GET',
        cache: tracesCache
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
