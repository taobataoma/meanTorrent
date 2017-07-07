(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('TopicsService', TopicsService);

  TopicsService.$inject = ['$resource'];

  function TopicsService($resource) {
    return $resource('/api/topics/:forumId/:topicId', {
      forumId: '@_forumId',
      topicId: '@_topicId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
