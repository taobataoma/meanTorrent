(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('ForumsService', ForumsService);

  ForumsService.$inject = ['$resource'];

  function ForumsService($resource) {
    return $resource('/api/forums/:forumId', {
      forumId: '@_Id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
