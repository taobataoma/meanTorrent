(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource'];

  function MessagesService($resource) {
    return $resource('/api/messages/:messageId', {
      messageId: '@_messageId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
