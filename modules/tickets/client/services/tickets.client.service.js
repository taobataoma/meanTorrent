(function () {
  'use strict';

  angular
    .module('tickets.services')
    .factory('MessageTicketsService', MessageTicketsService);

  MessageTicketsService.$inject = ['$resource'];

  function MessageTicketsService($resource) {
    return $resource('/api/messageTickets/:messageTicketId', {
      requestId: '@_id'
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
      requestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
