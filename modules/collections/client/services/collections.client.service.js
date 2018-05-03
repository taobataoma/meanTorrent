(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('collections.services')
    .factory('CollectionsService', CollectionsService);

  CollectionsService.$inject = ['$resource', 'CacheFactory'];

  function CollectionsService($resource, CacheFactory) {
    var collectionsCache = CacheFactory.get('collectionsCache') || CacheFactory.createCache('collectionsCache');
    var removeCache = function (res) {
      collectionsCache.removeAll();
      return res.data;
    };

    var collection = $resource('/api/collections/:collectionId', {
      collectionId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: collectionsCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: collectionsCache
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
      searchCollectionInfo: {
        method: 'GET',
        url: '/api/search/collection/:language',
        params: {
          language: '@language'
        }
      },
      getCollectionInfo: {
        method: 'GET',
        url: '/api/collectionInfo/:id/:language',
        params: {
          id: '@id',
          language: '@language'
        }
      },
      insertIntoCollection: {
        method: 'PUT',
        url: '/api/collections/:collectionId/insert/:torrentId',
        params: {
          collectionId: '@collectionId',
          torrentId: '@torrentId'
        },
        interceptor: {response: removeCache}
      },
      removeFromCollection: {
        method: 'PUT',
        url: '/api/collections/:collectionId/remove/:torrentId',
        params: {
          collectionId: '@collectionId',
          torrentId: '@torrentId'
        },
        interceptor: {response: removeCache}
      },
      setRecommendLevel: {
        method: 'PUT',
        url: '/api/collections/:collectionId/set/recommendlevel/:rlevel',
        params: {
          collectionId: '@_id',
          rlevel: '@rlevel'
        },
        interceptor: {response: removeCache}
      }

    });

    return collection;
  }
}());
