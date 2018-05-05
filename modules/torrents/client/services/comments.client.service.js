(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('CommentsService', CommentsService);

  CommentsService.$inject = ['$resource', 'CacheFactory', 'TorrentsService'];

  function CommentsService($resource, CacheFactory, TorrentsService) {
    var torrentsCache = CacheFactory.get('torrentsCache') || CacheFactory.createCache('torrentsCache');
    var removeCache = function (res) {
      torrentsCache.removeAll();
      return new TorrentsService(res.resource);
    };

    var Comments = $resource('/api/comments/:torrentId/:commentId/:subCommentId', {
      torrentId: '@_torrentId',
      commentId: '@_commentId',
      subCommentId: '@_subCommentId'
    }, {
      get: {
        method: 'GET',
        cache: torrentsCache
      },
      query: {
        method: 'GET',
        cache: torrentsCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      }
    });

    return Comments;
  }
}());
