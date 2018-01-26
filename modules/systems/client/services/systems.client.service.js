(function () {
  'use strict';

  angular
    .module('systems.services')
    .factory('SystemsService', SystemsService);

  SystemsService.$inject = ['$resource'];

  function SystemsService($resource) {
    return $resource('/api/systems/:systemId', {
      requestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getSystemConfig: {
        method: 'GET',
        url: '/api/systems/systemConfig'
      }
    });
  }
}());
