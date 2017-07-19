(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('ForumsAdminService', ForumsAdminService);

  ForumsAdminService.$inject = ['$resource'];

  function ForumsAdminService($resource) {
    return $resource('/api/admin/forums/:forumId', {
      forumId: '@_id'
    }, {
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

  ForumsService.$inject = ['$resource'];

  function ForumsService($resource) {
    return $resource('/api/forums/:forumId', {
      forumId: '@_id'
    }, {
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
