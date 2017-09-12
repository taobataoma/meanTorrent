(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('CompleteService', CompleteService);

  CompleteService.$inject = ['$resource'];

  function CompleteService($resource) {
    var completes = $resource('/api/completes/:completeId', {
      completeId: '@completeId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return completes;
  }
}());
