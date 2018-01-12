(function () {
  'use strict';

  angular
    .module('requests.services')
    .factory('RequestsService', RequestsService);

  RequestsService.$inject = ['$resource'];

  function RequestsService($resource) {
    return $resource('/api/requests/:requestId', {
      requestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      accept: {
        method: 'PUT',
        url: '/api/requests/:requestId/accept/:torrentId',
        params: {
          requestId: '@_id',
          torrentId: 'torrentId'
        }
      }
    });
  }
}());
