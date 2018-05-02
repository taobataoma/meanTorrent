(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource', 'CacheFactory'];

  function MessagesService($resource, CacheFactory) {
    var messagesCache = CacheFactory.get('messagesCache') || CacheFactory.createCache('messagesCache');

    return $resource('/api/messages/:messageId', {
      messageId: '@_messageId'
    }, {
      get: {
        method: 'GET',
        cache: messagesCache
      },
      query: {
        method: 'GET',
        cache: messagesCache
      },
      update: {
        method: 'PUT'
      },
      countUnread: {
        url: '/api/messages/countUnread',
        method: 'GET'
      }
    });
  }
}());
