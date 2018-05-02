(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('SubtitlesService', SubtitlesService);

  SubtitlesService.$inject = ['$resource', 'CacheFactory'];

  function SubtitlesService($resource, CacheFactory) {
    var subtitlesCache = CacheFactory.get('subtitlesCache') || CacheFactory.createCache('subtitlesCache');

    var Subtitles = $resource('/api/subtitles/:torrentId/:subtitleId', {
      torrentId: '@_torrentId',
      subtitleId: '@_subtitleId'
    }, {
      get: {
        method: 'GET',
        cache: subtitlesCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: subtitlesCache
      },
      update: {
        method: 'PUT'
      }
    });

    return Subtitles;
  }
}());
