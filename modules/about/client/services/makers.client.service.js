(function () {
  'use strict';

  angular
    .module('about.services')
    .factory('MakerGroupService', MakerGroupService);

  MakerGroupService.$inject = ['$resource', 'CacheFactory'];

  function MakerGroupService($resource, CacheFactory) {
    var makerCache = CacheFactory.get('makerCache') || CacheFactory.createCache('makerCache');

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
        method: 'PUT'
      },
      save: {
        method: 'POST',
        url: '/api/makers/create/:userId',
        params: {
          userId: '@userId'
        }
      },
      rating: {
        method: 'PUT',
        url: '/api/makers/:makerId/rating',
        params: {
          makerId: '@_id'
        }
      },
      addMember: {
        method: 'PUT',
        url: '/api/makers/:makerId/addMember/:username',
        params: {
          makerId: '@_id',
          username: '@_username'
        }
      },
      removeMember: {
        method: 'PUT',
        url: '/api/makers/:makerId/removeMember/:username',
        params: {
          makerId: '@_id',
          username: '@_username'
        }
      }
    });
  }
}());
