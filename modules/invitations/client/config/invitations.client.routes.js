(function () {
  'use strict';

  // Setting up route
  angular
    .module('invitations.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('invitations', {
        abstract: true,
        url: '/invitations',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('invitations.detail', {
        url: '/detail',
        templateUrl: '/modules/invitations/client/views/detail.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.INVITATIONS'
        }
      });
  }
}());
