(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('dataLogs.services')
    .factory('UserMonthsLogsService', UserMonthsLogsService);

  UserMonthsLogsService.$inject = ['$resource', 'CacheFactory'];

  function UserMonthsLogsService($resource, CacheFactory) {
    var userDataLogsCache = CacheFactory.get('userDataLogsCache') || CacheFactory.createCache('userDataLogsCache');
    var removeCache = function (res) {
      userDataLogsCache.removeAll();
      return res.resource;
    };

    var logs = $resource('/api/userMonthsLogs/:userId', {
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
