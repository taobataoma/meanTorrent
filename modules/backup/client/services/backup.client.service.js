(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('backup.services')
    .factory('BackupService', BackupService);

  BackupService.$inject = ['$resource', 'CacheFactory'];

  function BackupService($resource, CacheFactory) {
    var backupCache = CacheFactory.get('backupCache') || CacheFactory.createCache('backupCache');

    var backup = $resource('/api/backup/:filename', {
      filename: '@filename'
    }, {
      get: {
        method: 'GET',
        cache: backupCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: backupCache
      },
      update: {
        method: 'PUT'
      }
    });

    return backup;
  }
}());
