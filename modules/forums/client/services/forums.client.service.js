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
      }
    });
  }
}());
