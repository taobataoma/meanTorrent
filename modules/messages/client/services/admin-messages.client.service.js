(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('AdminMessagesService', AdminMessagesService);

  AdminMessagesService.$inject = ['$resource', 'CacheFactory'];

  function AdminMessagesService($resource, CacheFactory) {
    var messagesCache = CacheFactory.get('messagesCache') || CacheFactory.createCache('messagesCache');
    var removeCache = function (res) {
      messagesCache.removeAll();
      return res.resource;
    };

    return $resource('/api/adminMessages/:adminMessageId', {
      adminMessageId: '@_adminMessageId'
    }, {
      get: {
        method: 'GET',
        cache: messagesCache
      },
      query: {
        method: 'GET',
        isArray: true,
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
      }
    });
  }
}());
