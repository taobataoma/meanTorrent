(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('backup.services')
    .factory('BackupService', BackupService);

  BackupService.$inject = ['$resource'];

  function BackupService($resource) {
    var backup = $resource('/api/backup/:backupId', {
      backupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return backup;
  }
}());
