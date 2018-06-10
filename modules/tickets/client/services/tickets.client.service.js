(function () {
  'use strict';

  angular
    .module('tickets.services')
    .factory('MessageTicketsService', MessageTicketsService);

  MessageTicketsService.$inject = ['$resource', 'CacheFactory'];

  function MessageTicketsService($resource, CacheFactory) {
    var messagesTicketsCache = CacheFactory.get('messagesTicketsCache') || CacheFactory.createCache('messagesTicketsCache');
    var removeCache = function (res) {
      messagesTicketsCache.removeAll();
      return res.resource;
    };

    return $resource('/api/messageTickets/:messageTicketId/:replyId', {
      messageTicketId: '@_id',
      replyId: '@_rid'
    }, {
      get: {
        method: 'GET',
        cache: messagesTicketsCache
      },
      query: {
        method: 'GET',
        cache: messagesTicketsCache
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
      handle: {
        method: 'PUT',
        url: '/api/messageTickets/handle/:messageTicketId',
        params: {
          messageTicketId: '@messageTicketId'
        },
        interceptor: {response: removeCache}
      },
      solved: {
        method: 'PUT',
        url: '/api/messageTickets/solved/:messageTicketId',
        params: {
          messageTicketId: '@messageTicketId'
        },
        interceptor: {response: removeCache}
      },
      getOpenedCount: {
        method: 'GET',
        url: '/api/messageTickets/openedCount'
      }
    });
  }

  angular
    .module('tickets.services')
    .factory('MailTicketsService', MailTicketsService);

  MailTicketsService.$inject = ['$resource', 'CacheFactory'];

  function MailTicketsService($resource, CacheFactory) {
    var mailTicketsCache = CacheFactory.get('mailTicketsCache') || CacheFactory.createCache('mailTicketsCache');
    var removeCache = function (res) {
      mailTicketsCache.removeAll();
      return res.resource;
    };

    return $resource('/api/mailTickets/:mailTicketId', {
      mailTicketId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: mailTicketsCache
      },
      query: {
        method: 'GET',
        cache: mailTicketsCache
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
      getOpenedCount: {
        method: 'GET',
        url: '/api/mailTickets/openedCount'
      },
      getOpenedAllCount: {
        method: 'GET',
        url: '/api/mailTickets/openedAllCount'
      }
    });
  }
}());
