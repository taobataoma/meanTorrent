(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('favorites.services')
    .factory('FavoritesService', FavoritesService);

  FavoritesService.$inject = ['$resource', 'CacheFactory'];

  function FavoritesService($resource, CacheFactory) {
    var favoritesCache = CacheFactory.get('favoritesCache') || CacheFactory.createCache('favoritesCache');
    var removeCache = function (res) {
      favoritesCache.removeAll();
      return res.resource;
    };

    var medal = $resource('/api/favorites/:favoriteId', {
      favoriteId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: favoritesCache
      },
      query: {
        method: 'GET',
        cache: favoritesCache
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
      addTorrent: {
        method: 'POST',
        url: '/api/favorites/add/:torrentId',
        params: {
          torrentId: '@torrentId'
        },
        interceptor: {response: removeCache}
      }
    });

    return medal;
  }
}());
