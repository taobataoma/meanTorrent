(function () {
  'use strict';

  angular
    .module('traces.services')
    .factory('TracesService', TracesService);

  TracesService.$inject = ['$resource'];

  function TracesService($resource) {
    return $resource('/api/traces/:traceId', {
      traceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
