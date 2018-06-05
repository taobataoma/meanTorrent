(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('dataLogs.services')
    .factory('UserAnnounceLogsService', UserAnnounceLogsService);

  UserAnnounceLogsService.$inject = ['$resource', 'CacheFactory'];

  function UserAnnounceLogsService($resource, CacheFactory) {
    var userDataLogsCache = CacheFactory.get('userDataLogsCache') || CacheFactory.createCache('userDataLogsCache');
    var removeCache = function (res) {
      userDataLogsCache.removeAll();
      return res.resource;
    };

    var logs = $resource('/api/userAnnounceLogs/:userId', {
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
