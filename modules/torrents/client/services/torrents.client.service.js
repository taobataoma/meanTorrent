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
      getTMDBMovieInfo: {
        method: 'GET',
        url: '/api/movieinfo/:tmdbid/:language',
        params: {
          tmdbid: '@tmdbid',
          language: '@language'
        }
      },
      getTMDBTVInfo: {
        method: 'GET',
        url: '/api/tvinfo/:tmdbid/:language',
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
      },
      setRecommendLevel: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/set/recommendlevel/:rlevel',
        params: {
          torrentId: '@_torrentId',
          rlevel: '@_rlevel'
        }
      },
      setReviewedStatus: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/set/reviewed',
        params: {
          torrentId: '@_torrentId'
        }
      },
      thumbsUp: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/thumbsUp',
        params: {
          torrentId: '@_id'
        }
      }
    });

    return Torrents;
  }
}());
