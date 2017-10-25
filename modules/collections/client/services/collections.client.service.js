(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('collections.services')
    .factory('CollectionsService', CollectionsService);

  CollectionsService.$inject = ['$resource'];

  function CollectionsService($resource) {
    var collection = $resource('/api/collections/:collectionId', {
      collectionId: '@_id'
    }, {
      update: {
        method: 'PUT'
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
        }
      },
      removeFromCollection: {
        method: 'PUT',
        url: '/api/collections/:collectionId/remove/:torrentId',
        params: {
          collectionId: '@collectionId',
          torrentId: '@torrentId'
        }
      },
      setRecommendLevel: {
        method: 'PUT',
        url: '/api/collections/:collectionId/set/recommendlevel/:rlevel',
        params: {
          collectionId: '@_id',
          rlevel: '@rlevel'
        }
      }

    });

    return collection;
  }
}());
