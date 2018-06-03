(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('PeersService', PeersService);

  PeersService.$inject = ['$resource', 'CacheFactory'];

  function PeersService($resource, CacheFactory) {
    var peersCache = CacheFactory.get('peersCache') || CacheFactory.createCache('peersCache');

    var Peers = $resource('', {}, {
      getMySeedingList: {
        method: 'GET',
        url: '/api/my/seeding',
        isArray: true,
        cache: peersCache
      },
      getMyDownloadingList: {
        method: 'GET',
        url: '/api/my/downloading',
        isArray: true,
        cache: peersCache
      },
      getMyWarningList: {
        method: 'GET',
        url: '/api/my/warning',
        isArray: true,
        cache: peersCache
      },
      getMyPeers: {
        method: 'GET',
        url: '/api/my/peers',
        isArray: true
      },
      getUserSeedingList: {
        method: 'GET',
        url: '/api/users/:userId/seeding',
        isArray: true,
        params: {
          userId: '@userId'
        },
        cache: peersCache
      },
      getUserLeechingList: {
        method: 'GET',
        url: '/api/users/:userId/leeching',
        isArray: true,
        params: {
          userId: '@userId'
        },
        cache: peersCache
      },
      getUserWarningList: {
        method: 'GET',
        url: '/api/users/:userId/warning',
        isArray: true,
        params: {
          userId: '@userId'
        },
        cache: peersCache
      }
    });

    return Peers;
  }
}());
