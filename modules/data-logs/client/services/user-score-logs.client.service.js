(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('dataLogs.services')
    .factory('UserScoreLogsService', UserScoreLogsService);

  UserScoreLogsService.$inject = ['$resource', 'CacheFactory'];

  function UserScoreLogsService($resource, CacheFactory) {
    var userDataLogsCache = CacheFactory.get('userDataLogsCache') || CacheFactory.createCache('userDataLogsCache');
    var removeCache = function (res) {
      userDataLogsCache.removeAll();
      return res.resource;
    };

    var logs = $resource('/api/userScoreLogs/:userId', {
      userId: '@userId'
    }, {
      get: {
        method: 'GET',
        cache: userDataLogsCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: userDataLogsCache
      }
    });

    return logs;
  }
}());
