(function () {
  'use strict';

  angular
    .module('forums.services')
    .factory('RepliesService', RepliesService);

  RepliesService.$inject = ['$resource'];

  function RepliesService($resource) {
    return $resource('/api/topics/:forumId/:topicId/:replyId', {
      forumId: '@forum',
      topicId: '@topic',
      replyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
