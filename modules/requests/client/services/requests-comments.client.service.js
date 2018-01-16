(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('requests.services')
    .factory('RequestsCommentsService', RequestsCommentsService);

  RequestsCommentsService.$inject = ['$resource'];

  function RequestsCommentsService($resource) {
    var Comments = $resource('/api/comments/:requestId/:commentId/:subCommentId', {
      requestId: '@_requestId',
      commentId: '@_commentId',
      subCommentId: '@_subCommentId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return Comments;
  }
}());
