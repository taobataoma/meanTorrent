(function () {
  'use strict';

  angular
    .module('tickets.services')
    .factory('MessageTicketsService', MessageTicketsService);

  MessageTicketsService.$inject = ['$resource'];

  function MessageTicketsService($resource) {
    return $resource('/api/messageTickets/:messageTicketId/:replyId', {
      messageTicketId: '@_id',
      replyId: '@_rid'
    }, {
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
      }
    });
  }

  angular
    .module('tickets.services')
    .factory('MailTicketsService', MailTicketsService);

  MailTicketsService.$inject = ['$resource'];

  function MailTicketsService($resource) {
    return $resource('/api/mailTickets/:mailTicketId', {
      mailTicketId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
