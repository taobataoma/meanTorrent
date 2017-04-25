(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('SubtitlesService', SubtitlesService);

  SubtitlesService.$inject = ['$resource'];

  function SubtitlesService($resource) {
    var Subtitles = $resource('/api/subtitles/:torrentId', {
      torrentId: '@_torrentId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return Subtitles;
  }
}());
