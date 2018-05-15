(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('check.services')
    .factory('CheckService', CheckService);

  CheckService.$inject = ['$resource'];

  function CheckService($resource) {
    var Check = $resource('/api/check', {}, {
      get: {
        method: 'GET'
      },
      update: {
        method: 'PUT'
      }
    });

    return Check;
  }

}());
