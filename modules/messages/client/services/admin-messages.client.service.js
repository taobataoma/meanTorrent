(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('AdminMessagesService', AdminMessagesService);

  AdminMessagesService.$inject = ['$resource'];

  function AdminMessagesService($resource) {
    return $resource('/api/adminMessages/:adminMessageId', {
      adminMessageId: '@_adminMessageId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
