(function () {
  'use strict';

  angular
    .module('traces.services')
    .factory('TracesService', TracesService);

  TracesService.$inject = ['$resource', 'CacheFactory'];

  function TracesService($resource, CacheFactory) {
    var tracesCache = CacheFactory.get('tracesCache') || CacheFactory.createCache('tracesCache');

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
        method: 'PUT'
      }
    });
  }
}());
