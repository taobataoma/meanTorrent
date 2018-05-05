(function () {
  'use strict';

  angular
    .module('about.services')
    .factory('MakerGroupService', MakerGroupService);

  MakerGroupService.$inject = ['$resource', 'CacheFactory'];

  function MakerGroupService($resource, CacheFactory) {
    var makerCache = CacheFactory.get('makerCache') || CacheFactory.createCache('makerCache');
    var removeCache = function (res) {
      makerCache.removeAll();
      return res.resource;
    };

    return $resource('/api/makers/:makerId', {
      makerId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: makerCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: makerCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        url: '/api/makers/create/:userId',
        params: {
          userId: '@userId'
        },
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
      rating: {
        method: 'PUT',
        url: '/api/makers/:makerId/rating',
        params: {
          makerId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      addMember: {
        method: 'PUT',
        url: '/api/makers/:makerId/addMember/:username',
        params: {
          makerId: '@_id',
          username: '@_username'
        },
        interceptor: {response: removeCache}
      },
      removeMember: {
        method: 'PUT',
        url: '/api/makers/:makerId/removeMember/:username',
        params: {
          makerId: '@_id',
          username: '@_username'
        },
        interceptor: {response: removeCache}
      }
    });
  }
}());
