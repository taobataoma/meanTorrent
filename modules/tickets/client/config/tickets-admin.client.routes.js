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
          roles: ['oper', 'admin']
        }
      })
      .state('admin.tickets.support', {
        url: '/support',
        templateUrl: '/modules/tickets/client/views/support.client.view.html'
      });

  }
}());

