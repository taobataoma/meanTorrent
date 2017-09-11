(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('PeersService', PeersService);

  PeersService.$inject = ['$resource'];

  function PeersService($resource) {
    var Torrents = $resource('', {}, {
      getMySeedingList: {
        method: 'GET',
        url: '/api/my/seeding',
        isArray: true
      },
      getMyDownloadingList: {
        method: 'GET',
        url: '/api/my/downloading',
        isArray: true
      },
      getMyWarningList: {
        method: 'GET',
        url: '/api/my/warning',
        isArray: true
      },
      getUserSeedingList: {
        method: 'GET',
        url: '/api/users/:userId/seeding',
        isArray: true,
        params: {
          userId: '@userId'
        }
      },
      getUserLeechingList: {
        method: 'GET',
        url: '/api/users/:userId/leeching',
        isArray: true,
        params: {
          userId: '@userId'
        }
      },
      getUserWarningList: {
        method: 'GET',
        url: '/api/users/:userId/warning',
        isArray: true,
        params: {
          userId: '@userId'
        }
      }
    });

    return Torrents;
  }
}());
