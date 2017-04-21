(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource'];

  function CommentsService($resource) {
    var Comments = $resource('/api/comments/:torrentId/:commentId/:subCommentId', {
      torrentId: '@_torrentId',
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
