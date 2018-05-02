(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('ForumsAdminService', ForumsAdminService);

  ForumsAdminService.$inject = ['$resource', 'CacheFactory'];

  function ForumsAdminService($resource, CacheFactory) {
    var forumsCache = CacheFactory.get('forumsCache') || CacheFactory.createCache('forumsCache');

    return $resource('/api/admin/forums/:forumId', {
      forumId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: forumsCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: forumsCache
      },
      update: {
        method: 'PUT'
      },
      addModerator: {
        method: 'PUT',
        url: '/api/admin/forums/:forumId/addModerator/:username',
        params: {
          forumId: '@_id',
          username: '@_username'
        }
      },
      removeModerator: {
        method: 'PUT',
        url: '/api/admin/forums/:forumId/removeModerator/:username',
        params: {
          forumId: '@_id',
          username: '@_username'
        }
      }
    });
  }

  angular
    .module('forums.services')
    .factory('ForumsService', ForumsService);

  ForumsService.$inject = ['$resource', 'CacheFactory'];

  function ForumsService($resource, CacheFactory) {
    var forumsCache = CacheFactory.get('forumsCache') || CacheFactory.createCache('forumsCache');

    return $resource('/api/forums/:forumId', {
      forumId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: forumsCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: forumsCache
      },
      update: {
        method: 'PUT'
      },
      search: {
        method: 'PUT',
        url: '/api/forums/search'
      }
    });
  }
}());
