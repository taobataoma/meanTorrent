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
      }
    });
  }
}());
