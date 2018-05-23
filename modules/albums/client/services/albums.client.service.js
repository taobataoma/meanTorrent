(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('albums.services')
    .factory('AlbumsService', AlbumsService);

  AlbumsService.$inject = ['$resource', 'CacheFactory'];

  function AlbumsService($resource, CacheFactory) {
    var albumsCache = CacheFactory.get('albumsCache') || CacheFactory.createCache('albumsCache');
    var removeCache = function (res) {
      albumsCache.removeAll();
      return res.resource;
    };

    var album = $resource('/api/albums/:albumId', {
      albumId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: albumsCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: albumsCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      insertIntoAlbum: {
        method: 'PUT',
        url: '/api/albums/:albumId/insert/:torrentId',
        params: {
          albumId: '@albumId',
          torrentId: '@torrentId'
        },
        interceptor: {response: removeCache}
      },
      removeFromAlbum: {
        method: 'PUT',
        url: '/api/albums/:albumId/remove/:torrentId',
        params: {
          albumId: '@albumId',
          torrentId: '@torrentId'
        },
        interceptor: {response: removeCache}
      },
      setRecommendLevel: {
        method: 'PUT',
        url: '/api/albums/:albumId/set/recommendlevel/:rlevel',
        params: {
          albumId: '@_id',
          rlevel: '@rlevel'
        },
        interceptor: {response: removeCache}
      },
      toggleHomeItemStatus: {
        method: 'PUT',
        url: '/api/albums/:albumId/toggleHomeItemStatus',
        params: {
          albumId: '@_id'
        },
        interceptor: {response: removeCache}
      }

    });

    return album;
  }
}());
