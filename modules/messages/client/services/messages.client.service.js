(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource', 'CacheFactory'];

  function MessagesService($resource, CacheFactory) {
    var messagesCache = CacheFactory.get('messagesCache') || CacheFactory.createCache('messagesCache');
    var removeCache = function (res) {
      messagesCache.removeAll();
      return res.data;
    };

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
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      countUnread: {
        url: '/api/messages/countUnread',
        method: 'GET'
      }
    });
  }
}());
