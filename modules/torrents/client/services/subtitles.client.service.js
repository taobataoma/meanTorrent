(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('SubtitlesService', SubtitlesService);

  SubtitlesService.$inject = ['$resource', 'CacheFactory', 'TorrentsService'];

  function SubtitlesService($resource, CacheFactory, TorrentsService) {
    var torrentsCache = CacheFactory.get('torrentsCache') || CacheFactory.createCache('torrentsCache');
    var removeCache = function (res) {
      torrentsCache.removeAll();
      return new TorrentsService(res.resource);
    };

    var Subtitles = $resource('/api/subtitles/:torrentId/:subtitleId', {
      torrentId: '@_torrentId',
      subtitleId: '@_subtitleId'
    }, {
      get: {
        method: 'GET',
        cache: torrentsCache
      },
      query: {
        method: 'GET',
        isArray: true,
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

    return Subtitles;
  }
}());
