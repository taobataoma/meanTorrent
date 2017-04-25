(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('SubtitlesService', SubtitlesService);

  SubtitlesService.$inject = ['$resource'];

  function SubtitlesService($resource) {
    var Subtitles = $resource('/api/subtitles/:torrentId/:subtitleId', {
      torrentId: '@_torrentId',
      subtitleId: '@_subtitleId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return Subtitles;
  }
}());
