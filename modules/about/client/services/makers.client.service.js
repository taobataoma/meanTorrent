(function () {
  'use strict';

  angular
    .module('about.services')
    .factory('MakerGroupService', MakerGroupService);

  MakerGroupService.$inject = ['$resource'];

  function MakerGroupService($resource) {
    return $resource('/api/makers/:makerId', {
      makerId: '@_id'
    }, {
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
      }
      //,
      //addModerator: {
      //  method: 'PUT',
      //  url: '/api/admin/forums/:forumId/addModerator/:username',
      //  params: {
      //    forumId: '@_id',
      //    username: '@_username'
      //  }
      //}
    });
  }
}());
