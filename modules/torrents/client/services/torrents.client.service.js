(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('TorrentsService', TorrentsService);

  TorrentsService.$inject = ['$resource'];

  function TorrentsService($resource) {
    var Torrents = $resource('/api/torrents/:torrentId', {
      torrentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTMDBInfo: {
        method: 'GET',
        url: '/api/movieinfo/:tmdbid/:language',
        params: {
          tmdbid: '@tmdbid',
          language: '@language'
        }
      },
      setSaleType: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/set/saletype/:saleType',
        params: {
          torrentId: '@_torrentId',
          saleType: '@_saleType'
        }
      }
    });

    return Torrents;
  }
}());
