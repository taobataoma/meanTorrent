(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('medals.services')
    .factory('MedalsService', MedalsService);

  MedalsService.$inject = ['$resource', 'CacheFactory'];

  function MedalsService($resource, CacheFactory) {
    var medalsCache = CacheFactory.get('medalsCache') || CacheFactory.createCache('medalsCache');
    var removeCache = function (res) {
      medalsCache.removeAll();
      return res.resource;
    };

    var medal = $resource('/api/medals/:userId/:medalName', {
      userId: '@userId',
      medalName: '@medalName'
    }, {
      count: {
        method: 'GET',
        isArray: true
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: medalsCache
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
      view: {
        method: 'GET',
        url: '/api/medals/view/:medalName',
        params: {
          medalName: '@medalName'
        },
        cache: medalsCache
      },
      request: {
        method: 'PUT',
        url: '/api/medals/request/:medalName',
        params: {
          medalName: '@medalName'
        },
        interceptor: {response: removeCache}
      }
    });

    return medal;
  }
}());
