(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('AdminMessagesService', AdminMessagesService);

  AdminMessagesService.$inject = ['$resource', 'CacheFactory'];

  function AdminMessagesService($resource, CacheFactory) {
    var adminMessagesCache = CacheFactory.get('adminMessagesCache') || CacheFactory.createCache('adminMessagesCache');
    var removeCache = function (res) {
      adminMessagesCache.removeAll();
      return res.data;
    };

    return $resource('/api/adminMessages/:adminMessageId', {
      adminMessageId: '@_adminMessageId'
    }, {
      get: {
        method: 'GET',
        cache: adminMessagesCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: adminMessagesCache
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
