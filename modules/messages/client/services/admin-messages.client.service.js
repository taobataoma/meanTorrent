(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('AdminMessagesService', AdminMessagesService);

  AdminMessagesService.$inject = ['$resource', 'CacheFactory'];

  function AdminMessagesService($resource, CacheFactory) {
    var messagesCache = CacheFactory.get('messagesCache') || CacheFactory.createCache('messagesCache');

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
        method: 'PUT'
      }
    });
  }
}());
