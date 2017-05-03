(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('ranking.services')
    .factory('RankingService', RankingService);

  RankingService.$inject = ['$resource'];

  function RankingService($resource) {
    return $resource('/api/ranking', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
