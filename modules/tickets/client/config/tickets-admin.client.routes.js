(function () {
  'use strict';

  // Setting up route
  angular
    .module('systems.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tickets', {
        url: '/tickets',
        abstract: true,
        template: '<ui-view/>',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_TICKETS',
          roles: ['oper', 'admin']
        }
      })
      .state('admin.tickets.support', {
        url: '/support',
        templateUrl: '/modules/tickets/client/views/support.client.view.html',
        abstract: true
      })
      .state('admin.tickets.support.message', {
        url: '/message',
        templateUrl: '/modules/tickets/client/views/support-message.client.view.html'
      })
      .state('admin.tickets.support.mail', {
        url: '/mail',
        templateUrl: '/modules/tickets/client/views/support-mail.client.view.html'
      });

  }
}());

