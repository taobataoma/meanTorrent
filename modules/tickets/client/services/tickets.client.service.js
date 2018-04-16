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
