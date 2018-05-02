(function () {
  'use strict';

  angular
    .module('tickets.services')
    .factory('MessageTicketsService', MessageTicketsService);

  MessageTicketsService.$inject = ['$resource', 'CacheFactory'];

  function MessageTicketsService($resource, CacheFactory) {
    var ticketsCache = CacheFactory.get('ticketsCache') || CacheFactory.createCache('ticketsCache');

    return $resource('/api/messageTickets/:messageTicketId/:replyId', {
      messageTicketId: '@_id',
      replyId: '@_rid'
    }, {
      get: {
        method: 'GET',
        cache: ticketsCache
      },
      query: {
        method: 'GET',
        cache: ticketsCache
      },
      update: {
        method: 'PUT'
      },
      handle: {
        method: 'PUT',
        url: '/api/messageTickets/handle/:messageTicketId',
        params: {
          messageTicketId: '@messageTicketId'
        }
      },
      solved: {
        method: 'PUT',
        url: '/api/messageTickets/solved/:messageTicketId',
        params: {
          messageTicketId: '@messageTicketId'
        }
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
    var ticketsCache = CacheFactory.get('ticketsCache') || CacheFactory.createCache('ticketsCache');

    return $resource('/api/mailTickets/:mailTicketId', {
      mailTicketId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: ticketsCache
      },
      query: {
        method: 'GET',
        cache: ticketsCache
      },
      update: {
        method: 'PUT'
      },
      getOpenedCount: {
        method: 'GET',
        url: '/api/mailTickets/openedCount'
      }
    });
  }
}());
