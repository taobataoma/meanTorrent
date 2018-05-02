(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource', 'CacheFactory'];

  function CommentsService($resource, CacheFactory) {
    var commentsCache = CacheFactory.get('commentsCache') || CacheFactory.createCache('commentsCache');

    var Comments = $resource('/api/comments/:torrentId/:commentId/:subCommentId', {
      torrentId: '@_torrentId',
      commentId: '@_commentId',
      subCommentId: '@_subCommentId'
    }, {
      get: {
        method: 'GET',
        cache: commentsCache
      },
      query: {
        method: 'GET',
        cache: commentsCache
      },
      update: {
        method: 'PUT'
      }
    });

    return Comments;
  }
}());
