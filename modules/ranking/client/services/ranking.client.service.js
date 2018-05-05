(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('ranking.services')
    .factory('RankingService', RankingService);

  RankingService.$inject = ['$resource', 'CacheFactory'];

  function RankingService($resource, CacheFactory) {
    var rankingCache = CacheFactory.get('rankingCache') || CacheFactory.createCache('rankingCache');
    var removeCache = function (res) {
      rankingCache.removeAll();
      return res.resource;
    };

    return $resource('/api/ranking', {
      userId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: rankingCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: rankingCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      }
    });
  }
}());
