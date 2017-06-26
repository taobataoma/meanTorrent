(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource'];

  function MessagesService($resource) {
    return $resource('/api/adminMessages/:adminMessageId', {
      adminMessageId: '@_adminMessageId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
